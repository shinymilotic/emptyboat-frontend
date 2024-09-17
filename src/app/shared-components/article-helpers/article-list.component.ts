import {
  Component,
  HostListener,
  Input,
  OnDestroy,
} from "@angular/core";
import { ArticlesService } from "../../services/articles.service";
import { ArticleListConfig } from "../../models/blog/article-list-config.model";
import { Article } from "../../models/blog/article.model";
import { ArticlePreviewComponent } from "./article-preview.component";
import { NgClass, NgForOf } from "@angular/common";
import { LoadingState } from "../../models/loading-state.model";
import { Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";
@Component({
  selector: "app-article-list",
  styleUrls: ["article-list.component.css"],
  templateUrl: "./article-list.component.html",
  imports: [ArticlePreviewComponent, NgForOf, NgClass],
  standalone: true,
})
export class ArticleListComponent implements OnDestroy {
  query!: ArticleListConfig;
  results: Article[] = [];
  lastArticleId : string | undefined = '';
  loading = LoadingState.NOT_LOADED;
  LoadingState = LoadingState;
  destroy$ = new Subject<void>();
  subscription!: Subscription;
  isNoMore: boolean = false;

  @Input() limit!: number;
  @Input()
  set config(config: ArticleListConfig) {
    if (config) {
      this.query = config;
      this.lastArticleId = '';
      this.results = [];
      this.runQuery();
    }
  }

  constructor(
    private articlesService: ArticlesService,
  ) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  runQuery() {
    this.loading = LoadingState.LOADING;
    if (this.limit) {
      this.query.filters.size = this.limit;
      this.query.filters.lastArticleId = this.lastArticleId;
    }
  
    this.articlesService
      .query(this.query)
      .pipe(takeUntil(this.destroy$))
      .subscribe(({data}) => {
        this.loading = LoadingState.LOADED;
        this.results.push(...data.articles);
        if (data.articles != undefined && data.articles.length > 0) {
          this.lastArticleId = data.articles.at(data.articlesCount - 1)?.id;
        }

        if (data.articles.length == 0) {
          this.isNoMore = true;
        }
      });
  }

  @HostListener("window:scroll", ["$event"])
  onScroll(event: any) {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1 &&
       this.loading == LoadingState.LOADED &&
       !this.isNoMore) {
      this.runQuery();
    }
  }

  moreArticle() {
    this.isNoMore = false;
    this.runQuery();
  }
}
