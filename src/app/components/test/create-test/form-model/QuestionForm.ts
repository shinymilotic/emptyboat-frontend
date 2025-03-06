import { FormControl } from "@angular/forms";
import { QuestionType } from "../../../../models/test/QuestionType";

export interface QuestionForm {
  question: FormControl<string>;
  questionType: FormControl<QuestionType>;
  questionOrder: FormControl<number>;
}
