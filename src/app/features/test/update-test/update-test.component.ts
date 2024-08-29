import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TestResponse } from 'src/app/core/models/test/test-response.model';
import { TestService } from 'src/app/core/services/test.service';
import { ListErrorsComponent } from "../../../shared/list-errors.component";
import { ApiError } from 'src/app/core/models/apierrors.model';
import { ChoiceQuestion } from 'src/app/core/models/test/choicequestion.model';
import { DialogModule } from 'primeng/dialog';
import { TestResponseUpd } from './test-response-update';
import { QuestionType } from '../create-test/enum/QuestionType';
import { QuestionUpd } from './question-update';
import { Question } from 'src/app/core/models/test/question.model';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditTestDialogComponent } from "./edit-test-dialog/edit-test-dialog.component";

@Component({
  selector: 'app-update-test',
  standalone: true,
  imports: [ListErrorsComponent, DialogModule, ButtonModule, InputTextModule, ReactiveFormsModule, FormsModule, EditTestDialogComponent],
  templateUrl: './update-test.component.html',
  styleUrl: './update-test.component.css'
})
export class UpdateTestComponent implements OnInit {
  errors!: ApiError;

  testUpd: TestResponseUpd = {
    description: "",
    questions: [],
    title: "",
    updateFlg: 0
  }
  visible: boolean = false;
  questionForm: string = '';
  
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
        this.testUpd.description = data.description;
        this.testUpd.title = data.title;
        data.questions.forEach((question) => {
          if (question.questionType == QuestionType.CHOICE) {
            const questionUpd: QuestionUpd = {
              question: question as ChoiceQuestion,
              updateFlg: 0
            }
            this.testUpd.questions.push(questionUpd);
          }

          if (question.questionType == QuestionType.ESSAY) {
            const questionUpd: QuestionUpd = {
              question: question,
              updateFlg: 0
            }
            this.testUpd.questions.push(questionUpd);
          }
        })
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
    const q = this.testUpd.questions[qIndex].question as ChoiceQuestion
    return q;
  }

  toChoiceQuestion(question: Question): ChoiceQuestion {
    return question as ChoiceQuestion;
  }

  showDiablog(qIndex: number) {
    this.questionForm = this.testUpd.questions[qIndex].question.question;
    this.visible = true;
  }

  saveQuestion() {
    this.visible = false;
  }

  closeDiablog() {
    this.questionForm = '';
    this.visible = false;
  }
}
