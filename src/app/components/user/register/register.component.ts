import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import {
  Validators,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
} from "@angular/forms";
import { RouterLink } from "@angular/router";
import { ListErrorsComponent } from "../../../shared-components/list-errors/list-errors.component";
import { UserService } from "../../../services/user.service";
import { ApiError } from "src/app/models/apierrors.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
interface RegisterFrom {
  email: FormControl<string>;
  password: FormControl<string>;
  username?: FormControl<string>;
}
@Component({
    selector: "app-register",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.css"],
    standalone: true,
    imports: [RouterLink, ListErrorsComponent, ReactiveFormsModule]
})
export class RegisterComponent implements OnInit {
  title = "";
  errors!: ApiError;
  isSubmitting = false;
  authForm: FormGroup<RegisterFrom>;
  isRegisterSuccess: boolean = false;
  destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private readonly userService: UserService
  ) {
    // use FormBuilder to create a form group
    this.authForm = new FormGroup<RegisterFrom>({
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
    this.title = "Register";
    this.authForm.addControl(
      "username",
      new FormControl("", {
        validators: [Validators.required],
        nonNullable: true,
      })
    );
  }

  submitForm(): void {
    this.isSubmitting = true;

    let observable = this.userService.register(
      this.authForm.value as {
        email: string;
        password: string;
        username: string;
      }
    );

    observable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.isRegisterSuccess = true,
      error: (error: ApiError) => {
        this.errors = error;
        this.isSubmitting = false;
      },
    });
  }
}
