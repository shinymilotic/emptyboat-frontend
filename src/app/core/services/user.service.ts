import { Injectable, signal } from "@angular/core";
import { Observable, BehaviorSubject, pipe } from "rxjs";

import { map, distinctUntilChanged, tap, shareReplay } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { User } from "../models/auth/user.model";
import { AuthCookieUtils } from "../utils/authCookie.utils";

@Injectable({ providedIn: "root" })
export class UserService {

  public userSignal = signal<User | null>(null);

  constructor(
    private readonly http: HttpClient,
    private readonly authCookieUtils: AuthCookieUtils,
  ) {}

  login(credentials: { email: string; password: string }): Observable<User> {
    return this.http
      .post<User>("/users/login", { user: credentials })
      .pipe(tap((user) => {
        this.userSignal.set(user);
        this.authCookieUtils.saveUserIdCookie(user.id);
      }));
  }

  register(credentials: {
    username: string;
    email: string;
    password: string;
  }): Observable<User> {
    return this.http
      .post<User>("/users", { user: credentials });
  }

  logout(): Observable<boolean> {
    return this.http.post<boolean>("/users/logout", {});
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>("/users");
  }

  update(user: Partial<User>): Observable<User> {
    return this.http.put<User>("/users", user).pipe(
      tap((user) => {
        this.userSignal.set(user);
      })
    );
  }

  auth(): Observable<User> {
    return this.http.get<User>("/users").pipe(
      tap({
        next: (user) => {
          this.userSignal.set(user);
          // this.setAuth(accessToken, refreshToken);
        },
        // error: () => this.purgeAuth(),
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
      .post<{userId: string}>("/users/refreshToken", {})
      .pipe(map((data) => data.userId));
      ;
  }

  confirmEmail(token: string) : Observable<boolean> {
    return this.http
      .post<boolean>(`/confirmEmail`, {"confirmToken" : token});
    ;
  }

  getFollowers(userId: string) : Observable<User[]> {
    return this.http
      .get<User[]>(`/followers/${userId}`, {})
      .pipe(map((data: any) => data.followers));
    ;
  }
}
