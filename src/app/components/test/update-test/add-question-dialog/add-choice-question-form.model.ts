import { FormArray, FormGroup } from "@angular/forms";
import { AddQuestionForm } from "./add-question-form.model";
import { AddChoiceAnswerForm } from "./add-choice-answer-form.model";

export interface AddChoiceQuestionForm extends AddQuestionForm{
    answers: FormArray<FormGroup<AddChoiceAnswerForm>>;
}