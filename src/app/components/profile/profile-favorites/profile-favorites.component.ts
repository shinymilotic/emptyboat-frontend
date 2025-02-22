import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ArticleListComponent } from "../../../shared-components/article-helpers/article-list.component";
import { takeUntil } from "rxjs/operators";
import { ProfileService } from "../../../services/profile.service";
import { Profile } from "../../../models/auth/profile.model";
import { ArticleListConfig } from "../../../models/blog/article-list-config.model";
import { Subject } from "rxjs";

@Component({
  selector: "app-profile-favorites",
  templateUrl: "./profile-favorites.component.html",
  imports: [ArticleListComponent],
  standalone: true,
})
export class ProfileFavoritesComponent implements OnInit, OnDestroy {
  profile!: Profile;
  favoritesConfig!: ArticleListConfig;
  destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private readonly profileService: ProfileService
  ) {}

  ngOnInit() {
    console.log("Favorites");
    this.profileService
      .get(this.route.parent?.snapshot.params["username"])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.profile = data;
          this.favoritesConfig = {
            filters: {
              favorited: this.profile.username,
            },
          };
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
