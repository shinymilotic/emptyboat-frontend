import { Injectable, signal } from "@angular/core";
import { Observable } from "rxjs";
import { tap, shareReplay } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { User } from "../models/auth/user.model";
import { AuthCookieUtils } from "../utils/authCookie.utils";
import { RestResponse } from "../models/restresponse.model";

@Injectable({ providedIn: "root" })
export class UserService {

  public userSignal = signal<User | null>(null);

  constructor(
    private readonly http: HttpClient,
    private readonly authCookieUtils: AuthCookieUtils,
  ) {}

  login(credentials: { email: string; password: string }): Observable<RestResponse<User>> {
    return this.http
      .post<RestResponse<User>>("/users/login", credentials )
      .pipe(tap(({data}) => {
        this.userSignal.set(data);
        this.authCookieUtils.saveUserIdCookie(data.id);
      }));
  }

  register(credentials: {
    username: string;
    email: string;
    password: string;
  }): Observable<RestResponse<void>> {
    return this.http
      .post<RestResponse<void>>("/users", credentials);
  }

  logout(): Observable<RestResponse<void>> {
    return this.http.post<RestResponse<void>>("/users/logout", {});
  }

  getCurrentUser(): Observable<RestResponse<User>> {
    return this.http.get<RestResponse<User>>("/users");
  }

  update(user: Partial<User>): Observable<RestResponse<User>> {
    return this.http.put<RestResponse<User>>("/users", user).pipe(
      tap((user) => {
        this.userSignal.set(user.data);
      })
    );
  }

  auth(): Observable<RestResponse<User>> {
    console.log("auth");
    return this.http.get<RestResponse<User>>("/users").pipe(
      tap({
        next: ({data}) => {
          this.userSignal.set(data);
        },
        error: (errors) => this.purgeAuth(),
      }),
      shareReplay(1)
    );
  }

  purgeAuth(): void {
    this.authCookieUtils.destroyUserIdCookie();
    this.userSignal.set(null);
  }

  refreshToken(): Observable<RestResponse<string>> {
    return this.http
      .post<RestResponse<string>>("/users/refreshToken", {});
      ;
  }

  confirmEmail(token: string) : Observable<RestResponse<void>> {
    return this.http
      .post<RestResponse<void>>(`/confirmEmail`, {"confirmToken" : token});
    ;
  }

  getFollowers(userId: string) : Observable<RestResponse<User[]>> {
    return this.http
      .get<RestResponse<User[]>>(`/followers/${userId}`, {});
    ;
  }
}
