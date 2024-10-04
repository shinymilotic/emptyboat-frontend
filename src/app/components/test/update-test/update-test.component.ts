import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TestService } from 'src/app/services/test.service';
import { ListErrorsComponent } from "../../../shared-components/list-errors/list-errors.component";
import { ApiError } from 'src/app/models/apierrors.model';
import { ChoiceQuestion } from 'src/app/models/test/choicequestion.model';
import { DialogModule } from 'primeng/dialog';
import { TestResponseUpd } from './test-response-update';
import { QuestionType } from '../create-test/enum/QuestionType';
import { QuestionUpd } from './question-update';
import { Question } from 'src/app/models/test/question.model';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChoiceQuestionUpd } from './choice-question-update';
import { ChoiceAnswerUpd } from './choice-answer-update';
import { NgFor, NgForOf } from '@angular/common';
import { ContenteditableValueAccessor } from 'src/app/directives/contenteditable.directive';

@Component({
  selector: 'app-update-test',
  standalone: true,
  imports: [ListErrorsComponent, DialogModule, ButtonModule, InputTextModule, 
    ReactiveFormsModule, FormsModule, NgFor, NgForOf, ContenteditableValueAccessor],
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
            const choiceQuestion : ChoiceQuestionUpd = question as ChoiceQuestionUpd;
            choiceQuestion.updateFlg = 0;
            choiceQuestion.answers.forEach((answer) => {
              answer.updateFlg = 0;
            });
            this.testUpd.questions.push(choiceQuestion);
          }

          if (question.questionType == QuestionType.OPEN) {
            this.testUpd.questions.push({
                id: question.id,
                question: question.question,
                questionType: question.questionType,
                updateFlg: 0
            });
          }
        })
      });
  }

  asChoiceQuestion(qIndex: number): ChoiceQuestionUpd {
    return this.testUpd.questions[qIndex] as ChoiceQuestionUpd;
  }

  toChoiceQuestion(question: Question): ChoiceQuestion {
    return question as ChoiceQuestion;
  }

  showDiablog(qIndex: number) {
    if (this.isQuestionSelected() === true && this.testUpd.questions[qIndex] != null) {
      return;
    }

    this.questionForm = this.toFormGroup(this.testUpd.questions[qIndex] as QuestionUpd);
    this.selectedQuestionIndex = qIndex;
    this.visible = true;
  }

  isQuestionSelected(): boolean {
    if (this.selectedQuestionIndex != -1 && 
          this.testUpd != null && 
          this.testUpd.questions[this.selectedQuestionIndex] != null) {
      return true;
    }

    return false;
  }

  toFormGroup(updQuestion: QuestionUpd) : FormGroup {
    const question: Question = updQuestion;
    if (question?.questionType == QuestionType.OPEN) {
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
    if (this.selectedQuestionIndex == -1) {
      return;
    }

    if (this.testUpd.questions[this.selectedQuestionIndex].questionType == QuestionType.CHOICE) {
      const choiceQuestion : ChoiceQuestionUpd = this.testUpd.questions[this.selectedQuestionIndex] as ChoiceQuestionUpd;
      const question: string = this.questionForm.value.question;
      console.log(this.getAnswerFormArr());
      
    } else if (this.testUpd.questions[this.selectedQuestionIndex].questionType == QuestionType.OPEN) {
      const openQuestion: QuestionUpd = this.testUpd.questions[this.selectedQuestionIndex] as QuestionUpd;
      const question: string = this.questionForm.value.question;
      const updateQuestion: QuestionUpd = {
        id: openQuestion.id,
        question: question,
        questionType: openQuestion.questionType,
        updateFlg: 2
      };
      this.testUpd.questions[this.selectedQuestionIndex] = updateQuestion;
    }

    this.visible = false;
  }

  closeDiablog() {
    this.visible = false;
    this.selectedQuestionIndex = -1;
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
    if (this.selectedQuestionIndex == -1) {
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
          this.router.navigate([`/test/${testId}/update`]);
        }); 
      },

      error: (err) => {
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
