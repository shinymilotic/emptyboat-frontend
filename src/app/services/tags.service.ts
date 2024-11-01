import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { RestResponse } from "../models/restresponse.model";
import { Tag } from "../models/blog/tag.model";
import { TagFollowing } from "../components/tags/tag-following.model";

@Injectable({ providedIn: "root" })
export class TagService {
  constructor(private readonly http: HttpClient) {}

  getAll(following: boolean): Observable<RestResponse<Tag[]>> {
    return this.http
      .get<RestResponse<Tag[]>>("/tags", { params: { following } });
  }

  followTag(tag: string): Observable<RestResponse<void>> {
    return this.http
      .post<RestResponse<void>>(`/tag/${tag}/follow`, {});
  }
}
