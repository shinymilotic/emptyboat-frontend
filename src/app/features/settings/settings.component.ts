import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router } from "@angular/router";
import { User } from "../../core/models/auth/user.model";
import { UserService } from "../../core/services/user.service";
import { ListErrorsComponent } from "../../shared/list-errors/list-errors.component";
import { SettingsForm } from "./SettingsForm";
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule} from 'primeng/floatlabel';
import { ApiError } from "src/app/core/models/apierrors.model";

@Component({
    selector: "app-settings-page",
    templateUrl: "./settings.component.html",
    styleUrls: ["./settings.component.css"],
    standalone: true,
    imports: [ListErrorsComponent, ReactiveFormsModule, InputTextModule, FloatLabelModule]
})
export class SettingsComponent implements OnInit {
  user!: User;
  settingsForm: FormGroup<SettingsForm>;
  errors!: ApiError;
  isSubmitting = false;

  constructor(
    private readonly router: Router,
    private readonly userService: UserService
  ) {
    this.settingsForm = new FormGroup<SettingsForm>({
      image: new FormControl("", { nonNullable: true }),
      username: new FormControl("", { nonNullable: true }),
      bio: new FormControl("", { nonNullable: true }),
    });
  }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(({data}) => {
      this.settingsForm.patchValue(data);
    });
  }

  submitForm() {
    this.isSubmitting = true;

    this.userService
      .update(this.settingsForm.value)
      .subscribe({
        next: ({data}) => void this.router.navigate(["/@".concat(data.username)]),
        error: (err) => {
          this.errors = err;
          this.isSubmitting = false;
        },
      });
  }
}
