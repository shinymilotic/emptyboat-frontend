import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ContenteditableValueAccessor } from 'src/app/directives/contenteditable.directive';
import { QuestionType } from 'src/app/models/test/QuestionType';
import { UpdateFlg } from 'src/app/models/update-flg.enum';
import { AddChoiceAnswerForm } from './add-choice-answer.form';
import { AddQuestionForm } from './add-question.form';
import { NewQuestion } from './new-question.model';
import { AddChoiceQuestionForm } from './add-choice-question.form';
import { AddOpenQuestionForm } from './add-open-question.form';
import { NewOpenQuestion } from './new-open-question.model';
import { NewChoiceQuestion } from './new-choice-question.model';
import { NewChoiceAnswer } from './new-choice-answer.mode';

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
  @Output() saveQuestion = new EventEmitter<NewQuestion>();
  visible: boolean = true;
  questionForm!: FormGroup<AddChoiceQuestionForm | AddOpenQuestionForm>;

  constructor(
    private readonly fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.questionForm = this.toQuestionForm(this.questionType);
  }

  saveNewQuestion() : void {
    if (this.questionForm == null) {
      return;
    }

    const question: FormControl<string> = this.questionForm.get('question') as FormControl<string>;
    if (question == null) {
      return;
    }

    if (this.questionType === QuestionType.CHOICE) {
      const answersForm : FormArray<FormGroup<AddChoiceAnswerForm>> | undefined = this.getAnswersFormArr();
      const answers : NewChoiceAnswer[] = [];
      if (answersForm == undefined) {
        return;
      }
      answersForm.controls.forEach((answerForm: FormGroup<AddChoiceAnswerForm>) => {
        const answer: string | undefined = answerForm.get('answer')?.value;

        if (answer == null || answer.length == 0) {
          return;
        }

        answers.push({
          answer: answer,
          truth: answerForm.get('truth')?.value
        } as NewChoiceAnswer);
      })

      this.saveQuestion.emit({
        question: question.value,
        answers: answers
      } as NewChoiceQuestion)
    } else if (this.questionType === QuestionType.OPEN) {
      this.saveQuestion.emit({
        question: question.value,
      } as NewOpenQuestion);
    }
    
  }

  closeNewQuestionDiablog() {
    this.saveQuestion.emit(undefined);
  }

  toQuestionForm(questionType: Number) : FormGroup<AddOpenQuestionForm | AddChoiceQuestionForm> {
    if (questionType === QuestionType.OPEN) {
      const question : AddOpenQuestionForm = {
        question: this.fb.control<string>('', Validators.required),
      }
      return this.fb.group<AddOpenQuestionForm>(question);
    } else if (questionType === QuestionType.CHOICE) {
      return this.fb.group<AddQuestionForm>({
        question: this.fb.control('', Validators.required),
        answers: new FormArray<FormGroup<AddChoiceAnswerForm>>([
          this.fb.group<AddChoiceAnswerForm>({
            answer: this.fb.control("", Validators.required),
            truth: this.fb.control(false, Validators.required),
          } as AddChoiceAnswerForm),
          this.fb.group<AddChoiceAnswerForm>({
            answer: this.fb.control("", Validators.required),
            truth: this.fb.control(false, Validators.required),
          } as AddChoiceAnswerForm),
          this.fb.group<AddChoiceAnswerForm>({
            answer: this.fb.control("", Validators.required),
            truth: this.fb.control(false, Validators.required),
          } as AddChoiceAnswerForm),this.fb.group<AddChoiceAnswerForm>({
            answer: this.fb.control("", Validators.required),
            truth: this.fb.control(false, Validators.required),
          } as AddChoiceAnswerForm)
        ]),
      } as AddChoiceQuestionForm);
    }

    return this.fb.group<AddOpenQuestionForm>({
      question: this.fb.control<string>('', Validators.required),
    });
  }

  public get QuestionType() {
    return QuestionType; 
  }

  public get UpdateFlg() {
    return UpdateFlg;
  }

  deleteAnswer(answer: FormGroup<AddChoiceAnswerForm>) {
    this.getAnswersFormArr().removeAt(this.getAnswersFormArr().controls.indexOf(answer));
  }

  getAnswersFormArr(): FormArray<FormGroup<AddChoiceAnswerForm>> {
    return this.questionForm.get('answers') as FormArray<FormGroup<AddChoiceAnswerForm>>;
  }

  addAnswer() {
    this.getAnswersFormArr().push(this.fb.group<AddChoiceAnswerForm>({
      answer: this.fb.control("", Validators.required),
      truth: this.fb.control(false, Validators.required),
    } as AddChoiceAnswerForm));
  }
}
