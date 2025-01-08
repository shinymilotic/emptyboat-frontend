import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, RequiredValidator, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { UserManageService } from '../user-manage.serivce';
import { CreateUserRequest } from './create-user-request.model';

export interface CreateUserForm {
  username: FormControl<string>;
  password: FormControl<string>;
  bio: FormControl<string>;
  image: FormControl<string>;
  enabled: FormControl<boolean>;
}

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [InputTextModule, DropdownModule, RadioButtonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements OnInit{
  createUserForm!: FormGroup<CreateUserForm>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly manageUserService: UserManageService
  ) { }
  
  ngOnInit(): void {
    this.createUserForm = this.fb.group({
      username: this.fb.control('', { nonNullable: true }),
      password: this.fb.control('', { nonNullable: true }),
      bio: this.fb.control('', { nonNullable: true }),
      image: this.fb.control('', { nonNullable: true }),
      enabled: this.fb.control(false, { nonNullable: true })
    });
  }

  createUser() {
    const request: CreateUserRequest = {
      username: this.createUserForm.value.username,
      password: this.createUserForm.value.password,
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
}
