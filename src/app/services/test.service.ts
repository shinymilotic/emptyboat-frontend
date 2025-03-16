import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CreateTestRequest } from "../models/test/test.model";
import { TestResponse } from "../models/test/test-response.model";
import { SimpleTestResponse } from "src/app/components/test/test-list/simple-test-response.model";
import { TestResponseUpd } from "src/app/components/test/update-test/test-response-update";

@Injectable({ providedIn: "root" })
export class TestService {
  constructor(private readonly http: HttpClient) {}

  get(): Observable<SimpleTestResponse[]> {
    return this.http
      .get<SimpleTestResponse[]>("/tests");
  }

  getOne(id: string): Observable<TestResponse> {
    return this.http
      .get<TestResponse>(`/tests/${id}`);
  }

  create(test: Partial<CreateTestRequest>): Observable<void> {
    return this.http.post<void>("/tests", test);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`/tests/${id}`);
  }

  update(testId: string, testUpd: TestResponseUpd): Observable<void> {
    return this.http
      .put<void>(`/tests/${testId}`, testUpd);
  }

  getProfileCreateTests(username: string) : Observable<SimpleTestResponse[]> {
    return this.http.get<SimpleTestResponse[]>(`/tests/${username}/profile`);
  }
}
