import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { TagService } from 'src/app/services/tags.service';
import { TagManage } from './tag-manage.model';
import { ListErrorsComponent } from "../../../shared-components/list-errors/list-errors.component";
import { ApiError } from 'src/app/models/apierrors.model';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';

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
  tags: TagManage[] = [];
  tagCount: number = 0;
  searchKeywords: string = '';
  error!: ApiError;
  destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private readonly tagService: TagService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    forkJoin([
      this.tagService.getTagManage(this.pageNumber, this.itemsPerPage),
      this.tagService.getTagCount()
    ])
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: ([tags, tagCount]) => {
        this.tags = tags;
        this.tagCount = tagCount;
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
          this.router.navigate(['admin/tag']);
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

      this.tagService.getTagManage($event.page + 1, $event.rows)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (data: TagManage[]) => {
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
