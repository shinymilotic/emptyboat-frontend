import { ChoiceAnswer } from "./choiceanswer.model";
import { EssayAnswer } from "./essayanswer.model";

export interface Practice {
  id: string;
  choiceAnswers: ChoiceAnswer[];
  essayAnswers: EssayAnswer[];
}
