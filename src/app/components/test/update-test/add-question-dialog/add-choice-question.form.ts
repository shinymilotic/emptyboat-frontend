import { FormArray, FormGroup } from "@angular/forms";
import { AddQuestionForm } from "./add-question.form";
import { AddChoiceAnswerForm } from "./add-choice-answer.form";

export interface AddChoiceQuestionForm extends AddQuestionForm{
    answers: FormArray<FormGroup<AddChoiceAnswerForm>>;
}