import { Profile } from "../auth/profile.model";
import { Question } from "./question.model";

export interface TestResponse {
  title: string;
  description: string;
  questions: Question[];
  author: Profile,
}
