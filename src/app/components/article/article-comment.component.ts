import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, Signal, ViewEncapsulation, computed, inject } from "@angular/core";
import { UserService } from "../../services/user.service";
import { User } from "../../models/auth/user.model";
import { RouterLink } from "@angular/router";
import { map } from "rxjs/operators";
import { Comment } from "../../models/blog/comment.model";
import { AsyncPipe, DatePipe } from "@angular/common";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";

@Component({
  selector: "app-article-comment",
  templateUrl: "./article-comment.component.html",
  styleUrls: ['./article-comment.component.css'],
  imports: [RouterLink, DatePipe],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class ArticleCommentComponent {
  @Input() comment!: Comment;
  @Output() delete = new EventEmitter<boolean>();

  canModify: Signal<boolean> = computed(() => {
    if (this.userService.userSignal()?.username === this.comment.author.username) {
      return true;
    }

    return false;
  });

  constructor(private readonly userService: UserService) {}
}
