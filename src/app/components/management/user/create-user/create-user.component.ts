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
  errors!: ApiError;

  constructor(
    private readonly fb: FormBuilder,
    private readonly manageUserService: UserManageService
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

  validateUsername(username?: string): void {

  }

  validatePassword(password?: string): void {

  }

  validateEmail(email?: string): void {
    
  }

  createUser() {
    const form : CreateUserRequest = this.createUserForm.value;

    this.validateUsername(form.username);
    this.validatePassword(form.password);
    this.validateEmail(form.email);

    const request: CreateUserRequest = {
      username: this.createUserForm.value.username,
      password: this.createUserForm.value.password,
      email: this.createUserForm.value.email,
      bio: this.createUserForm.value.bio,
      image: this.createUserForm.value.image,
      enabled: this.createUserForm.value.enabled
    }

    this.manageUserService.adminCreateUser(request).subscribe({
      next: () => {
        
      },
      error: (error) => {
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
