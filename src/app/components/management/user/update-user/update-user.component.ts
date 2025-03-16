import { Component, DestroyRef, ElementRef, inject, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ContenteditableValueAccessor } from 'src/app/directives/contenteditable.directive';
import { ApiError } from 'src/app/models/apierrors.model';
import { ListErrorsComponent } from 'src/app/shared-components/list-errors/list-errors.component';
import { CreateUserRequest } from '../create-user/create-user-request.model';
import { CreateUserForm } from '../create-user/create-user.component';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-update-user',
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
      ImageModule],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent {
isDisable: boolean = true;
  updateUserForm!: FormGroup<CreateUserForm>;
  isDisplayError: boolean = false;
  errors: ApiError = {errors: []};
  destroyRef: DestroyRef = inject(DestroyRef);
  @ViewChild('inputImage') inputImage!: ElementRef;
  @ViewChild('resetImageBtn') resetImageBtn!: ElementRef;
  @ViewChild('imagePreview') imagePreview!: ElementRef;
  defaultImg: string = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly router: Router
  ) { }
  
  ngOnInit(): void {
    this.updateUserForm = this.fb.group<CreateUserForm>({
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
    const form : CreateUserRequest = this.updateUserForm.value;

    this.errors = {errors: []};

    this.validateUsername();
    this.validatePassword();
    this.validateEmail();

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
    return this.updateUserForm.get('username');
  }

  get password() {
    return this.updateUserForm.get('password');
  }

  get email() {
    return this.updateUserForm.get('email');
  }

  get bio() {
    return this.updateUserForm.get('bio');
  }

  get image() {
    return this.updateUserForm.get('image');
  }

  get enabled() {
    return this.updateUserForm.get('enabled');
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
        this.updateUserForm.get('image')?.setValue(btoa(binary));
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
