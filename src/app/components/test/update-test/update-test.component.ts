import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TestService } from 'src/app/services/test.service';
import { ListErrorsComponent } from "../../../shared-components/list-errors/list-errors.component";
import { ApiError } from 'src/app/models/apierrors.model';
import { ChoiceQuestion } from 'src/app/models/test/choicequestion.model';
import { DialogModule } from 'primeng/dialog';
import { TestResponseUpd } from './test-response-update';
import { QuestionType } from '../../../models/test/QuestionType';
import { QuestionUpd } from './question-update';
import { Question } from 'src/app/models/test/question.model';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChoiceQuestionUpd } from './choice-question-update';
import { ChoiceAnswerUpd } from './choice-answer-update';
import { NgFor, NgForOf } from '@angular/common';
import { ContenteditableValueAccessor } from 'src/app/directives/contenteditable.directive';
import { UpdateFlg } from 'src/app/models/update-flg.enum';

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
            choiceQuestion.updateFlg = UpdateFlg.NOCHANGE;
            choiceQuestion.answers.forEach((answer) => {
              answer.updateFlg = UpdateFlg.NOCHANGE;
            });
            this.testUpd.questions.push(choiceQuestion);
          }

          if (question.questionType == QuestionType.OPEN) {
            this.testUpd.questions.push({
                id: question.id,
                question: question.question,
                questionType: question.questionType,
                updateFlg: UpdateFlg.NOCHANGE
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
    this.questionForm = this.toFormGroup(this.testUpd.questions[qIndex]);
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

  toFormGroup(updQuestion: QuestionUpd | ChoiceQuestionUpd) : FormGroup {
    if (updQuestion?.questionType == QuestionType.OPEN) {
      return this.fb.group({
        id: updQuestion.id,
        question: this.fb.control(updQuestion.question, Validators.required),
        updateFlg: this.fb.control(updQuestion.updateFlg, Validators.required)
      });
    } else if (updQuestion?.questionType == QuestionType.CHOICE) {
      const choiceQuestion: ChoiceQuestionUpd = updQuestion as ChoiceQuestionUpd;
      const answersFormArray: FormArray<FormGroup> = new FormArray<FormGroup>([]);
      choiceQuestion.answers.forEach((answer) => {
        answersFormArray.push(this.fb.group({
          id: answer.id,
          answer: this.fb.control(answer.answer, Validators.required),
          truth: this.fb.control(answer.truth, Validators.required),
          updateFlg: this.fb.control(answer.updateFlg, Validators.required)
        }));
      });

      return this.fb.group({
        id: choiceQuestion.id,
        question: this.fb.control(choiceQuestion.question, Validators.required),
        answers: answersFormArray,
        updateFlg: this.fb.control(updQuestion.updateFlg, Validators.required)
      });
    }

    return this.fb.group({});
  } 

  saveQuestion() {
    if (this.selectedQuestionIndex == -1) {
      return;
    }

    const question : (QuestionUpd | ChoiceQuestionUpd) = this.testUpd.questions[this.selectedQuestionIndex];
    const questionFormValue : any = this.questionForm.value;

    if (question.questionType == QuestionType.CHOICE) {      
      this.testUpd.questions[this.selectedQuestionIndex] = {
        id: questionFormValue.id,
        question: questionFormValue.question,
        questionType: QuestionType.CHOICE,
        answers: this.answerFormToAnswersUpdate(),
        updateFlg: 2
      };
    } else if (question.questionType == QuestionType.OPEN) {
      this.testUpd.questions[this.selectedQuestionIndex] = {
        id: questionFormValue.id,
        question: questionFormValue.question,
        questionType: QuestionType.OPEN,
        updateFlg: 2
      };
    }

    this.visible = false;
  }

  closeDiablog() {
    this.visible = false;
    this.selectedQuestionIndex = -1;
  }

  background(qIndex: number): string {
    const question: QuestionUpd = this.testUpd.questions[qIndex];
    
    if (question.updateFlg === UpdateFlg.NEW) {
      return "newQuestion";
    } else if (question.updateFlg == UpdateFlg.CHANGE) {
      return "updateQuestion";
    } else if (question.updateFlg == UpdateFlg.DELETE) {
      return "deleteQuestion";
    }

    return "";
  }

  deleteQuestion() {
    if (this.selectedQuestionIndex == -1) {
      return;
    }

    const question: QuestionUpd = this.testUpd.questions[this.selectedQuestionIndex];
    question.updateFlg = UpdateFlg.DELETE;
    
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

  answerFormToAnswersUpdate() : ChoiceAnswerUpd[]{
    let result : ChoiceAnswerUpd[] = [];

    this.getAnswerFormArr().map((group: any) => {
      if (group.updateFlg === UpdateFlg.NOCHANGE) {
        group.updateFlg = UpdateFlg.CHANGE;
      }

      result.push({
        id: group.id,
        answer: group.answer,
        truth: group.truth,
        updateFlg: group.updateFlg
      })
    }
    );

    return result;
  }

  getAnswerFormArr(): ChoiceAnswerUpd[] {
    return this.questionForm.value.answers;
  }

  changeAnswerUpdateFlg() {
    
  }

  deleteAnswer(choiceAnswerUpd: ChoiceAnswerUpd) {
    choiceAnswerUpd.updateFlg = UpdateFlg.DELETE;
  }

  answerBackground(choiceAnswerUpd: ChoiceAnswerUpd): string {
    if (choiceAnswerUpd.updateFlg === UpdateFlg.NEW) {
      return "newAnswer";
    } else if (choiceAnswerUpd.updateFlg == UpdateFlg.DELETE) {
      return "deleteAnswer";
    }

    return "";
  }

  addAnswer() {
  
  }

  answerChange(answer: ChoiceAnswerUpd) {
    if (answer.updateFlg === UpdateFlg.DELETE) {
      return;
    }

    answer.updateFlg = UpdateFlg.CHANGE;
  }

  public get QuestionType() {
    return QuestionType; 
  }
}
