import { Question } from "./Question";

export interface OpenAnswerResult extends Question {
    answer: string;
}