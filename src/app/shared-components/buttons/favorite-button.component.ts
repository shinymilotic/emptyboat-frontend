import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  Renderer2,
} from "@angular/core";
import { Router } from "@angular/router";
import { EMPTY, Observable, Subject, of, switchMap } from "rxjs";
import { map, takeUntil } from "rxjs/operators";
import { NgClass } from "@angular/common";
import { ArticlesService } from "../../services/articles.service";
import { UserService } from "../../services/user.service";
import { Article } from "../../models/blog/article.model";

@Component({
  selector: "app-favorite-button",
  templateUrl: "./favorite-button.component.html",
  styleUrls: ["./favorite-button.component.css"],
  imports: [NgClass],
  standalone: true,
})
export class FavoriteButtonComponent implements OnDestroy {
  destroy$ = new Subject<void>();
  isSubmitting = false;

  @Input() article!: Article;
  @Output() toggle = new EventEmitter<boolean>();

  constructor(
    private readonly articleService: ArticlesService,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly renderer: Renderer2
  ) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleFavoriteBtn($event: Event): void {
    $event.stopPropagation();
    this.isSubmitting = true;
    if (!this.userService.userSignal()) {
        this.router.navigate(["/login"]);
    }

    this.toggleFavorite(this.article.favorited)
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
