import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { UpdateChoiceAnswerForm } from "./update-choice-answer.form";

export interface UpdateOpenQuestionForm {
    question: FormControl<string>,
}