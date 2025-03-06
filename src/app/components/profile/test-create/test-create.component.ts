import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SimpleTestResponse } from '../../test/test-list/simple-test-response.model';
import { TestService } from 'src/app/services/test.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-test-create',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './test-create.component.html',
  styleUrl: './test-create.component.css'
})
export class TestCreateComponent implements OnInit {
  tests: SimpleTestResponse[] = [];
  destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
      private readonly testService : TestService,
      private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const username :string = this.route.snapshot.params["username"];
    this.testService.getProfileCreateTests(username)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.tests = data;
        },
        error: () => {

      }});
  }
}
