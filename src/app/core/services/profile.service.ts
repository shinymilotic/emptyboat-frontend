import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { shareReplay } from "rxjs/operators";
import { Profile } from "../models/auth/profile.model";
import { HttpClient } from "@angular/common/http";
import { RestResponse } from "../models/restresponse.model";

@Injectable({ providedIn: "root" })
export class ProfileService {
  constructor(private readonly http: HttpClient) {}

  get(username: string): Observable<RestResponse<Profile>> {
    return this.http.get<RestResponse<Profile>>("/profiles/" + username).pipe(
      shareReplay(1)
    );
  }

  follow(username: string): Observable<RestResponse<void>> {
    return this.http
      .post<RestResponse<void>>("/profiles/" + username + "/follow", {});
  }

  unfollow(username: string): Observable<RestResponse<void>> {
    return this.http
      .delete<RestResponse<void>>("/profiles/" + username + "/follow");
  }
}
