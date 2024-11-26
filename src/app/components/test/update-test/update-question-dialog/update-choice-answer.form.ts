import { FormControl } from "@angular/forms";

export interface UpdateChoiceAnswerForm {
    id: FormControl<string>;
    answer: FormControl<string>;
    truth: FormControl<boolean>;
    updateFlg: FormControl<number>;
}