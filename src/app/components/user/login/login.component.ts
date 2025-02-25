import { Component, DestroyRef, inject, OnDestroy, OnInit } from "@angular/core";
import {
  Validators,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ListErrorsComponent } from "../../../shared-components/list-errors/list-errors.component";
import { ApiValidationError } from "../../../models/apivalidationerror.model";
import { UserService } from "../../../services/user.service";
import { catchError, takeUntil } from "rxjs/operators";
import { Subject, throwError } from "rxjs";
import { LoginForm } from "./LoginForm";
import { ApiError } from "src/app/models/apierrors.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"],
    standalone: true,
    imports: [RouterLink, ListErrorsComponent, ReactiveFormsModule]
})
export class LoginComponent implements OnInit {
  title = "";
  errors!: ApiError;
  isSubmitting = false;
  authForm: FormGroup<LoginForm>;
  destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService
  ) {
    // use FormBuilder to create a form group
    this.authForm = new FormGroup<LoginForm>({
      email: new FormControl("", {
        validators: [Validators.required],
        nonNullable: true,
      }),
      password: new FormControl("", {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });
  }

  ngOnInit(): void {
    this.title = "Login";
  }

  submitForm(): void {
    this.isSubmitting = true;

    let observable = this.userService.login(
      this.authForm.value as { email: string; password: string }
    );

    observable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => void this.router.navigate(["/"]),
      error: (errors: ApiError) => {
        console.log(errors);
        this.errors = errors;
        this.isSubmitting = false;
      },
    });
  }
}
