import { RxLet } from "@rx-angular/template/let";
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { TagService } from "../../services/tags.service";
import { ArticleListConfig } from "../../models/blog/article-list-config.model";
import { AsyncPipe, NgClass, NgForOf } from "@angular/common";
import { ArticleListComponent } from "../../shared-components/article-helpers/article-list.component";
import { map, tap } from "rxjs/operators";
import { Subject } from "rxjs";
import { UserService } from "../../services/user.service";
import { ShowAuthedDirective } from "../../directives/show-authed.directive";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: "app-home-page",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  imports: [
    NgClass,
    ArticleListComponent,
    AsyncPipe,
    RxLet,
    NgForOf,
    ShowAuthedDirective,
    RouterLink,
    RouterLinkActive,
  ],
  standalone: true,
})
export class HomeComponent implements OnInit, OnDestroy {
  listConfig: ArticleListConfig = {
    filters: {},
  };
  tags$ = inject(TagService)
    .getFollowingTags()
    .pipe(
      map((data) => data),
      tap(() => (this.tagsLoaded = true))
    );
  tagsLoaded = false;
  destroy$ = new Subject<void>();

  constructor(
    private readonly userService: UserService
  ) {
    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     this.router.navigated = false;
    //   }
    // });
  }

  ngOnInit(): void {
      if (this.userService.userSignal()) {
        this.setListTo();
      }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setListTo(filters: Object = {}): void {
    this.listConfig = { filters: filters };
  }
}
