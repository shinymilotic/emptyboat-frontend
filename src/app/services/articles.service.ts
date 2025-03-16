import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ArticleListConfig } from "../models/blog/article-list-config.model";
import { Article } from "../models/blog/article.model";
import { SubmitArticle } from "../components/editor/submit-article.model";
import { ArticleList } from "../models/blog/article-list.model";

@Injectable({ providedIn: "root" })
export class ArticlesService {

  constructor(private readonly http: HttpClient) {}

  query(
    config: ArticleListConfig
  ): Observable<ArticleList> {
    let params = new HttpParams();

    Object.keys(config.filters).forEach((key) => {
      // @ts-ignore
      params = params.set(key, config.filters[key]);
    });

    return this.http.get<ArticleList>(
      "/articles",
      { params }
    );
  }

  get(id: string): Observable<Article> {
    return this.http
      .get<Article>(`/articles/${id}`);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`/articles/${id}`);
  }

  create(article: Partial<SubmitArticle>): Observable<string> {
    return this.http
      .post<string>("/articles", article);
  }

  update(article: Partial<SubmitArticle>, id: string): Observable<string> {
    return this.http
      .put<string>(`/articles/${id}`, article);
  }

  favorite(id: string): Observable<void> {
    return this.http
      .post<void>(`/articles/${id}/favorite`, {});
  }

  unfavorite(id: string): Observable<void> {
    return this.http.delete<void>(`/articles/${id}/unfavorite`);
  }
}
