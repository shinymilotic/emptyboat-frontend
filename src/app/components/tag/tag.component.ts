import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { TagService } from 'src/app/services/tags.service';
import { TagList } from './tag-list.model';
import { ApiError } from 'src/app/models/apierrors.model';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { AdminTagService } from 'src/app/services/admin-tags.service';
import { ListErrorsComponent } from 'src/app/shared-components/list-errors/list-errors.component';

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [ListErrorsComponent, IconFieldModule, InputTextModule,InputIconModule, TableModule, FormsModule, PaginatorModule, RouterLink],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.css'
})
export class TagComponent implements OnInit {
  pageNumber: number = 1;
  itemsPerPage: number = 10;
  tags!: TagList;
  searchKeywords: string = '';
  error!: ApiError;
  destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private readonly tagService: AdminTagService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.tagService.getTags(this.pageNumber, this.itemsPerPage)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tags: TagList) => {
          this.tags = tags;
        },
        error: (error: ApiError) => {
          this.error = error;
        }
      })
  }

  deleteTag(tagId: string) {
    this.tagService.deleteTag(tagId).subscribe({
      next: () => {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['admin/tags']);
      });
      },
      error: (error: ApiError) => {
        this.error = error;
      }
    })
  }

  onPageChange($event: PaginatorState): void {
      if ($event.page == null || $event.rows == null) {
        return;
      }

      this.tagService.getTags($event.page + 1, $event.rows)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (data: TagList) => {
            this.tags = data;
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

}
