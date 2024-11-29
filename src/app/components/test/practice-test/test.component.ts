import { NgForOf, CommonModule } from "@angular/common";
import { AfterRenderPhase, AfterViewChecked, AfterViewInit, Component, OnInit } from "@angular/core";
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
  takeUntil,
  Subject,
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
import { Editor } from "@tiptap/core";
import { StarterKit } from "@tiptap/starter-kit";

@Component({
    selector: "app-test",
    templateUrl: "./test.component.html",
    styleUrls: ["./test.component.css"],
    standalone: true,
    imports: [
        NgForOf,
        CommonModule,
        ReactiveFormsModule,
    ]
})
export class TestComponent implements OnInit {
  errors!: ApiError[];
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
  destroy$ = new Subject<void>();
  questionForm: FormGroup = new FormGroup([]);
  editor!: Editor;
  editors: any = {};
  items: Array<any> = [];
  
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

  showEditorMenuOnClick(questionId: number) : void {
    this.items = [
      {
        icon: 'format_bold',
        title: 'Bold',
        action: () => this.editors[questionId].chain().focus().toggleBold().run(),
        isActive: () => this.editors[questionId].isActive('bold'),
      },
      {
        icon: 'format_italic',
        title: 'Italic',
        action: () => this.editors[questionId].chain().focus().toggleItalic().run(),
        isActive: () => this.editors[questionId].isActive('italic'),
      },
      {
        icon: 'format_strikethrough',
        title: 'Strike',
        action: () => this.editors[questionId].chain().focus().toggleStrike().run(),
        isActive: () => this.editors[questionId].isActive('strike'),
      },
      {
        icon: 'code',
        title: 'Code',
        action: () => this.editors[questionId].chain().focus().toggleCode().run(),
        isActive: () => this.editors[questionId].isActive('code'),
      },
      {
        icon: 'format_h1',
        title: 'Heading 1',
        action: () => this.editors[questionId].chain().focus().toggleHeading({ level: 1 }).run(),
        isActive: () => this.editors[questionId].isActive('heading', { level: 1 }),
      },
      {
        icon: 'format_h2',
        title: 'Heading 2',
        action: () => this.editors[questionId].chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: () => this.editors[questionId].isActive('heading', { level: 2 }),
      },
      {
        icon: 'format_paragraph',
        title: 'Paragraph',
        action: () => this.editors[questionId].chain().focus().setParagraph().run(),
        isActive: () => this.editors[questionId].isActive('paragraph'),
      },
      {
        icon: 'format_list_bulleted',
        title: 'Bullet List',
        action: () => this.editors[questionId].chain().focus().toggleBulletList().run(),
        isActive: () => this.editors[questionId].isActive('bulletList'),
      },
      {
        icon: 'format_list_numbered',
        title: 'Ordered List',
        action: () => this.editors[questionId].chain().focus().toggleOrderedList().run(),
        isActive: () => this.editors[questionId].isActive('orderedList'),
      },
      {
        icon: 'code_blocks',
        title: 'Code Block',
        action: () => this.editors[questionId].chain().focus().toggleCodeBlock().run(),
        isActive: () => this.editors[questionId].isActive('codeBlock'),
      },

      {
        icon: 'format_quote',
        title: 'Blockquote',
        action: () => this.editors[questionId].chain().focus().toggleBlockquote().run(),
        isActive: () => this.editors[questionId].isActive('blockquote'),
      },
      {
        icon: 'horizontal_rule',
        title: 'Horizontal Rule',
        action: () => this.editors[questionId].chain().focus().setHorizontalRule().run(),
      },
      {
        icon: 'undo',
        title: 'Undo',
        action: () => this.editors[questionId].chain().focus().undo().run(),
        isActive: () => this.editors[questionId].isActive('undo'),
      },
      {
        icon: 'redo',
        title: 'Redo',
        action: () => this.editors[questionId].chain().focus().redo().run(),
        isActive: () => this.editors[questionId].isActive('redo'),
      },
    ];
  }

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
        this.test = data;
        this.questionForm = this.toFormGroup(this.test.questions);
      });
  }

  afterRender(): void {
    this.test.questions
          .filter(question => question.questionType === QuestionType.OPEN)
          .map(question => {
          this.editors[question.id] = new Editor({
            element: document.querySelector('.' + question.id) as HTMLElement,
            extensions: [
              StarterKit,
            ],
            content: '<div class="editor-content"></div>',
          });
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
    console.log(practice);
    this.practiceService.createPractice(practice)
      .subscribe(({data}) => {
          this.router.navigate(
            [`@${this.userService.userSignal()?.username}/practices/${data.practiceId}`]);
      });
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

  editTest() {
    this.router.navigate(["/test", this.route.snapshot.params["id"], "update"]);
  }

  public get QuestionType() {
    return QuestionType;
  }
}
