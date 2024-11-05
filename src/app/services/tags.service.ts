import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { RestResponse } from "../models/restresponse.model";
import { Tag } from "../models/blog/tag.model";

@Injectable({ providedIn: "root" })
export class TagService {
  
  constructor(private readonly http: HttpClient) {}

  getAll(following: boolean): Observable<RestResponse<Tag[]>> {
    return this.http
      .get<RestResponse<Tag[]>>("/tags", { params: { following } });
  }

  getFollowingTags() : Observable<RestResponse<Tag[]>> {
    return this.http
      .get<RestResponse<Tag[]>>("/followingTags");
  }

  followTag(tagId: string): Observable<RestResponse<void>> {
    return this.http
      .post<RestResponse<void>>(`/tag/${tagId}/follow`, {});
  }

  unfollowTag(tagId: string) : Observable<RestResponse<void>> {
    return this.http
      .post<RestResponse<void>>(`/tag/${tagId}/unfollow`, {});
  }
}
