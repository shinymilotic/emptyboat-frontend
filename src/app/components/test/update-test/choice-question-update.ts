import { ChoiceAnswerUpd } from "./choice-answer-update";

export interface ChoiceQuestionUpd {
    id: string;
    question: string;
    questionType: number;
    answers: ChoiceAnswerUpd[];
    updateFlg: number;
}