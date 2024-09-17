import { Question } from "src/app/models/test/question.model";

export interface QuestionUpd extends Question {
    id: string;
    question: string;
    questionType: number;
    updateFlg: number;
}