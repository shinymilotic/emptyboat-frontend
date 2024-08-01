import { Question } from "src/app/core/models/test/question.model";

export interface QuestionUpd {
    question: Question;
    updateFlg: number;
}