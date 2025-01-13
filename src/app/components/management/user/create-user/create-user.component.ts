import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, RequiredValidator, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { UserManageService } from '../user-manage.serivce';
import { CreateUserRequest } from './create-user-request.model';
import { NgIf } from '@angular/common';

export interface CreateUserForm {
  username: FormControl<string|null>;
  password: FormControl<string|null>;
  email: FormControl<string|null>;
  bio: FormControl<string>;
  image: FormControl<string>;
  enabled: FormControl<boolean>;
}

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [InputTextModule, DropdownModule, RadioButtonModule, FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements OnInit{
  createUserForm!: FormGroup<CreateUserForm>;
  isDisplayError: boolean = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly manageUserService: UserManageService
  ) { }
  
  ngOnInit(): void {
    this.createUserForm = this.fb.group({
      username: this.fb.control('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(32),
          ]),
      password: this.fb.control('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64),
      ]),
      email: this.fb.control('', [
        Validators.required,
        Validators.email
      ]),
      bio: this.fb.control('', { nonNullable: true }),
      image: this.fb.control('', { nonNullable: true }),
      enabled: this.fb.control(false, { nonNullable: true })
    });
  }

  createUser() {
    if (this.createUserForm.invalid === true) {
      this.isDisplayError = true;
      return;
    }

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
      error: () => {

      }
    });
  }

  get username() {
    return this.createUserForm.get('username');
  }

  // username: FormControl<string|null>;
  // password: FormControl<string|null>;
  // email: FormControl<string|null>;
  // bio: FormControl<string>;
  // image: FormControl<string>;
  // enabled: FormControl<boolean>;

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
