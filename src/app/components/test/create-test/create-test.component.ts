import { CommonModule, NgForOf } from "@angular/common";
import {
    Component,
    DestroyRef,
    inject,
    OnInit,
} from "@angular/core";
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Question } from "src/app/models/test/question.model";
import { CreateTestRequest } from "src/app/models/test/test.model";
import { TestService } from "src/app/services/test.service";
import { ListErrorsComponent } from "src/app/shared-components/list-errors/list-errors.component";
import { QuestionType } from "../../../models/test/QuestionType";
import { ChoiceAnswerForm } from "./form-model/ChoiceAnswerForm";
import { ChoiceQuestionForm } from "./form-model/ChoiceQuestionForm";
import { OpenQuestionForm } from "./form-model/OpenQuestionForm";
import { QuestionForm } from "./form-model/QuestionForm";
import { ApiError } from "src/app/models/apierrors.model";
import { EditorComponent } from "./editor/editor.component";
import { InputTextModule } from "primeng/inputtext";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: "app-create-test",
    templateUrl: "./create-test.component.html",
    styleUrls: ["./create-test.component.scss"],
    standalone: true,
    imports: [
      InputTextModule,
      ListErrorsComponent,
      FormsModule,
      ReactiveFormsModule,
      NgForOf,
      CommonModule,
      EditorComponent
    ]
})
export class CreateTestComponent implements OnInit {
  isSubmitting = false;
  errors!: ApiError;
  testForm: FormGroup = this.fb.group({
    title: this.fb.control(""),
    description: this.fb.control(""),
    questions: this.fb.array([]),
  });
  questionCount: number = 0;
  destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private readonly fb: FormBuilder,
    private readonly testService: TestService,
    private readonly router: Router
  ) {}

  get questionsFormArr(): FormArray<FormGroup<QuestionForm>> {
    return this.testForm.get("questions") as FormArray<FormGroup<QuestionForm>>;
  }

  get choiceQuestionsFormArr(): FormArray<FormGroup<ChoiceQuestionForm>> {
    return this.testForm.get("questions") as FormArray<
      FormGroup<ChoiceQuestionForm>
    >;
  }

  get openQuestionsFormArr(): FormArray<FormGroup<OpenQuestionForm>> {
    return this.testForm.get("questions") as FormArray<
      FormGroup<OpenQuestionForm>
    >;
  }

  getAnswerFormArr(qIndex: number): FormArray<FormGroup<ChoiceAnswerForm>> {
    const questions = this.testForm.get("questions") as FormArray<
      FormGroup<ChoiceQuestionForm>
    >;
    return questions.at(qIndex).get("answers") as FormArray<
      FormGroup<ChoiceAnswerForm>
    >;
  }

  ngOnInit(): void {}

  addChoiceQuestion() {
    this.choiceQuestionsFormArr.push(
      this.fb.group<ChoiceQuestionForm>({
        question: this.fb.nonNullable.control("", Validators.required),
        questionType: this.fb.nonNullable.control(
          QuestionType.CHOICE,
          Validators.required
        ),
        questionOrder: this.fb.nonNullable.control(this.questionCount + 1, Validators.required),
        answers: this.fb.array([
          this.fb.group<ChoiceAnswerForm>({
            answer: this.fb.nonNullable.control("", Validators.required),
            truth: this.fb.nonNullable.control(false, Validators.required),
          }),
          this.fb.group<ChoiceAnswerForm>({
            answer: this.fb.nonNullable.control("", Validators.required),
            truth: this.fb.nonNullable.control(false, Validators.required),
          }),
          this.fb.group<ChoiceAnswerForm>({
            answer: this.fb.nonNullable.control("", Validators.required),
            truth: this.fb.nonNullable.control(false, Validators.required),
          }),
          this.fb.group<ChoiceAnswerForm>({
            answer: this.fb.nonNullable.control("", Validators.required),
            truth: this.fb.nonNullable.control(false, Validators.required),
          }),
        ]),
      })
    );
    this.questionCount++;
  }

  addOpenQuestion() {
    this.openQuestionsFormArr.push(
      this.fb.group<OpenQuestionForm>({
        question: this.fb.nonNullable.control("", Validators.required),
        questionType: this.fb.nonNullable.control(
          QuestionType.OPEN,
          Validators.required,
        ),
        questionOrder: this.fb.nonNullable.control(this.questionCount + 1, Validators.required)
      })
    );
    this.questionCount++;
  }

  deleteQuestion(qIndex: number) {
    this.questionsFormArr.removeAt(qIndex);
    this.questionCount--;
  }

  submitForm() {
    const questions: Question[] = this.testForm.value.questions as Question[];
    const title: string = this.testForm.value.title as string;
    const description: string = this.testForm.value.description as string;
    // create post request
    const test: CreateTestRequest = {
      title: title,
      description: description,
      questions: questions,
    };
    this.testService
      .create(test)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          void this.router.navigate(["/tests"]);
        },
        error: (errors: ApiError) => {
          this.errors = errors;
          this.isSubmitting = false;
        },
      });
  }

  addAnswer(qIndex: number, event?: KeyboardEvent) {
    if (event != null) {
      return;
    }

    this.getAnswerFormArr(qIndex).push(
      this.fb.group<ChoiceAnswerForm>({
        answer: this.fb.nonNullable.control("", Validators.required),
        truth: this.fb.nonNullable.control(false, Validators.required),
      })
    );
  }

  deleteAnswer(qIndex: number, aIndex: number) {
    this.getAnswerFormArr(qIndex).removeAt(aIndex);
  }

  isChoiceQuestion(qIndex: number): boolean {
    const question = this.questionsFormArr.at(qIndex) as FormGroup<QuestionForm>;
    if (question.value.questionType == QuestionType.CHOICE) {
      return true;
    }

    return false;
  }

  questionChange($event: string, question: FormGroup<QuestionForm>) {
    const questionForm : FormControl = question.get("question") as FormControl;

    if (question == null) {
      return;
    }

    questionForm.setValue($event);
  }

  answerChange($event: string, answer: FormGroup<ChoiceAnswerForm>) {
    const answerForm : FormControl = answer.get("answer") as FormControl;

    if (answer == null) {
      return;
    }
    answerForm.setValue($event);
  }
}
