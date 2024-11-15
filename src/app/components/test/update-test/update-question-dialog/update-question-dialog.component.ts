import { Component, computed, EventEmitter, Input, OnChanges, OnInit, Output, Signal, SimpleChanges, WritableSignal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor, NgForOf } from '@angular/common';
import { ContenteditableValueAccessor } from 'src/app/directives/contenteditable.directive';
import { UpdateFlg } from 'src/app/models/update-flg.enum';
import { ListErrorsComponent } from 'src/app/shared-components/list-errors/list-errors.component';
import { QuestionType } from 'src/app/models/test/QuestionType';
import { ChoiceAnswerUpd } from '../choice-answer-update';
import { ChoiceQuestionUpd } from '../choice-question-update';
import { QuestionUpd } from '../question-update';
import { UpdateQuestionForm } from './update-question-form';

@Component({
  selector: 'app-update-question-dialog',
  standalone: true,
  imports: [ListErrorsComponent, DialogModule, ButtonModule, InputTextModule, 
    ReactiveFormsModule, FormsModule, NgFor, NgForOf, ContenteditableValueAccessor],
  templateUrl: './update-question-dialog.component.html',
  styleUrl: './update-question-dialog.component.css'
})
export class UpdateQuestionDialogComponent implements OnChanges, OnInit {
  @Input() updateQuestion!: QuestionUpd | ChoiceQuestionUpd;
  @Output() updateQuestionChange = new EventEmitter<QuestionUpd | ChoiceQuestionUpd>();
  questionForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.questionForm = this.toFormGroup(this.updateQuestion);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (this.updateQuestion == null) {
    //   this.emptyUpdateQuestionForm();
    //   return;
    // }

    // this.updateQuestionForm = {
    //   questionForm: this.toFormGroup(this.updateQuestion),
    //   visible: true
    // };
  }

  toFormGroup(updQuestion?: QuestionUpd | ChoiceQuestionUpd) : FormGroup {
    if (updQuestion?.questionType == QuestionType.OPEN) {
      return this.fb.group({
        id: updQuestion.id,
        question: this.fb.control(updQuestion.question, Validators.required),
        questionType: updQuestion.questionType,
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
        questionType: updQuestion.questionType,
        answers: answersFormArray,
        updateFlg: this.fb.control(updQuestion.updateFlg, Validators.required)
      });
    }

    return this.fb.group({});
  } 

  saveQuestion() {
    const questionFormValue : any = this.questionForm.value;

    if (questionFormValue == null) {
      return;
    }

    if (questionFormValue.questionType === QuestionType.CHOICE) {
      this.updateQuestionChange.emit({
        id: questionFormValue.id,
        question: questionFormValue.question,
        questionType: questionFormValue.questionType,
        answers: this.answerFormToAnswersUpdate(),
        updateFlg: UpdateFlg.CHANGE
      });   
    } else if (questionFormValue.questionType === QuestionType.OPEN) {
      this.updateQuestionChange.emit({
        id: questionFormValue.id,
        question: questionFormValue.question,
        questionType: questionFormValue.questionType,
        updateFlg: UpdateFlg.CHANGE
      });
    }
  }

  closeDiablog() {
    this.updateQuestionChange.emit(undefined);
  }

  deleteQuestion() {
    if (this.updateQuestion != null) {
      this.updateQuestion = {
        id: this.updateQuestion.id,
        question: this.updateQuestion.question,
        questionType: this.updateQuestion.questionType,
        updateFlg: UpdateFlg.DELETE
      }

      this.updateQuestionChange.emit(this.updateQuestion);
    } else {
      this.updateQuestionChange.emit(undefined);
    }
  }

  public get QuestionType() {
    return QuestionType; 
  }

  public get UpdateFlg() {
    return UpdateFlg;
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

  deleteAnswer(choiceAnswerUpd: ChoiceAnswerUpd) {
    choiceAnswerUpd.updateFlg = UpdateFlg.DELETE;
  }

  answerChange(answer: ChoiceAnswerUpd) {
    if (answer.updateFlg === UpdateFlg.DELETE) {
      return;
    }

    answer.updateFlg = UpdateFlg.CHANGE;
  }

  answerBackground(choiceAnswerUpd: ChoiceAnswerUpd): string {
    if (choiceAnswerUpd.updateFlg === UpdateFlg.NEW) {
      return "newAnswer";
    } else if (choiceAnswerUpd.updateFlg == UpdateFlg.DELETE) {
      return "deleteAnswer";
    }

    return "";
  }
}
