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
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChoiceQuestionUpd } from './choice-question-update';
import { Answer } from 'src/app/core/models/test/answer.model';
import { ChoiceAnswerUpd } from './choice-answer-update';
import { NgFor, NgForOf } from '@angular/common';

@Component({
  selector: 'app-update-test',
  standalone: true,
  imports: [ListErrorsComponent, DialogModule, ButtonModule, InputTextModule, ReactiveFormsModule, FormsModule, NgFor, NgForOf],
  templateUrl: './update-test.component.html',
  styleUrl: './update-test.component.css'
})
export class UpdateTestComponent implements OnInit {
  errors!: ApiError;
  testUpd: TestResponseUpd = {
    description: "",
    questions: [],
    title: ""
  }
  visible: boolean = false;
  questionForm!: FormGroup;
  selectedQuestionIndex!: number | null;
  
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
            const choiceQuestion : ChoiceQuestion = question as ChoiceQuestion;
            const updAnswers: ChoiceAnswerUpd[] = [];
            choiceQuestion.answers.forEach((answer) => {
              updAnswers.push({
                id: answer.id,
                answer: answer.answer,
                truth: answer.truth,
                updateFlg: 0
              })
            });
            const questionUpd: ChoiceQuestionUpd = {
              id: choiceQuestion.id,
              question: choiceQuestion.question,
              questionType: choiceQuestion.questionType,
              answers: updAnswers,
              updateFlg: 0
            }
            this.testUpd.questions.push(questionUpd);
          }

          if (question.questionType == QuestionType.ESSAY) {
            const questionUpd: QuestionUpd = {
              id: question.id,
              question: question.question,
              questionType: question.questionType,
              updateFlg: 0
            }
            this.testUpd.questions.push(questionUpd);
          }
        })
      });
  }

  asChoiceQuestion(qIndex: number): ChoiceQuestionUpd {
    const q = this.testUpd.questions[qIndex] as ChoiceQuestionUpd;
    return q;
  }

  toChoiceQuestion(question: Question): ChoiceQuestion {
    return question as ChoiceQuestion;
  }

  showDiablog(qIndex: number) {
    // this.essayQuestionOnEdit.controls["question"].setValue(this.testUpd.questions[qIndex].question.question);
    const question : QuestionUpd = this.testUpd.questions[qIndex];
    this.questionForm = this.toFormGroup(question);
    this.selectedQuestionIndex = qIndex;
    this.visible = true;
  }

  toFormGroup(updQuestion: QuestionUpd) : FormGroup {
    const question: Question = updQuestion;
    if (question?.questionType == QuestionType.ESSAY) {
      return this.fb.group({
        question: this.fb.control(question.question, Validators.required),
      });
    } else if (question?.questionType == QuestionType.CHOICE) {
      const choiceQuestion: ChoiceQuestionUpd = question as ChoiceQuestionUpd;
      const answers: ChoiceAnswerUpd[] = choiceQuestion.answers;
      const answersFormArray: FormArray<FormGroup> = new FormArray<FormGroup>([]);
      answers.forEach((answer) => {
        answersFormArray.push(this.fb.group({
          answer: this.fb.control(answer.answer, Validators.required),
          truth: this.fb.control(answer.truth, Validators.required)
        }));
      });

      return this.fb.group({
        question: this.fb.control(choiceQuestion.question, Validators.required),
        answers: answersFormArray
      })
    }

    return this.fb.group({});
  } 

  saveQuestion() {

    if (!this.selectedQuestionIndex) {
      return;
    }

    const oldQuestion: QuestionUpd = this.testUpd.questions[this.selectedQuestionIndex];
    const question: string = this.questionForm.value.question;
    const updateQuestion : QuestionUpd = {
      id: oldQuestion.id,
      question: question,
      questionType: oldQuestion.questionType,
      updateFlg: 2
    };
    this.testUpd.questions[this.selectedQuestionIndex] = updateQuestion;
    this.visible = false;
  }

  closeDiablog() {
    this.visible = false;
    this.selectedQuestionIndex = null;
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

  deleteQuestion() {
    if (!this.selectedQuestionIndex) {
      return;
    }
    const question: QuestionUpd = this.testUpd.questions[this.selectedQuestionIndex];
    question.updateFlg = 3;
    this.visible = false;
  }

  updateTest() {
    const testId = this.route.snapshot.params["id"];
    this.testService.update(testId, this.testUpd).subscribe({
      next: () => {
        this.router.navigateByUrl(`/`, { skipLocationChange: true }).then(() => {
          console.log(testId);
          this.router.navigate([`/test/${testId}/update`]);
      }); 
      },
      error: (err) => {
        console.log(err);
        this.errors = err;
      },
    });
  }

  getAnswerFormArr(): FormArray<FormGroup> {

    return this.questionForm.get("answers") as FormArray<
      FormGroup
    >;
  }

  deleteAnswer(aIndex: number) {

  }
  addAnswer() {
  
  }
}
