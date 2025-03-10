import { Component, DestroyRef, HostListener, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { Article } from 'src/app/models/blog/article.model';
import { LoadingState } from 'src/app/models/loading-state.model';
import { SearchParam } from 'src/app/models/search.model';
import { SearchService } from 'src/app/services/search.service';
import { ArticlePreviewComponent } from "../../../shared-components/article-helpers/article-preview.component";
import { NgForOf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-search-articles',
    templateUrl: './search-articles.component.html',
    styleUrls: ['./search-articles.component.css'],
    standalone: true,
    imports: [ArticlePreviewComponent, NgForOf]
})
export class SearchArticlesComponent {
  limit: number = 10;
  results: Article[] = [];
  lastArticleId : string | undefined = '';
  loading = LoadingState.NOT_LOADED;
  LoadingState = LoadingState;
  destroy$ = new Subject<void>();
  message: string = '';
  q: string = '';
  destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private searchService: SearchService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        this.q = params['q'];
        this.search();
      });
  }

  ngOnDestroy() {
  }

  search() {
    const param: SearchParam = {
      q: this.q,
      size: this.limit,
      lastArticleId: this.lastArticleId,
    };

    this.searchService
      .search(param)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.loading = LoadingState.LOADED;
        this.results.push(...data.articles);
        if (data.articles != undefined && data.articles.length > 0) {
          this.lastArticleId = data.articles.at(data.articlesCount - 1)?.id;
        }
      });
  }

  @HostListener("window:scroll", ["$event"])
  onScroll(event: any) {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1) {
      this.search();
    }
  }
}
