import { NgForOf, CommonModule } from "@angular/common";
import { Component, OnDestroy } from "@angular/core";
import { RouterLinkActive, RouterLink } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { ApiError } from "src/app/models/apierrors.model";
import { TestService } from "src/app/services/test.service";
import { SimpleTestResponse } from "./simple-test-response.model";

@Component({
    selector: "app-test-list",
    templateUrl: "./test-list.component.html",
    styleUrls: ["./test-list.component.css"],
    standalone: true,
    imports: [RouterLinkActive, RouterLink, NgForOf, CommonModule]
})
export class TestListComponent implements OnDestroy {
  errors!: ApiError;
  tests: SimpleTestResponse[] = [];
  destroy$ = new Subject<void>();

  constructor(private readonly testService: TestService) {}

  ngOnInit() {
    this.testService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.tests = data;
        },
        error: (err) => {
          this.errors = err;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
