import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Comment } from "../models/blog/comment.model";

@Injectable({ providedIn: "root" })
export class CommentsService {
  constructor(private readonly http: HttpClient) {}

  getAll(id: string): Observable<Comment[]> {
    return this.http
      .get<Comment[]>(`/articles/comments/${id}`);
  }

  add(id: string, payload: string): Observable<Comment> {
    return this.http
      .post<Comment>(`/articles/comments/${id}`, { body: payload });
  }

  delete(commentId: string, articleId: string): Observable<void> {
    return this.http.delete<void>(`/comments/${commentId}`);
  }
}
