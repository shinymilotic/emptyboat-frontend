import { ChoiceQuestionUpd } from "./choice-question-update";
import { QuestionUpd } from "./question-update";

export interface TestResponseUpd {
    description: string,
    title: string,
    questions: (QuestionUpd | ChoiceQuestionUpd)[],
}