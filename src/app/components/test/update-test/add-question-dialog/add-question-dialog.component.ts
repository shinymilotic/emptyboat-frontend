import { NgFor, NgForOf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { catchError, throwError } from 'rxjs';
import { ContenteditableValueAccessor } from 'src/app/directives/contenteditable.directive';
import { ApiError } from 'src/app/models/apierrors.model';
import { ChoiceQuestion } from 'src/app/models/test/choicequestion.model';
import { Question } from 'src/app/models/test/question.model';
import { QuestionType } from 'src/app/models/test/QuestionType';
import { UpdateFlg } from 'src/app/models/update-flg.enum';
import { TestService } from 'src/app/services/test.service';
import { ListErrorsComponent } from 'src/app/shared-components/list-errors/list-errors.component';
import { ChoiceAnswerUpd } from '../choice-answer-update';
import { ChoiceQuestionUpd } from '../choice-question-update';
import { QuestionUpd } from '../question-update';
import { TestResponseUpd } from '../test-response-update';

@Component({
  selector: 'app-add-question-dialog',
  standalone: true,
  imports: [ListErrorsComponent, DialogModule, ButtonModule, InputTextModule, 
    ReactiveFormsModule, FormsModule, NgFor, NgForOf, ContenteditableValueAccessor],
  templateUrl: './add-question-dialog.component.html',
  styleUrl: './add-question-dialog.component.css'
})
export class AddQuestionDialogComponent implements OnInit {
  visible: boolean = false;
  newQuestionForm!: FormGroup;
  @Input() newQuestion?: QuestionUpd | ChoiceQuestionUpd;
  @Output() newQuestionChange = new EventEmitter<QuestionUpd | ChoiceQuestionUpd>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly testService: TestService,
    private readonly router: Router,
    private readonly fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.newQuestionForm = this.toNewQuestionForm(this.newQuestion);
  }

  saveNewQuestion() {
    
  }

  closeNewQuestionDiablog() {
    
  }

  toNewQuestionForm(newQuestion?: QuestionUpd | ChoiceQuestionUpd) : FormGroup {
    if (newQuestion?.questionType === QuestionType.OPEN) {
      return this.fb.group({
        id: "",
        question: this.fb.control(newQuestion.question, Validators.required),
        updateFlg: this.fb.control(UpdateFlg.NEW, Validators.required)
      });
    } else if (newQuestion?.questionType === QuestionType.CHOICE) {
      const choiceQuestion: ChoiceQuestionUpd = newQuestion as ChoiceQuestionUpd;
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
        updateFlg: this.fb.control(newQuestion.updateFlg, Validators.required)
      });
    }

    return this.fb.group({});
  }

  public get QuestionType() {
    return QuestionType; 
  }

  public get UpdateFlg() {
    return UpdateFlg;
  }

  getAnswerFormArr(): ChoiceAnswerUpd[] {
    return this.newQuestionForm.value.answers;
  }

  deleteAnswer(choiceAnswerUpd: ChoiceAnswerUpd) {
    choiceAnswerUpd.updateFlg = UpdateFlg.DELETE;
  }
}
