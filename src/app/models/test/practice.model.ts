import { ChoiceAnswer } from "./choiceanswer.model";
import { OpenAnswer } from "./openanswer.model";

export interface Practice {
  id: string;
  choiceAnswers: ChoiceAnswer[];
  openAnswers: OpenAnswer[];
}
