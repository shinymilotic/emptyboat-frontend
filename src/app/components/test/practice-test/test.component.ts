import { NgForOf, CommonModule } from "@angular/common";
import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from "@angular/forms";
import {
  ActivatedRoute,
  Router,
} from "@angular/router";
import {
  catchError,
  throwError,
} from "rxjs";
import { TestService } from "src/app/services/test.service";
import { UserService } from "src/app/services/user.service";
import { PracticeService } from "src/app/services/practice.service";
import { Practice } from "src/app/models/test/practice.model";
import { ChoiceQuestion } from "src/app/models/test/choicequestion.model";
import { QuestionType } from "../../../models/test/QuestionType";
import { Question } from "src/app/models/test/question.model";
import { ApiError } from "src/app/models/apierrors.model";
import { TestResponse } from "src/app/models/test/test-response.model";
import { OpenQuestionEditorComponent } from "./practice-open-question-editor/open-question-editor.component";
import { User } from "src/app/models/auth/user.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: "app-test",
    templateUrl: "./test.component.html",
    styleUrls: ["./test.component.css"],
    standalone: true,
    imports: [
        NgForOf,
        CommonModule,
        ReactiveFormsModule,
        OpenQuestionEditorComponent
    ]
})
export class TestComponent implements OnInit {
  errors!: ApiError;
  isSubmitting = false;
  test: TestResponse = {
    author: {
      id: '',
      email: '',
      username: '',
      bio: '',
      image: ''
    },
    description: "",
    questions: [],
    title: "",
  };
  destroyRef: DestroyRef = inject(DestroyRef);
  questionForm: FormGroup = new FormGroup([]);
  
  constructor(
    private readonly route: ActivatedRoute,
    private readonly testService: TestService,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly practiceService: PracticeService
  ) {}

  canModify(): boolean {
    return this.userService.userSignal()?.id == this.test.author.id;
  }

  toFormGroup(questions: Question[]) {
    const group: any = {};
    questions.forEach((question) => {
      if (question.questionType === QuestionType.CHOICE) {
          const choiceQuestion = question as ChoiceQuestion;
          const array: FormArray = this.fb.array([]);
          choiceQuestion.answers.forEach(answer => {
            array.push(this.fb.group({
              answerId: answer.id,
              selected: false
            }));
          });

          group[question.id] = array;
      } else {
        group[question.id] = this.fb.control("");
      }
    });

    return new FormGroup(group);
  }

  

  ngOnInit(): void {
    const id = this.route.snapshot.params["id"];

    this.testService.getOne(id)
      .pipe(
        catchError((err) => {
          void this.router.navigate(["/"]);
          return throwError(() => err);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data) => {
        this.test = data;
        this.questionForm = this.toFormGroup(this.test.questions);
      });
  }

  asChoiceQuestion(qIndex: number): ChoiceQuestion {
    const q = this.test.questions[qIndex] as ChoiceQuestion
    return q;
  }

  createPractice() {
    const practice: Practice = {
        testId: this.route.snapshot.params["id"],
        practices: []
    };

    this.test.questions.forEach((question) => {
      const answerControl: FormControl = this.questionForm.controls[question.id] as FormControl;
      if (question.questionType === QuestionType.CHOICE) {     
        const answers : Array<string> = [];
        answerControl.value.forEach((val : any) => {
          if (val.selected) {
            answers.push(val.answerId)
          }
        });

        practice.practices.push({
          questionId: question.id,
          questionType: QuestionType.CHOICE,
          answer: answers
        });
      } else if (question.questionType === QuestionType.OPEN) {
        practice.practices.push({
          questionId: question.id,
          questionType: QuestionType.OPEN,
          answer: answerControl.value,
        });
      }
    });
    this.practiceService.createPractice(practice)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        const user: User | null = this.userService.userSignal();

        if (user == null) {
          return;
        }

        this.router.navigate(
          [`@${user.username}/practices/${data.practiceId}`]);
      });
  }

  deleteTest() {
    this.testService
      .delete(this.route.snapshot.params["id"])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigate(["/tests"]);
        },
        error: (errors: ApiError) => {
          this.errors = errors;
          this.isSubmitting = false;
        },
      });
  }

  editTest() {
    this.router.navigate(["/test", this.route.snapshot.params["id"], "update"]);
  }

  public get QuestionType() {
    return QuestionType;
  }

  contentChange($event: string, questionId : string) {
    const form : FormControl = this.questionForm.get(questionId) as FormControl;

    if (form == null) {
      return;
    }
    
    form.setValue($event);
  }
}
