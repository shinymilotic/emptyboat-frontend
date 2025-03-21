import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { UpdateChoiceAnswerForm } from "./update-choice-answer.form";

export interface UpdateChoiceQuestionForm {
    question: FormControl<string>,
    answers: FormArray<FormGroup<UpdateChoiceAnswerForm>>;
}