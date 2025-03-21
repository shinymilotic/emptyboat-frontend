import { NgForOf, CommonModule } from "@angular/common";
import { Component, DestroyRef, inject } from "@angular/core";
import { RouterLinkActive, RouterLink } from "@angular/router";
import { ApiError } from "src/app/models/apierrors.model";
import { TestService } from "src/app/services/test.service";
import { SimpleTestResponse } from "./simple-test-response.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: "app-test-list",
    templateUrl: "./test-list.component.html",
    styleUrls: ["./test-list.component.css"],
    standalone: true,
    imports: [RouterLinkActive, RouterLink, NgForOf, CommonModule]
})
export class TestListComponent {
  errors!: ApiError;
  tests: SimpleTestResponse[] = [];
  destroyRef: DestroyRef = inject(DestroyRef);

  constructor(private readonly testService: TestService) {}

  ngOnInit() {
    this.testService
      .get()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.tests = data;
        },
        error: (err) => {
          this.errors = err;
        },
      });
  }
}
