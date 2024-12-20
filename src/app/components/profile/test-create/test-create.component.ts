import { Component, computed, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SimpleTestResponse } from '../../test/test-list/simple-test-response.model';
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-test-create',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './test-create.component.html',
  styleUrl: './test-create.component.css'
})
export class TestCreateComponent implements OnInit {
  tests: SimpleTestResponse[] = [];

  constructor(
      private readonly testService : TestService,
      private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const username :string = this.route.snapshot.params["username"];
    this.testService.getProfileCreateTests(username).subscribe({
      next: (data) => {
        this.tests = data.data;
      },
      error: () => {

      }});
  }
}
