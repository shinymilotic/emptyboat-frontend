import { Injectable, signal, WritableSignal } from "@angular/core";
import { Observable } from "rxjs";
import { shareReplay } from "rxjs/operators";
import { Profile } from "../models/auth/profile.model";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class ProfileService {
  public profile: WritableSignal<Profile | undefined> = signal(undefined);
  constructor(private readonly http: HttpClient) {}

  get(username: string): Observable<Profile> {
    return this.http.get<Profile>(`/profiles/${username}`).pipe(
      shareReplay(1)
    );
  }

  follow(username: string): Observable<void> {
    return this.http
      .post<void>(`/profiles/${username}/follow`, {});
  }

  unfollow(username: string): Observable<void> {
    return this.http
      .delete<void>(`/profiles/${username}/follow`);
  }
}
