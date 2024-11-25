import { NgFor, NgForOf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ContenteditableValueAccessor } from 'src/app/directives/contenteditable.directive';
import { QuestionType } from 'src/app/models/test/QuestionType';
import { UpdateFlg } from 'src/app/models/update-flg.enum';
import { ChoiceAnswerUpd } from '../choice-answer-update';
import { ChoiceQuestionUpd } from '../choice-question-update';
import { QuestionUpd } from '../question-update';
import { AddChoiceAnswerForm } from './add-choice-answer-form.model';

@Component({
  selector: 'app-add-question-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule, InputTextModule, 
    ReactiveFormsModule, FormsModule, ContenteditableValueAccessor],
  templateUrl: './add-question-dialog.component.html',
  styleUrl: './add-question-dialog.component.css'
})
export class AddQuestionDialogComponent implements OnInit {
  @Input() questionType!: number;
  @Output() saveQuestion = new EventEmitter<QuestionUpd | ChoiceQuestionUpd>();
  visible: boolean = true;
  questionForm!: FormGroup<AddQuestionForm>;

  constructor(
    private readonly fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.questionForm = this.toQuestionForm(this.questionType);
  }

  saveNewQuestion() {
    this.saveQuestion.emit(this.questionForm.value);
  }

  closeNewQuestionDiablog() {
    this.saveQuestion.emit(undefined);
  }

  toQuestionForm(questionType: Number) : FormGroup {
    if (questionType === QuestionType.OPEN) {
      return this.fb.group({
        id: "",
        question: this.fb.control('', Validators.required),
        questionType: questionType,
        updateFlg: this.fb.control(UpdateFlg.NEW, Validators.required)
      });
    } else if (questionType === QuestionType.CHOICE) {
      return this.fb.group({
        id: '',
        question: this.fb.control('', Validators.required),
        answers: new FormArray<FormGroup>([]),
        questionType: questionType,
        updateFlg: this.fb.control(UpdateFlg.NEW, Validators.required)
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
    return this.questionForm.value.answers as ChoiceAnswerUpd[];
  }

  deleteAnswer(choiceAnswerUpd: ChoiceAnswerUpd) {
    choiceAnswerUpd.updateFlg = UpdateFlg.DELETE;
  }

  getAnswersFormArr(): FormArray<FormGroup> {
    return this.questionForm.get('answers') as FormArray<FormGroup<AddChoiceAnswerForm>>;
  }

  addAnswer() {
    // this.questionForm.addControl('answers', new FormArray<FormGroup>([]));
    
    this.questionForm.value.answers.push({
      id: "",
      answer: "",
      truth: false,
      updateFlg: UpdateFlg.NEW
    });
  }
}
