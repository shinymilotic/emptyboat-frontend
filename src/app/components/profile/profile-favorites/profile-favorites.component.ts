import { Component, DestroyRef, inject, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ArticleListComponent } from "../../../shared-components/article-helpers/article-list.component";
import { ProfileService } from "../../../services/profile.service";
import { Profile } from "../../../models/auth/profile.model";
import { ArticleListConfig } from "../../../models/blog/article-list-config.model";
import { Subject, takeUntil } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-profile-favorites",
  templateUrl: "./profile-favorites.component.html",
  imports: [ArticleListComponent],
  standalone: true,
})
export class ProfileFavoritesComponent implements OnInit {
  profile!: Profile;
  favoritesConfig!: ArticleListConfig;
  destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private readonly profileService: ProfileService
  ) {}

  ngOnInit() {
    console.log("Favorites");
    this.profileService
      .get(this.route.parent?.snapshot.params["username"])
      .pipe(takeUntilDestroyed(this.destroyRef))
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
}
