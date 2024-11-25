import { FormControl } from "@angular/forms";

export interface AddQuestionForm {
    id: string,
    question: FormControl<string>,
    questionType: number
}