import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CreateTestRequest } from "../models/test/test.model";
import { TestResponse } from "../models/test/test-response.model";
import { RestResponse } from "../models/restresponse.model";
import { SimpleTestResponse } from "src/app/components/test/test-list/simple-test-response.model";
import { TestResponseUpd } from "src/app/components/test/update-test/test-response-update";

@Injectable({ providedIn: "root" })
export class TestService {
  constructor(private readonly http: HttpClient) {}

  // get(slug: string): Observable<Test> {
  //   return this.http
  //     .get<{ article: Article }>(`/articles/${slug}`)
  //     .pipe(map((data) => data.article));
  // }

  // delete(slug: string): Observable<void> {
  //   // return this.http.delete<void>(`/articles/${slug}`);
  // }

  get(): Observable<RestResponse<SimpleTestResponse[]>> {
    return this.http
      .get<RestResponse<SimpleTestResponse[]>>("/tests");
  }

  getOne(id: string): Observable<RestResponse<TestResponse>> {
    return this.http
      .get<RestResponse<TestResponse>>(`/tests/${id}`);
  }

  create(test: Partial<CreateTestRequest>): Observable<RestResponse<void>> {
    return this.http.post<RestResponse<void>>("/test", test);
  }

  delete(id: string): Observable<RestResponse<void>> {
    return this.http.delete<RestResponse<void>>(`/tests/${id}`);
  }

  update(testId: string, testUpd: TestResponseUpd): Observable<RestResponse<void>> {
    return this.http
      .put<RestResponse<void>>(`/test/${testId}/update`, testUpd);
  }
}
