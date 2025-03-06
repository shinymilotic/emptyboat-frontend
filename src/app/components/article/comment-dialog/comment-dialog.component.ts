import { Component, DestroyRef, ElementRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ListErrorsComponent } from "../../../shared-components/list-errors/list-errors.component";
import { ApiError } from 'src/app/models/apierrors.model';
import { RouterLink } from '@angular/router';
import { CommentsService } from 'src/app/services/comments.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ArticleCommentComponent } from "../article-comment.component";
import { Comment } from 'src/app/models/blog/comment.model';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { ShowAuthedDirective } from 'src/app/directives/show-authed.directive';

@Component({
  selector: 'app-comment-dialog',
  standalone: true,
  imports: [DialogModule, ListErrorsComponent, RouterLink, ArticleCommentComponent, ShowAuthedDirective],
  templateUrl: './comment-dialog.component.html',
  styleUrl: './comment-dialog.component.css'
})
export class CommentDialogComponent implements OnInit {
  commentFormErrors!: ApiError;
  isSubmitting = false;
  comments: Comment[] = [];
  @Input() articleId!: string;
  destroyRef: DestroyRef = inject(DestroyRef);
  items: Array<any> = [];
  editor!: Editor;
  @Output() visible = new EventEmitter<void>();

  constructor(private commentService: CommentsService, public elementRef: ElementRef) {}

  ngOnInit(): void {
    this.commentService.getAll(this.articleId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((comments) => {
        this.comments = comments;
        this.initEditorMenu();
      })
  }

  initEditorMenu(): void {
    this.editor = new Editor({
      element: this.elementRef.nativeElement.querySelector('.tiptap-editor') as HTMLElement,
      extensions: [
        StarterKit
      ],
      content: '<div class="editor-content"></div>',
    });

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
    ];
  }

  addComment(): void {
      this.isSubmitting = true;
      const content: string = this.editor.getHTML();

      this.commentService
        .add(this.articleId, content)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (comment) => {
            this.comments.unshift(comment);
            // this.commentControl.reset("");
            this.editor.destroy();
            this.initEditorMenu();
            this.isSubmitting = false;
          },
          error: (errors: ApiError) => {
            this.isSubmitting = false;
            this.commentFormErrors = errors;
          },
        });
  }

  deleteComment(comment: Comment): void {
    this.commentService
      .delete(comment.id, this.articleId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.comments = this.comments.filter((item) => item !== comment);
      });
  }

  closeDialog() {
    this.visible.emit();
  }
}
