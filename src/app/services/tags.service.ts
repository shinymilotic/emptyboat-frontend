import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Tag } from "../models/blog/tag.model";

@Injectable({ providedIn: "root" })
export class TagService {
  
  constructor(private readonly http: HttpClient) {}

  getAll(following: boolean): Observable<Tag[]> {
    return this.http
      .get<Tag[]>("/tags", { params: { following } });
  }

  getFollowingTags() : Observable<Tag[]> {
    return this.http
      .get<Tag[]>("/followingTags");
  }

  followTag(tagId: string): Observable<void> {
    return this.http
      .post<void>(`/tag/${tagId}/follow`, {});
  }

  unfollowTag(tagId: string) : Observable<void> {
    return this.http
      .post<void>(`/tag/${tagId}/unfollow`, {});
  }
}
