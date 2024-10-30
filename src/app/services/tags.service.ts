import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { RestResponse } from "../models/restresponse.model";
import { Tag } from "../models/blog/tag.model";

@Injectable({ providedIn: "root" })
export class TagsService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<RestResponse<Tag[]>> {
    return this.http
      .get<RestResponse<Tag[]>>("/tags");
  }

  followTag(tag: string): Observable<RestResponse<void>> {
    return this.http
      .post<RestResponse<void>>(`/tags/${tag}/follow`, {});
  }
}
