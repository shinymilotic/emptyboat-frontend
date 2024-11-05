import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from './services/user.service';

@Injectable()
export class AuthGuard {
    constructor(private readonly router: Router,
                private readonly userService: UserService
    ) { }

    canActivate() : boolean {
        const isAuthenticated = this.userService.userSignal() ? true : false;
        if (isAuthenticated) {
            return true;
        }

        this.router.navigate(['login']);
        return false;
    }
}