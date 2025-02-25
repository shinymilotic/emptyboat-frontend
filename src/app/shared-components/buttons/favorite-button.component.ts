import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
  Renderer2,
} from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { NgClass } from "@angular/common";
import { ArticlesService } from "../../services/articles.service";
import { UserService } from "../../services/user.service";
import { Article } from "../../models/blog/article.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-favorite-button",
  templateUrl: "./favorite-button.component.html",
  styleUrls: ["./favorite-button.component.css"],
  imports: [],
  standalone: true,
})
export class FavoriteButtonComponent implements OnDestroy {
  destroy$ = new Subject<void>();
  isSubmitting = false;
  destroyRef: DestroyRef = inject(DestroyRef);
  @Input() article!: Article;
  @Output() toggle = new EventEmitter<boolean>();

  constructor(
    private readonly articleService: ArticlesService,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly renderer: Renderer2
  ) {}

  toggleFavoriteBtn($event: Event): void {
    $event.stopPropagation();
    this.isSubmitting = true;
    if (!this.userService.userSignal()) {
        this.router.navigate(["/login"]);
    }

    this.toggleFavorite(this.article.favorited)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toggle.emit(!this.article.favorited);
      },
      error: () => (this.isSubmitting = false),
    });
      
  }

  public toggleFavorite(favorited: boolean): Observable<any> {
    if (!favorited) {
      return this.articleService.favorite(this.article.id);
    } else {
      return this.articleService.unfavorite(this.article.id);
    }
  }

}
