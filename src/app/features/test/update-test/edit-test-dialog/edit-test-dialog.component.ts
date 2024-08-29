import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ListErrorsComponent } from 'src/app/shared/list-errors.component';
import { QuestionUpd } from '../question-update';

@Component({
  selector: 'app-edit-test-dialog',
  standalone: true,
  imports: [ListErrorsComponent, DialogModule, ButtonModule, InputTextModule],
  templateUrl: './edit-test-dialog.component.html',
  styleUrl: './edit-test-dialog.component.css'
})
export class EditTestDialogComponent {
  @Input() question!: QuestionUpd
  @Input() visible: boolean = false;

  showDiablog(qIndex: number) {
    // this.questionForm = this.testUpd.questions[qIndex].question.question;
    this.visible = true;
  }

  saveQuestion() {
    this.visible = false;
  }

  closeDiablog() {
    // this.questionForm = '';
    this.visible = false;
  }
}
