import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { TestList } from "../components/management/test/test-list.model";

@Injectable({ providedIn: "root" })
export class AdminTestService {
  
  constructor(private readonly http: HttpClient) {}

  getTests(pageNumber?: number, itemsPerPage?: number): Observable<TestList> {
    let params = new HttpParams();
    
    if (pageNumber != null && itemsPerPage != null) {
      params = params.set('pageNumber', pageNumber);
      params = params.set('itemsPerPage', itemsPerPage);  
    }

    return this.http.get<TestList>(`/admin/tests`, { params });
  }

  deleteTest(testId: string): Observable<void> {
    return this.http.delete<void>(`/admin/tests/${testId}`);
  }
}
