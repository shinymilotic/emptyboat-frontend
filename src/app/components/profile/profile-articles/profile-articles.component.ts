import { Component, DestroyRef, inject, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ArticleListComponent } from "../../../shared-components/article-helpers/article-list.component";
import { ProfileService } from "../../../services/profile.service";
import { Profile } from "../../../models/auth/profile.model";
import { ArticleListConfig } from "../../../models/blog/article-list-config.model";
import { Subject } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-profile-articles",
  templateUrl: "./profile-articles.component.html",
  imports: [ArticleListComponent],
  standalone: true,
})
export class ProfileArticlesComponent implements OnInit {
  profile!: Profile;
  articlesConfig!: ArticleListConfig;
  destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private readonly profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.profileService
      .get(this.route.snapshot.params["username"])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.profile = data;
          this.articlesConfig = {
            filters: {
              author: this.profile.username,
            },
          };
        },
      });
  }
}
