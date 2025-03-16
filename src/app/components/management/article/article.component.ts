import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule, RouterLink, Router } from '@angular/router';
import { IconFieldModule } from 'primeng/iconfield';
import { ImageModule } from 'primeng/image';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { forkJoin } from 'rxjs';
import { ApiError } from 'src/app/models/apierrors.model';
import { ArticlesService } from 'src/app/services/articles.service';
import { ListErrorsComponent } from 'src/app/shared-components/list-errors/list-errors.component';
import { ArticleManage } from './article.model';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [TableModule, CommonModule, RouterModule, PaginatorModule, ImageModule, IconFieldModule, InputIconModule, InputTextModule, RouterLink, ListErrorsComponent],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css'
})
export class ArticleComponent {
  articles!: ArticleManage[];
  articlesCount!: number;
  pageNumber: number = 1;
  itemsPerPage: number = 10;
  searchKeywords: string = '';
  destroyRef: DestroyRef = inject(DestroyRef);
  error!: ApiError;

  constructor(
    private readonly articleService: ArticlesService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    forkJoin([
      this.articleService.getArticlesManage(this.pageNumber, this.itemsPerPage),
      this.articleService.getArticlesCount()
      ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ([data, articlesCount]) => {
          this.articles = data;
          this.articlesCount = articlesCount;
        },
        error: (error: ApiError) => {
          this.error = error;
        }
      })
  }

  onPageChange($event: PaginatorState) {
    this.articleService.getArticlesManage($event.page, $event.rows)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: ArticleManage[]) => {
          this.articles = data;
          if ($event.page != undefined) {
            this.pageNumber = $event.page + 1;
          }

          if ($event.rows != undefined) {
            this.itemsPerPage = $event.rows;
          }
          
        },
        error: (error: ApiError) => {
          this.error = error;
        }
      });
  }

  deleteArticle(articleId: string) : void {
    this.articleService.deleteArticle(articleId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['manage/article']);
        });
        },
        error: (error: ApiError) => {
          this.error = error;
        }
      })
  }
}
