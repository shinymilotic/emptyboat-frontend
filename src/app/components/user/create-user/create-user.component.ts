import { Component, DestroyRef, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CreateUserRequest } from './create-user-request.model';
import { ApiError } from 'src/app/models/apierrors.model';
import { Router } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload';
import { ContenteditableValueAccessor } from 'src/app/directives/contenteditable.directive';
import { ImageModule } from 'primeng/image';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserLogic } from '../user-logic';
import { ApiValidationError } from 'src/app/models/apivalidationerror.model';
import { AdminUserService } from 'src/app/services/admin-users.service';
import { ListErrorsComponent } from 'src/app/shared-components/list-errors/list-errors.component';

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
  imports: [
    InputTextModule, 
    DropdownModule, 
    RadioButtonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    ListErrorsComponent, 
    FileUploadModule,
    ContenteditableValueAccessor,
    ImageModule
    ],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements OnInit{
  isDisable: boolean = true;
  createUserForm!: FormGroup<CreateUserForm>;
  isDisplayError: boolean = false;
  errors: ApiError = {errors: []};
  destroyRef: DestroyRef = inject(DestroyRef);
  @ViewChild('inputImage') inputImage!: ElementRef;
  @ViewChild('resetImageBtn') resetImageBtn!: ElementRef;
  @ViewChild('imagePreview') imagePreview!: ElementRef;
  defaultImg: string = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: AdminUserService,
    private readonly router: Router,
    private readonly userLogic: UserLogic
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

  createUser(): void {
    const form : CreateUserRequest = this.createUserForm.value;

    this.errors = {errors: []};

    const usernameValidation: ApiValidationError | null = this.userLogic.validateUsername(this.username);
    const passwordValidation: ApiValidationError | null = this.userLogic.validatePassword(this.password);
    const emailValidation: ApiValidationError | null = this.userLogic.validateEmail(this.email);

    if (usernameValidation != null) {
      this.errors.errors.push(usernameValidation);
    }

    if (passwordValidation != null) {
      this.errors.errors.push(passwordValidation);
    }

    if (emailValidation != null) {
      this.errors.errors.push(emailValidation);
    }

    if (this.errors.errors.length != 0) {
      return;
    }

    this.userService.createUser(form)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
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

  onSelectImage(event: Event) {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    
    if (target != null && target.files != null) {
      target.files[0].arrayBuffer().then((data: ArrayBuffer) => {
        let binary = '';
        let bytes = new Uint8Array(data);
        let len = bytes.byteLength;
  
        for (var i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        
        this.createUserForm.get('image')?.setValue(btoa(binary));
        this.resetImageBtn.nativeElement.style.display = 'block';
        this.imagePreview.nativeElement.src= 'data:image/png;base64,'+ btoa(binary);
      });
    }
  }

  resetImage() {
    this.inputImage.nativeElement.value = '';
    this.resetImageBtn.nativeElement.style.display = 'none';
    this.imagePreview.nativeElement.src = this.defaultImg;
  }
}
