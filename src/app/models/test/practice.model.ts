import { QuestionPractice } from "./questionpractice.model";

export interface Practice {
  testId: string;
  practices: QuestionPractice[];
}
