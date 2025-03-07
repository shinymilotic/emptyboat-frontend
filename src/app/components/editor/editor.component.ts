import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
} from "@angular/core";
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  FormsModule,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ListErrorsComponent } from "../../shared-components/list-errors/list-errors.component";
import { ArticlesService } from "../../services/articles.service";
import { Subject, throwError } from "rxjs";
import { catchError, take } from "rxjs/operators";
import { UserService } from "../../services/user.service";
import { TagService } from "src/app/services/tags.service";
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { ApiError } from "src/app/models/apierrors.model";
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { Tag } from "src/app/models/blog/tag.model";
import { SubmitArticle } from "./submit-article.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

interface ArticleForm {
  title: FormControl<string>;
  description: FormControl<string>;
}

@Component({
    selector: "app-editor-page",
    templateUrl: "./editor.component.html",
    styleUrls: ["./editor.component.scss"],
    standalone: true,
    imports: [
        ListErrorsComponent,
        ReactiveFormsModule,
        InputTextModule,
        FormsModule,
        DropdownModule
    ]
})
export class EditorComponent implements OnInit {
  articleForm: FormGroup<ArticleForm>;
  errors!: ApiError;
  isSubmitting = false;
  filteredTags: Tag[] = [];
  inTags: Tag[] = [];
  isUpdate: boolean = false;
  editor!: Editor;
  items: Array<any> = [];
  destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private readonly articleService: ArticlesService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly tagService: TagService,
    private readonly elementRef: ElementRef
  ) {
    this.articleForm = new FormGroup<ArticleForm>({
      title: new FormControl("", { nonNullable: true }),
      description: new FormControl("", { nonNullable: true }),
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.params["id"];
    if (id != undefined) {
      this.articleService.get(id)
        .pipe(
          catchError((err) => {
            void this.router.navigate(["/editor"]);
            return throwError(() => err);
          }),
          takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (data) => {
            if (this.userService.userSignal()?.username === data.author.username) {
              this.inTags = data.tagList;
              this.articleForm.patchValue(data);
              this.editor = new Editor({
                element: this.elementRef.nativeElement.querySelector('.tiptap-editor') as HTMLElement,
                extensions: [
                  StarterKit,
                ],
                content: data.body,
          
              });
              this.isUpdate = true;
            } else {
              void this.router.navigate(["/"]);
            }
            this.initEditorMenu();
          },
          error: (errors: ApiError) => {
            this.isSubmitting = false;
            this.errors = errors;
          },
        });
    } else {
      this.editor = new Editor({
        element: this.elementRef.nativeElement.querySelector('.tiptap-editor') as HTMLElement,
        extensions: [
          StarterKit,
        ],
        content: '<div class="editor-content"></div>',
      });
      this.initEditorMenu();
    }

    this.tagService.getAll(false)
      .pipe(takeUntilDestroyed(this.destroyRef))      
      .subscribe((data) => {
        this.filteredTags = data;
      });
  }

  initEditorMenu() {
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
  }

  submitForm(): void {
    this.isSubmitting = true;
    
    if (this.isUpdate === true) {
      this.updateArticle();
    } else {
      this.createArticle();
    }
  }

  articleForSubmit() : Partial<SubmitArticle> {
    const article: Partial<SubmitArticle> = {
      title: this.articleForm.value.title,
      description: this.articleForm.value.description,
      body: this.editor.getHTML(),
      tagList: this.getTagIdFromTag(this.inTags),
    };

    return article;
  }

  updateArticle() : void {
    const article : Partial<SubmitArticle> = this.articleForSubmit();
    this.articleService
      .update(article, this.route.snapshot.params["id"])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigate(["/articles/", this.route.snapshot.params["id"]]);
        },
        error: (err) => {
          this.errors = err;
          this.isSubmitting = false;
        },
      });
  }

  createArticle() {
    const article : Partial<SubmitArticle> = this.articleForSubmit();
    this.articleService
      .create(article)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.router.navigate(["/articles/", data]);
        },
        error: (errors: ApiError) => {
          this.errors = errors;
          this.isSubmitting = false;
        },
      });
  }

  clickTag($event: any) {
    if ($event != null && $event.value != null) {
      this.inTags.push($event.value);
    }
  }

  deleteTag(tag: Tag) {
    this.inTags = this.inTags.filter((item) => item !== tag);
  }

  getTagIdFromTag(tags: Tag[]) : string[] {
    return tags.map((tag) => tag.id);
  }
}
