import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Practice } from "../models/test/practice.model";
import { UserPractice } from "../models/test/user-practices.model";
import { PracticeResult } from "src/app/components/profile/practice-result/PracticeResult";
import { CreatePracticeResponse } from "src/app/components/test/practice-test/create-practice-res.model";

@Injectable({ providedIn: "root" })
export class PracticeService {
  constructor(private readonly http: HttpClient) {}

  createPractice(practice: Practice): Observable<CreatePracticeResponse> {
    return this.http
      .post<CreatePracticeResponse>(`/practices`, practice);
  }

  getPractices(username: string): Observable<UserPractice[]> {
    return this.http
      .get<UserPractice[]>(`/practices/${username}`);
  }

  getPractice(id: string): Observable<PracticeResult> {
    return this.http
      .get<PracticeResult>(`/practices/${id}`);
  }
}
