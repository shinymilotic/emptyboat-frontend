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
    ArticleListComponent,
    RxLet,
  ],
  standalone: true,
})
export class HomeComponent implements OnInit {
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

  constructor(
    private readonly userService: UserService
  ) {

  }

  ngOnInit(): void {
      if (this.userService.userSignal()) {
        this.setListTo();
      }
  }

  setListTo(filters: Object = {}): void {
    this.listConfig = { filters: filters };
  }
}
