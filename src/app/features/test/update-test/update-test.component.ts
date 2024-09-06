import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
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
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-test',
  standalone: true,
  imports: [ListErrorsComponent, DialogModule, ButtonModule, InputTextModule, ReactiveFormsModule, FormsModule],
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
  questionOnEdit!: FormGroup;
  selectedQuestionIndex!: number;
  
  constructor(
    private readonly route: ActivatedRoute,
    private readonly testService: TestService,
    private readonly router: Router,
    private readonly fb: FormBuilder
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

  asChoiceQuestion(qIndex: number): ChoiceQuestion {
    const q = this.testUpd.questions[qIndex].question as ChoiceQuestion
    return q;
  }

  toChoiceQuestion(question: Question): ChoiceQuestion {
    return question as ChoiceQuestion;
  }

  showDiablog(qIndex: number) {
    // this.essayQuestionOnEdit.controls["question"].setValue(this.testUpd.questions[qIndex].question.question);
    const question : QuestionUpd = this.testUpd.questions[qIndex];
    this.questionOnEdit = this.toFormGroup(question);
    this.selectedQuestionIndex = qIndex;
    this.visible = true;
  }

  toFormGroup(updQuestion: QuestionUpd) : FormGroup {
    const question: Question = updQuestion.question;
    if (question?.questionType == QuestionType.ESSAY) {
      return this.fb.group({
        question: this.fb.control(question.question, Validators.required),
      });
    }

    return this.fb.group({
      question: this.fb.control(question.question, Validators.required),
    });
  } 

  saveQuestion() {
    const oldQuestion: QuestionUpd = this.testUpd.questions[this.selectedQuestionIndex];
    const question: string = this.questionOnEdit.value.question;
    const updateQuestion : QuestionUpd = {
      question: {
        id: oldQuestion.question.id,
        question: question,
        questionType: oldQuestion.question.questionType
      },
      updateFlg: 2
    };
    this.testUpd.questions[this.selectedQuestionIndex] = updateQuestion;
    this.visible = false;
  }

  closeDiablog() {
    this.visible = false;
  }

  background(qIndex: number): string {
    const question: QuestionUpd = this.testUpd.questions[qIndex];
    
    if (question.updateFlg == 1) {
      return "newQuestion";
    } else if (question.updateFlg == 2) {
      return "updateQuestion";
    } else if (question.updateFlg == 3) {
      return "deleteQuestion";
    }

    return "";
  }
}
