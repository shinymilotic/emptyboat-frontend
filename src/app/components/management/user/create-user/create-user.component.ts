import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, RequiredValidator, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { UserManageService } from '../user-manage.serivce';
import { CreateUserRequest } from './create-user-request.model';
import { NgIf } from '@angular/common';
import { ApiError } from 'src/app/models/apierrors.model';
import { ListErrorsComponent } from "../../../../shared-components/list-errors/list-errors.component";
import { Router } from '@angular/router';

export interface CreateUserForm {
  username: FormControl<string>;
  password: FormControl<string>;
  email: FormControl<string>;
  bio: FormControl<string>;
  image: FormControl<string>;
  enabled: FormControl<boolean>;
}

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [InputTextModule, DropdownModule, RadioButtonModule, FormsModule, ReactiveFormsModule, NgIf, ListErrorsComponent],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements OnInit{
  createUserForm!: FormGroup<CreateUserForm>;
  isDisplayError: boolean = false;
  errors: ApiError = {errors: []};

  constructor(
    private readonly fb: FormBuilder,
    private readonly manageUserService: UserManageService,
    private readonly router: Router
  ) { }
  
  ngOnInit(): void {
    this.createUserForm = this.fb.group<CreateUserForm>({
      username: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(32),
      ], ),
      password: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64),
      ]),
      email: this.fb.nonNullable.control('',[
        Validators.required,
        Validators.email
      ],),
      bio: this.fb.nonNullable.control(''),
      image: this.fb.nonNullable.control(''),
      enabled: this.fb.nonNullable.control(false)
    });
  }

  validateUsername(): void {
    if (this.username?.hasError('required')) {
      this.errors.errors.push({
        messageId: '',
        message: 'Username can\'t be blank.'
      });
    }

    if (this.username?.hasError('minlength') || this.username?.hasError('maxlength')) {
      this.errors.errors.push({
        messageId: '',
        message: 'Username must contains from 6 to 32 characters'
      });
    }
  }

  validatePassword(): void {
    if (this.password?.hasError('required')) {
      this.errors.errors.push({
        messageId: '',
        message: 'Password can\'t be blank.'
      });
    }

    if (this.password?.hasError('minlength') || this.password?.hasError('maxlength')) {
      this.errors.errors.push({
        messageId: '',
        message: 'Password must contains from 8 to 64 characters.'
      });
    }
  }

  validateEmail(): void {
    if (this.email?.hasError('required')) {
      this.errors.errors.push({
        messageId: '',
        message: 'Email can\'t be blank.'
      });
    }

    if (this.email?.hasError('email')) {
      this.errors.errors.push({
        messageId: '',
        message: 'Email is not valid.'
      });
    }
  }

  createUser(): void {
    const form : CreateUserRequest = this.createUserForm.value;

    this.validateUsername();
    this.validatePassword();
    this.validateEmail();

    if (this.errors.errors.length != 0) {
      return;
    }

    this.manageUserService.adminCreateUser(form).subscribe({
      next: () => {
        this.router.navigate(["/admin/user"]);
      },
      error: (error: ApiError) => {
        this.errors = error;
      }
    });
  }

  get username() {
    return this.createUserForm.get('username');
  }

  get password() {
    return this.createUserForm.get('password');
  }

  get email() {
    return this.createUserForm.get('email');
  }

  get bio() {
    return this.createUserForm.get('bio');
  }

  get image() {
    return this.createUserForm.get('image');
  }

  get enabled() {
    return this.createUserForm.get('enabled');
  }
}
