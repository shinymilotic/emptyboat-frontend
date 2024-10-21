import { Component, Input, OnInit } from "@angular/core";
import { PracticeService } from "src/app/services/practice.service";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { PracticeResult } from "./PracticeResult";
import { Question } from "./Question";
import { ChoiceResult } from "./ChoiceQuestion";
import { Answer } from "./Answer";
import { ChoiceAnswer } from "./ChoiceAnswer";
import { OpenAnswer } from "./OpenAnswer";
import { OpenAnswerResult } from "./OpenAnswerResult";
import { RestResponse } from "src/app/models/restresponse.model";
import { QuestionType } from "src/app/models/test/QuestionType";

@Component({
    selector: "app-practice-result",
    templateUrl: "./practice-result.component.html",
    styleUrls: ["./practice-result.component.css"],
    standalone: true,
    imports: []
})
export class PracticeResultComponent implements OnInit {
  
  @Input() username!: string;
  @Input() id!: string;
  practiceResult: PracticeResult = {
    testTitle: '',
    questions: []
  };

  constructor(
    private readonly practiceService: PracticeService) {}

  ngOnInit(): void {
    this.practiceService.getPractice(this.id).subscribe((data: RestResponse<PracticeResult>) => {
      this.practiceResult = data.data;
    });
  }

  asChoiceQuestion(question: Question): ChoiceResult {
    return question as ChoiceResult;
  }

  asOpenQuestion(question: Question): OpenAnswerResult {
    return question as OpenAnswerResult;
  }

  paintColor(answer: ChoiceAnswer): string {
    if (answer.choice == true && answer.truth == true) {
      return "success";
    }
    
    if (answer.choice == true && answer.truth == false) {
      return "fail";
    }

    return "";
  }

  public get QuestionType() {
    return QuestionType;
  }
}
