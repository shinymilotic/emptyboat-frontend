import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
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

  constructor(private readonly testService : TestService) {}

  ngOnInit(): void {
    this.tests = [
      { id: '1', title: 'Test 1', description: 'Description for test 1' },
      { id: '2', title: 'Test 2', description: 'Description for test 2' }
    ];
  }
}
