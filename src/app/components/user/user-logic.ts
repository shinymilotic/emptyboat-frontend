import { Injectable } from "@angular/core";
import { AbstractControl, FormControl } from "@angular/forms";
import { ApiValidationError } from "src/app/models/apivalidationerror.model";

@Injectable({ providedIn: "root" })
export class UserLogic {

    validateUsername(username: AbstractControl<string> | null): ApiValidationError | null {
        if (username?.hasError('required')) {
            return {
                messageId: '',
                message: 'Username can\'t be blank.'
            };
        }

        if (username?.hasError('minlength') || username?.hasError('maxlength')) {
            return {
                messageId: '',
                message: 'Username must contains from 6 to 32 characters'
            };
        }

        return null;
    }
    
    validatePassword(password: AbstractControl<string> | null): ApiValidationError | null {
        if (password?.hasError('required')) {
            return {
                messageId: '',
                message: 'Password can\'t be blank.'
            };
        }

        if (password?.hasError('minlength') || password?.hasError('maxlength')) {
            return {
                messageId: '',
                message: 'Password must contains from 8 to 64 characters.'
            };
        }

        return null;
    }
    
    validateEmail(email: AbstractControl<string> | null): ApiValidationError | null {
        if (email?.hasError('required')) {
            return {
                messageId: '',
                message: 'Email can\'t be blank.'
            };
        }

        if (email?.hasError('email')) {
            return {
                messageId: '',
                message: 'Email is not valid.'
            };
        }

        return null;
    }
}