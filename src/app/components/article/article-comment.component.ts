import { Component, EventEmitter, Input, Output, Signal, ViewEncapsulation, computed } from "@angular/core";
import { UserService } from "../../services/user.service";
import { Comment } from "../../models/blog/comment.model";
import { RouterLink } from "@angular/router";
import { DatePipe } from "@angular/common";

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
