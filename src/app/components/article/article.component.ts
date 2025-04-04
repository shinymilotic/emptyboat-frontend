import { Component, DestroyRef, ElementRef, OnInit, Signal, computed, inject } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { Article } from "../../models/blog/article.model";
import { ArticlesService } from "../../services/articles.service";
import { UserService } from "../../services/user.service";
import { ArticleMetaComponent } from "../../shared-components/article-helpers/article-meta.component";
import { NgClass } from "@angular/common";
import { FollowButtonComponent } from "../../shared-components/buttons/follow-button.component";
import { FavoriteButtonComponent } from "../../shared-components/buttons/favorite-button.component";
import { catchError, } from "rxjs/operators";
import { DialogModule } from 'primeng/dialog';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CommentDialogComponent } from "./comment-dialog/comment-dialog.component";
import { throwError } from "rxjs";

@Component({
    selector: "app-article-page",
    templateUrl: "./article.component.html",
    styleUrls: ['./article.component.css'],
    standalone: true,
    imports: [
      ArticleMetaComponent,
      RouterLink,
      NgClass,
      FollowButtonComponent,
      FavoriteButtonComponent,
      FormsModule,
      ReactiveFormsModule,
      DialogModule,
      CommentDialogComponent
    ]
})
export class ArticleComponent implements OnInit {
  article!: Article;
  canModify: Signal<boolean> = computed(() => {
    if (this.userService.userSignal()?.username === this.article.author.username) {
      return true;
    }

    return false;
  });  
  isDeleting = false;
  destroyRef: DestroyRef = inject(DestroyRef);
  visible: boolean = false;
  
  constructor(
    private readonly route: ActivatedRoute,
    private readonly articleService: ArticlesService,
    private readonly router: Router,
    public readonly userService: UserService,
    public elementRef: ElementRef,
  ) {
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params["id"];
    this.articleService.get(id)
    .pipe(
      catchError((err) => {
        void this.router.navigate(["/"]);
        return throwError(() => err);
      }),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe((article) => {
      this.article = article;
    });
  }

  onToggleFavorite(favorited: boolean): void {
    this.article.favorited = favorited;

    if (favorited) {
      this.article.favoritesCount++;
    } else {
      this.article.favoritesCount--;
    }
  }

  // toggleFollowing(): void {
  //   this.article.author.following = !this.article.author.following;
  // }

  deleteArticle(): void {
    this.isDeleting = true;

    this.articleService
      .delete(this.article.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        void this.router.navigate(["/"]);
      });
  }

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
  }
}
