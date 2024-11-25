import { NewChoiceAnswer } from "./new-choice-answer.mode";
import { NewQuestion } from "./new-question.model";

export interface NewChoiceQuestion extends NewQuestion {
    answers: NewChoiceAnswer[]
}