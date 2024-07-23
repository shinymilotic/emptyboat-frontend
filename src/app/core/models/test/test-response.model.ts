import { User } from "../auth/user.model";
import { Question } from "./question.model";

export interface TestResponse {
  title: string;
  description: string;
  questions: Question[];
  author: User,
}
