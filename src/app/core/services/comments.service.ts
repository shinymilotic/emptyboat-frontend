import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Comment } from "../models/blog/comment.model";
import { RestResponse } from "../models/restresponse.model";

@Injectable({ providedIn: "root" })
export class CommentsService {
  constructor(private readonly http: HttpClient) {}

  getAll(id: string): Observable<RestResponse<Comment[]>> {
    return this.http
      .get<RestResponse<Comment[]>>(`/articles/${id}/comments`);
  }

  add(id: string, payload: string): Observable<RestResponse<Comment>> {
    return this.http
      .post<RestResponse<Comment>>(`/articles/${id}/comments`, { body: payload });
  }

  delete(commentId: string, articleId: string): Observable<RestResponse<void>> {
    return this.http.delete<RestResponse<void>>(`/articles/${articleId}/comments/${commentId}`);
  }
}
