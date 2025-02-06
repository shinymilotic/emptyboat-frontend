import { Injectable, signal } from "@angular/core";
import { Observable } from "rxjs";
import { tap, shareReplay } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { User } from "../models/auth/user.model";
import { AuthCookieUtils } from "../utils/authCookie.utils";
import { ApiError } from "../models/apierrors.model";

@Injectable({ providedIn: "root" })
export class UserService {
  public userSignal = signal<User | null>(null);

  constructor(
    private readonly http: HttpClient,
    private readonly authCookieUtils: AuthCookieUtils,
  ) {}

  login(credentials: { email: string; password: string }): Observable<User> {
    return this.http
      .post<User>("/users/login", credentials )
      .pipe(tap((data) => {
        this.userSignal.set(data);
        this.authCookieUtils.saveUserIdCookie(data.id);
      }));
  }

  register(credentials: {
    username: string;
    email: string;
    password: string;
  }): Observable<void> {
    return this.http
      .post<void>("/users", credentials);
  }

  logout(): Observable<void> {
    return this.http.post<void>("/users/logout", {});
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>("/users/current");
  }

  update(user: Partial<User>): Observable<User> {
    return this.http.put<User>("/users/current", user).pipe(
      tap((user) => {
        this.userSignal.set(user);
      })
    );
  }

  auth(): Observable<User> {
    console.log("auth");
    return this.http.get<User>("/users/current").pipe(
      tap({
        next: (data) => {
          this.userSignal.set(data);
        },
        error: (errors: ApiError) => this.purgeAuth(),
      }),
      shareReplay(1)
    );
  }

  purgeAuth(): void {
    this.authCookieUtils.destroyUserIdCookie();
    this.userSignal.set(null);
  }

  refreshToken(): Observable<string> {
    return this.http
      .post<string>("/users/refreshToken", {});
      ;
  }

  confirmEmail(token: string) : Observable<void> {
    return this.http
      .post<void>(`/confirmEmail`, {"confirmToken" : token});
    ;
  }

  getFollowers(userId: string) : Observable<User[]> {
    return this.http
      .get<User[]>(`/followers/${userId}`, {});
  }
}
