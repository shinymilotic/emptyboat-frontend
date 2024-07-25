import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TestResponse } from 'src/app/core/models/test/test-response.model';
import { TestService } from 'src/app/core/services/test.service';
import { ListErrorsComponent } from "../../../shared/list-errors.component";
import { ApiError } from 'src/app/core/models/apierrors.model';
import { ChoiceQuestion } from 'src/app/core/models/test/choicequestion.model';

@Component({
  selector: 'app-update-test',
  standalone: true,
  imports: [ListErrorsComponent],
  templateUrl: './update-test.component.html',
  styleUrl: './update-test.component.css'
})
export class UpdateTestComponent implements OnInit {
  errors!: ApiError;
  test: TestResponse = {
    author: {
      id: '',
      email: '',
      username: '',
      bio: '',
      image: ''
    },
    description: "",
    questions: [],
    title: "",
  };
  
  constructor(
    private readonly route: ActivatedRoute,
    private readonly testService: TestService,
    private readonly router: Router,
  ) { }
  ngOnInit(): void {
    const id = this.route.snapshot.params["id"];
    
    this.testService.getOne(id)
      .pipe(
        catchError((err) => {
          void this.router.navigate(["/"]);
          return throwError(() => err);
        })
      )
      .subscribe(({data}) => {
        this.test = data;
      });
  }

  deleteQuestion(_t11: any) {
    throw new Error('Method not implemented.');
  }
  isChoiceQuestion(_t11: any) {
    throw new Error('Method not implemented.');
  }
  deleteAnswer(_t11: any,_t20: any) {
    throw new Error('Method not implemented.');
  }
  addAnswer(_t11: any) {
    throw new Error('Method not implemented.');
  }
  addEssayQuestion() {
    throw new Error('Method not implemented.');
  }
  addQuestion() {
    throw new Error('Method not implemented.');
  }

  asChoiceQuestion(qIndex: number): ChoiceQuestion {
    const q = this.test.questions[qIndex] as ChoiceQuestion
    return q;
  }
}
