import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router } from "@angular/router";
import { User } from "../../models/auth/user.model";
import { UserService } from "../../services/user.service";
import { ListErrorsComponent } from "../../shared-components/list-errors/list-errors.component";
import { SettingsForm } from "./SettingsForm";
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule} from 'primeng/floatlabel';
import { ApiError } from "src/app/models/apierrors.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ContenteditableValueAccessor } from "src/app/directives/contenteditable.directive";

@Component({
    selector: "app-settings-page",
    templateUrl: "./settings.component.html",
    styleUrls: ["./settings.component.css"],
    standalone: true,
    imports: [ListErrorsComponent, ReactiveFormsModule, InputTextModule, FloatLabelModule, ContenteditableValueAccessor]
})
export class SettingsComponent implements OnInit {
  user!: User;
  settingsForm: FormGroup<SettingsForm>;
  errors!: ApiError;
  isSubmitting = false;
  destroyRef: DestroyRef = inject(DestroyRef);

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
    this.userService.getCurrentUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.settingsForm.patchValue(data);
      });
  }

  submitForm() {
    this.isSubmitting = true;

    this.userService
      .update(this.settingsForm.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => void this.router.navigate(["/@".concat(data.username)]),
        error: (err) => {
          this.errors = err;
          this.isSubmitting = false;
        },
      });
  }
}
