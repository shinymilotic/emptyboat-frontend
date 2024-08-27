import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  inject,
} from "@angular/core";
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  FormsModule,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ListErrorsComponent } from "../../shared/list-errors.component";
import { NgForOf, NgFor, AsyncPipe } from "@angular/common";
import { ArticlesService } from "../../core/services/articles.service";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, map, takeUntil, tap } from "rxjs/operators";
import { UserService } from "../../core/services/user.service";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { TagsService } from "src/app/core/services/tags.service";
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { ApiError } from "src/app/core/models/apierrors.model";
import { Article } from "src/app/core/models/blog/article.model";
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

interface ArticleForm {
  title: FormControl<string>;
  description: FormControl<string>;
  body: FormControl<string>;
}

@Component({
    selector: "app-editor-page",
    templateUrl: "./editor.component.html",
    styleUrls: ["./editor.component.scss"],
    standalone: true,
    imports: [
        ListErrorsComponent,
        ReactiveFormsModule,
        NgForOf,
        ReactiveFormsModule,
        NgFor,
        AsyncPipe,
        InputTextModule,
        FormsModule,
        DropdownModule
    ]
})
export class EditorComponent implements OnInit, OnDestroy {
  articleForm: FormGroup<ArticleForm>;
  errors!: ApiError;
  isSubmitting = false;
  destroy$ = new Subject<void>();
  filteredTags: string[] = [];
  inTags: string[] = [];
  allTags!: string[];
  tagsLoaded = false;
  @ViewChild("tagInput") tagInput!: ElementRef<HTMLInputElement>;
  @ViewChild("tagInputTextElement")
  tagInputTextElement!: ElementRef<HTMLInputElement>;
  announcer = inject(LiveAnnouncer);
  isUpdate: boolean = false;
  isInputTag: boolean = true;
  activeElement: Element | null = null;
  editor!: Editor;
  items: Array<any> = [];
  constructor(
    private readonly articleService: ArticlesService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly tagsService: TagsService
  ) {
    this.articleForm = new FormGroup<ArticleForm>({
      title: new FormControl("", { nonNullable: true }),
      description: new FormControl("", { nonNullable: true }),
      body: new FormControl("", { nonNullable: true }),
    });
  }

  ngOnInit() {
    this.items = [
      {
        icon: 'format_bold',
        title: 'Bold',
        action: () => this.editor.chain().focus().toggleBold().run(),
        isActive: () => this.editor.isActive('bold'),
      },
      {
        icon: 'format_italic',
        title: 'Italic',
        action: () => this.editor.chain().focus().toggleItalic().run(),
        isActive: () => this.editor.isActive('italic'),
      },
      {
        icon: 'format_strikethrough',
        title: 'Strike',
        action: () => this.editor.chain().focus().toggleStrike().run(),
        isActive: () => this.editor.isActive('strike'),
      },
      {
        icon: 'code',
        title: 'Code',
        action: () => this.editor.chain().focus().toggleCode().run(),
        isActive: () => this.editor.isActive('code'),
      },
      {
        icon: 'format_h1',
        title: 'Heading 1',
        action: () => this.editor.chain().focus().toggleHeading({ level: 1 }).run(),
        isActive: () => this.editor.isActive('heading', { level: 1 }),
      },
      {
        icon: 'format_h2',
        title: 'Heading 2',
        action: () => this.editor.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: () => this.editor.isActive('heading', { level: 2 }),
      },
      {
        icon: 'format_paragraph',
        title: 'Paragraph',
        action: () => this.editor.chain().focus().setParagraph().run(),
        isActive: () => this.editor.isActive('paragraph'),
      },
      {
        icon: 'format_list_bulleted',
        title: 'Bullet List',
        action: () => this.editor.chain().focus().toggleBulletList().run(),
        isActive: () => this.editor.isActive('bulletList'),
      },
      {
        icon: 'format_list_numbered',
        title: 'Ordered List',
        action: () => this.editor.chain().focus().toggleOrderedList().run(),
        isActive: () => this.editor.isActive('orderedList'),
      },
      {
        icon: 'code_blocks',
        title: 'Code Block',
        action: () => this.editor.chain().focus().toggleCodeBlock().run(),
        isActive: () => this.editor.isActive('codeBlock'),
      },

      {
        icon: 'format_quote',
        title: 'Blockquote',
        action: () => this.editor.chain().focus().toggleBlockquote().run(),
        isActive: () => this.editor.isActive('blockquote'),
      },
      {
        icon: 'horizontal_rule',
        title: 'Horizontal Rule',
        action: () => this.editor.chain().focus().setHorizontalRule().run(),
      },
      {
        icon: 'undo',
        title: 'Undo',
        action: () => this.editor.chain().focus().undo().run(),
        isActive: () => this.editor.isActive('undo'),
      },
      {
        icon: 'redo',
        title: 'Redo',
        action: () => this.editor.chain().focus().redo().run(),
        isActive: () => this.editor.isActive('redo'),
      },
    ];

    const id = this.route.snapshot.params["id"];
    if (id != undefined) {
      this.articleService.get(id)
        .pipe(
          catchError((err) => {
            void this.router.navigate(["/editor"]);
            return throwError(() => err);
          }),
        )
        .subscribe(({data}) => {
          if (this.userService.userSignal()?.username === data.author.username) {
            this.inTags = data.tagList;
            this.articleForm.patchValue(data);
            this.editor = new Editor({
              element: document.querySelector('.tiptap-editor') as HTMLElement,
              extensions: [
                StarterKit,
                
              ],
              content: data.body,
        
            });
            this.isUpdate = true;
            console.log(data);
          } else {
            void this.router.navigate(["/"]);
          }
        });
    } else {
      this.editor = new Editor({
        element: document.querySelector('.tiptap-editor') as HTMLElement,
        extensions: [
          StarterKit,
          
        ],
        content: '<div class="editor-content"></div>',

      });
    }

    this.tagsService.getAll().subscribe(({data}) => {
      this.filteredTags = data;
    }
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitForm(): void {
    this.isSubmitting = true;
    

    if (this.isUpdate === true) {
      this.updateArticle();
    } else {
      this.createArticle();
    }
  }

  updateArticle() {
    const article: Partial<Article> = {
      id: this.route.snapshot.params["id"],
      title: this.articleForm.value.title,
      description: this.articleForm.value.description,
      body: this.editor.getHTML(),
      tagList: this.inTags,
    };

    this.articleService
      .update(article)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({data}) => {
          this.router.navigate(["/articles/", data]);
        },
        error: (err) => {
          this.errors = err;
          this.isSubmitting = false;
        },
      });
  }

  createArticle() {
    const article: Partial<Article> = {
      title: this.articleForm.value.title,
      description: this.articleForm.value.description,
      body: this.editor.getHTML(),
      tagList: this.inTags,
    };
    this.articleService
      .create(article)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({data}) => {
          this.router.navigate(["/articles/", data]);
        },
        error: (errors) => {
          this.errors = errors;
          this.isSubmitting = false;
        },
      });
  }

  clickTag($event: any) {
    if ($event == null) {
      return;
    }
    if ($event.value != null) {
      let tag: string = $event.value;
      if (tag != null && tag.trim() !== "" && this.inTags.indexOf(tag) < 0) {
        this.inTags.push(tag);
      }
    }
  }

  deleteTag(tag: string) {
    this.inTags = this.inTags.filter((item) => item !== tag);
  }
}
