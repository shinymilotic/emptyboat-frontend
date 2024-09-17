import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Practice } from "../models/test/practice.model";
import { UserPractice } from "../models/test/user-practices.model";
import { PracticeResult } from "src/app/components/profile/practice-result/PracticeResult";
import { RestResponse } from "../models/restresponse.model";
import { CreatePracticeResponse } from "src/app/components/test/practice-test/create-practice-res.model";

@Injectable({ providedIn: "root" })
export class PracticeService {
  constructor(private readonly http: HttpClient) {}

  createPractice(practice: Practice): Observable<RestResponse<CreatePracticeResponse>> {
    return this.http
      .post<RestResponse<CreatePracticeResponse>>(`/practice`, practice);
  }

  getPractices(username: string): Observable<RestResponse<UserPractice[]>> {
    return this.http
      .get<RestResponse<UserPractice[]>>(`/practices/${username}`);
  }

  getPractice(id: string): Observable<RestResponse<PracticeResult>> {
    return this.http
      .get<RestResponse<PracticeResult>>(`/practice/${id}`);
  }
}
