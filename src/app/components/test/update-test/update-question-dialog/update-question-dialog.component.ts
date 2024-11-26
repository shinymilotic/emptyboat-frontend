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
import { UpdateChoiceQuestionForm } from './update-choice-question.form';
import { UpdateOpenQuestionForm } from './update-open-question.form';
import { UpdateChoiceAnswerForm } from './update-choice-answer.form';

@Component({
  selector: 'app-update-question-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule, InputTextModule, 
    ReactiveFormsModule, FormsModule, ContenteditableValueAccessor],
  templateUrl: './update-question-dialog.component.html',
  styleUrl: './update-question-dialog.component.css'
})
export class UpdateQuestionDialogComponent implements OnInit {
  @Input() updateQuestion!: QuestionUpd | ChoiceQuestionUpd;
  @Output() updateQuestionChange = new EventEmitter<QuestionUpd | ChoiceQuestionUpd>();
  visible: boolean = true;
  questionForm!: FormGroup<UpdateChoiceQuestionForm | UpdateOpenQuestionForm>;

  constructor(
    private readonly fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.questionForm = this.toFormGroup(this.updateQuestion);
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

    if (this.questionForm.value == null) {
      return;
    }

    let updateFlg : UpdateFlg = UpdateFlg.CHANGE;

    if (questionFormValue.updateFlg === UpdateFlg.NEW) {
      updateFlg = UpdateFlg.NEW;
    }


    if (questionFormValue.questionType === QuestionType.CHOICE) {
      this.updateQuestionChange.emit({
        id: questionFormValue.id,
        question: questionFormValue.question,
        questionType: questionFormValue.questionType,
        answers: this.answerFormToAnswersUpdate(),
        updateFlg: updateFlg
      });   
    } else if (questionFormValue.questionType === QuestionType.OPEN) {
      this.updateQuestionChange.emit({
        id: questionFormValue.id,
        question: questionFormValue.question,
        questionType: questionFormValue.questionType,
        updateFlg: updateFlg
      });
    }
  }

  closeDiablog() {
    this.updateQuestionChange.emit(undefined);
  }

  deleteQuestion() {
    const questionFormValue : any = this.questionForm.value;

    this.updateQuestionChange.emit({
      id: questionFormValue.id,
      question: questionFormValue.question,
      questionType: questionFormValue.questionType,
      updateFlg: UpdateFlg.DELETE
    });
  }

  public get QuestionType() {
    return QuestionType; 
  }

  public get UpdateFlg() {
    return UpdateFlg;
  }

  answerFormToAnswersUpdate() : ChoiceAnswerUpd[]{
    let result : ChoiceAnswerUpd[] = [];

    this.getAnswersFormArr().map((group: any) => {
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

  getAnswersFormArr(): FormArray<FormGroup<UpdateChoiceAnswerForm>> {
    return this.questionForm.get('answers') as FormArray<FormGroup<UpdateChoiceAnswerForm>>;
  }

  deleteAnswer(choiceAnswerUpd: FormGroup<UpdateChoiceAnswerForm>) {
    // choiceAnswerUpd.updateFlg = UpdateFlg.DELETE;
  }

  answerChange(answer: FormGroup<UpdateChoiceAnswerForm>) {
    const answerValue :FormGroup<UpdateChoiceAnswerForm> = answer;
    if (answerValue.value.updateFlg === UpdateFlg.DELETE) {
      return;
    }

    answerValue.value.updateFlg = UpdateFlg.CHANGE;
  }

  answerBackground(choiceAnswerUpd: FormGroup<UpdateChoiceAnswerForm>): string {
    if (choiceAnswerUpd.value.updateFlg === UpdateFlg.NEW) {
      return "newAnswer";
    } else if (choiceAnswerUpd.value.updateFlg == UpdateFlg.DELETE) {
      return "deleteAnswer";
    }

    return "";
  }

  addAnswer() : void {
    this.getAnswersFormArr().push(this.fb.group<UpdateChoiceAnswerForm>({
      id: this.fb.control('', Validators.required),
      answer: this.fb.control("", Validators.required),
      truth: this.fb.control(false, Validators.required),
      updateFlg: this.fb.control(UpdateFlg.NEW, Validators.required)
    } as UpdateChoiceAnswerForm));
  }
}
