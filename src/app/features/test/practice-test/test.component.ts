import { NgForOf, CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
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
  RouterLink,
  RouterLinkActive,
} from "@angular/router";
import {
  catchError,
  throwError,
  takeUntil,
  Subject,
} from "rxjs";
import { TestService } from "src/app/core/services/test.service";
import { UserService } from "src/app/core/services/user.service";
import { PracticeService } from "src/app/core/services/practice.service";
import { Practice } from "src/app/core/models/test/practice.model";
import { ChoiceQuestion } from "src/app/core/models/test/choicequestion.model";
import { QuestionType } from "../create-test/enum/QuestionType";
import { Question } from "src/app/core/models/test/question.model";
import { ApiError } from "src/app/core/models/apierrors.model";

@Component({
    selector: "app-test",
    templateUrl: "./test.component.html",
    styleUrls: ["./test.component.css"],
    standalone: true,
    imports: [
        RouterLinkActive,
        RouterLink,
        NgForOf,
        CommonModule,
        ReactiveFormsModule,
    ]
})
export class TestComponent implements OnInit {
  errors!: ApiError[];
  isSubmitting = false;
  title: string = "";
  questions: Question[] = [];
  destroy$ = new Subject<void>();
  questionForm: FormGroup = new FormGroup([]);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly testService: TestService,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly practiceService: PracticeService
  ) {}

  toFormGroup(questions: Question[]) {
    const group: any = {};

    questions.forEach((question) => {
      if (question.questionType == 1) {
          const choiceQuestion = question as ChoiceQuestion;
          if (choiceQuestion.isMultipleAnswers) {
            let array: FormArray = this.fb.array([]);
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
      } else {
        group[question.id] = this.fb.control("");
      }
    });

    return new FormGroup(group);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params["id"];
    console.log(id);
    this.testService.getOne(id)
      .pipe(
        catchError((err) => {
          void this.router.navigate(["/"]);
          return throwError(() => err);
        })
      )
      .subscribe(({data}) => {
        data.questions.forEach((question) => {
          this.title = data.title;
          if (question.questionType == QuestionType.CHOICE) {
            const choiceQuestion = question as ChoiceQuestion;
            this.questions.push(choiceQuestion);
          } else if (question.questionType == QuestionType.ESSAY) {
            this.questions.push(question);
          }
        });

        this.questionForm = this.toFormGroup(this.questions);
      });
  }

  asChoiceQuestion(qIndex: number): ChoiceQuestion {
    const q = this.questions[qIndex] as ChoiceQuestion
    return q;
  }

  createPractice() {
    const practice: Practice = {
      id: this.route.snapshot.params["id"],
      choiceAnswers: [],
      essayAnswers: [],
    };

    this.questions.forEach((question) => {
      const answerControl: FormControl = this.questionForm.controls[
        question.id
      ] as FormControl;
      if (question.questionType == QuestionType.CHOICE) {
        const choiceQuestion: ChoiceQuestion = question as ChoiceQuestion;
        if (!choiceQuestion.isMultipleAnswers) {
          practice.choiceAnswers.push({
            questionId: question.id,
            answerId: [answerControl.value]
          });
        } else {
          let selectedAnswers: string[] = [];
          answerControl.value.forEach((val : any) => {
            if (val.selected) {
              selectedAnswers.push(val.answerId);
            }
          });
          practice.choiceAnswers.push({
            questionId: question.id,
            answerId: selectedAnswers
          });
        }
      } else if (question.questionType == QuestionType.ESSAY) {
        practice.essayAnswers.push({
          questionId: question.id,
          answer: answerControl.value,
        });
      }
    });
    console.log(practice);
    this.practiceService.createPractice(practice)
      .subscribe(({data}) => {
          this.router.navigate([`@${this.userService.userSignal()?.username}/practices/${data.practiceId}`]);
        },
      );
  }

  deleteTest() {
    this.testService
      .delete(this.route.snapshot.params["id"])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.router.navigate(["/tests"]);
        },
        error: (errors) => {
          this.errors = errors;
          this.isSubmitting = false;
        },
      });
  }
}
