import { NgFor, NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { catchError, throwError } from 'rxjs';
import { ContenteditableValueAccessor } from 'src/app/directives/contenteditable.directive';
import { ApiError } from 'src/app/models/apierrors.model';
import { ChoiceQuestion } from 'src/app/models/test/choicequestion.model';
import { Question } from 'src/app/models/test/question.model';
import { QuestionType } from 'src/app/models/test/QuestionType';
import { UpdateFlg } from 'src/app/models/update-flg.enum';
import { TestService } from 'src/app/services/test.service';
import { ListErrorsComponent } from 'src/app/shared-components/list-errors/list-errors.component';
import { ChoiceAnswerUpd } from '../choice-answer-update';
import { ChoiceQuestionUpd } from '../choice-question-update';
import { QuestionUpd } from '../question-update';
import { TestResponseUpd } from '../test-response-update';

@Component({
  selector: 'app-add-question-dialog',
  standalone: true,
  imports: [ListErrorsComponent, DialogModule, ButtonModule, InputTextModule, 
    ReactiveFormsModule, FormsModule, NgFor, NgForOf, ContenteditableValueAccessor],
  templateUrl: './add-question-dialog.component.html',
  styleUrl: './add-question-dialog.component.css'
})
export class AddQuestionDialogComponent implements OnInit {


  constructor(
    private readonly route: ActivatedRoute,
    private readonly testService: TestService,
    private readonly router: Router,
    private readonly fb: FormBuilder
  ) { }

  ngOnInit(): void {
    
  }

}
