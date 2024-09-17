import { Question } from "./question.model";

export interface CreateTestRequest {
  title: string;
  description: string;
  questions: Question[];
}
