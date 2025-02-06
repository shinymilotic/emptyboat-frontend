import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TestService } from 'src/app/services/test.service';
import { ListErrorsComponent } from "../../../shared-components/list-errors/list-errors.component";
import { ApiError } from 'src/app/models/apierrors.model';
import { ChoiceQuestion } from 'src/app/models/test/choicequestion.model';
import { TestResponseUpd } from './test-response-update';
import { QuestionType } from '../../../models/test/QuestionType';
import { QuestionUpd } from './question-update';
import { Question } from 'src/app/models/test/question.model';
import { ChoiceQuestionUpd } from './choice-question-update';
import { UpdateFlg } from 'src/app/models/update-flg.enum';
import { UpdateQuestionDialogComponent } from "./update-question-dialog/update-question-dialog.component";
import { AddQuestionDialogComponent } from "./add-question-dialog/add-question-dialog.component";
import { NewOpenQuestion } from './add-question-dialog/new-open-question.model';
import { NewChoiceQuestion } from './add-question-dialog/new-choice-question.model';
import { ChoiceAnswerUpd } from './choice-answer-update';

@Component({
  selector: 'app-update-test',
  standalone: true,
  imports: [ListErrorsComponent, UpdateQuestionDialogComponent, AddQuestionDialogComponent],
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
  selectedUpdateQuesion: number = -1;
  questionTypeForNew: number = -1;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly testService: TestService,
    private readonly router: Router
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
      .subscribe((data) => {
        this.testUpd.description = data.description;
        this.testUpd.title = data.title;
        data.questions.forEach((question) => {
          if (question.questionType === QuestionType.CHOICE) {
            const choiceQuestion : ChoiceQuestionUpd = question as ChoiceQuestionUpd;
            choiceQuestion.updateFlg = UpdateFlg.NOCHANGE;
            choiceQuestion.answers.forEach((answer) => {
              answer.updateFlg = UpdateFlg.NOCHANGE;
            });
            this.testUpd.questions.push(choiceQuestion);
          }

          if (question.questionType === QuestionType.OPEN) {
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

  showUpdateQuestionDialog(index: number) : void {
    this.selectedUpdateQuesion = index;
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

  public get QuestionType() {
    return QuestionType; 
  }

  public get UpdateFlg() {
    return UpdateFlg;
  }

  background(questionUpd: QuestionUpd | ChoiceQuestionUpd): string {    
    if (questionUpd.updateFlg === UpdateFlg.NEW) {
      return "newQuestion";
    } else if (questionUpd.updateFlg === UpdateFlg.CHANGE) {
      return "updateQuestion";
    } else if (questionUpd.updateFlg === UpdateFlg.DELETE) {
      return "deleteQuestion";
    }

    return "";
  }

  showAddQuestionDialog(questionType: number) : void {
    if (questionType != QuestionType.OPEN && questionType != QuestionType.CHOICE) {
      return;
    }

    this.questionTypeForNew = questionType;
  }

  updateQuestion($event: QuestionUpd | ChoiceQuestionUpd) : void {
    if ($event == null) {
      this.selectedUpdateQuesion = -1;
      return;
    }
    
    if (this.testUpd.questions[this.selectedUpdateQuesion].updateFlg === UpdateFlg.NEW && 
        $event.updateFlg === UpdateFlg.DELETE) {
      this.testUpd.questions.splice(this.selectedUpdateQuesion, 1);
      this.selectedUpdateQuesion = -1;
      return;
    }

    this.testUpd.questions[this.selectedUpdateQuesion] = $event;
    this.selectedUpdateQuesion = -1;
  }

  saveQuestion($event: NewOpenQuestion | NewChoiceQuestion) : void {
    if ($event == null) {
      this.questionTypeForNew = -1;
      return;
    }

    if (this.questionTypeForNew === QuestionType.OPEN) {
      const question : NewOpenQuestion = $event as NewOpenQuestion;
      this.testUpd.questions.push({
        id: '',
        question: question.question,
        questionType: QuestionType.OPEN,
        updateFlg: UpdateFlg.NEW
      });
    } else if (this.questionTypeForNew === QuestionType.CHOICE) {
      const question : NewChoiceQuestion = $event as NewChoiceQuestion;
      const answers : ChoiceAnswerUpd[] = [];
      question.answers.forEach((answer) => {
        answers.push({
          id: '',
          answer: answer.answer,
          truth: answer.truth,
          updateFlg: UpdateFlg.NEW
        })
      });
      this.testUpd.questions.push({
        id: '',
        question: question.question,
        questionType: QuestionType.CHOICE,
        answers: answers,
        updateFlg: UpdateFlg.NEW
      });
    }
    
    this.questionTypeForNew = -1;
  }
}
