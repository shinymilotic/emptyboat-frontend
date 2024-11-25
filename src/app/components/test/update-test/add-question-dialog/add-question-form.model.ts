import { FormControl } from "@angular/forms";

export interface AddQuestionForm {
    question: FormControl<string | null>,
}