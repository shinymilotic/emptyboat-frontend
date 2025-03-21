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
import { ApiError } from 'src/app/models/apierrors.model';
import { ListErrorsComponent } from 'src/app/shared-components/list-errors/list-errors.component';
import { AdminTestService } from 'src/app/services/admin-tests.service';
import { TestList } from './test-list.model';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [TableModule, CommonModule, RouterModule, PaginatorModule, ImageModule, IconFieldModule, InputIconModule, InputTextModule, RouterLink, ListErrorsComponent],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent {
  tests!: TestList;
  usersCount!: number;
  pageNumber: number = 1;
  itemsPerPage: number = 10;
  searchKeywords: string = '';
  destroyRef: DestroyRef = inject(DestroyRef);
  error!: ApiError;

  constructor(
    private readonly testService: AdminTestService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.testService.getTests(this.pageNumber, this.itemsPerPage)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tests: TestList) => {
          this.tests = tests;
        },
        error: (error: ApiError) => {
          this.error = error;
        }
      })
  }

  onPageChange($event: PaginatorState) {
    this.testService.getTests($event.page, $event.rows)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tests: TestList) => {
          this.tests = tests;
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

  deleteTest(testsId: string) : void {
    this.testService.deleteTest(testsId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['admin/tests']);
        });
        },
        error: (error: ApiError) => {
          this.error = error;
        }
      })
  }
}
