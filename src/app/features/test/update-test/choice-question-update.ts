import { QuestionUpd } from "./question-update";

export interface ChoiceQuestionUpd extends QuestionUpd {
    id: string;
    question: string;
    questionType: number;
    updateFlg: number;
}