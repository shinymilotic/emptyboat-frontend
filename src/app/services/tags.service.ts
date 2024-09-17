import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { RestResponse } from "../models/restresponse.model";

@Injectable({ providedIn: "root" })
export class TagsService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<RestResponse<string[]>> {
    return this.http
      .get<RestResponse<string[]>>("/tags");
  }
}
