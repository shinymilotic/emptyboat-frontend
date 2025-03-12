import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Tag } from "../models/blog/tag.model";
import { TagManage } from "../components/management/tag/tag-manage.model";

@Injectable({ providedIn: "root" })
export class TagService {
  
  constructor(private readonly http: HttpClient) {}

  getTagAdmin(pageNumber?: number, itemsPerPage?: number) : Observable<TagManage[]> {
      let params = new HttpParams();
  
      if (pageNumber != null && itemsPerPage != null) {
        params = params.set('pageNumber', pageNumber);
        params = params.set('itemsPerPage', itemsPerPage);  
      }
      
      return this.http
        .get<TagManage[]>(`/admin/tags`, { params });
  }

  getTagCount() : Observable<number> {
    return this.http.get<number>(`/tagCount`);
  }

  deleteTag(tagId: string) : Observable<void> {
    let params = new HttpParams();

    if (tagId != null) {
      params = params.set('tagId', tagId);
    }

    return this.http.delete<void>(`/tag`, { params });
  }

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
