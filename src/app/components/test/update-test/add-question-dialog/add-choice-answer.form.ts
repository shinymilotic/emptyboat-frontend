import { FormControl } from "@angular/forms";

export interface AddChoiceAnswerForm {
    answer: FormControl<string>,
    truth: FormControl<boolean>,
}