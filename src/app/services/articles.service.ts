import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ArticleListConfig } from "../models/blog/article-list-config.model";
import { Article } from "../models/blog/article.model";
import { RestResponse } from "../models/restresponse.model";
import { ArticleList } from "../models/blog/article-list.model";
import { SubmitArticle } from "../components/editor/submit-article.model";

@Injectable({ providedIn: "root" })
export class ArticlesService {
  constructor(private readonly http: HttpClient) {}

  query(
    config: ArticleListConfig
  ): Observable<RestResponse<ArticleList>> {
    let params = new HttpParams();

    Object.keys(config.filters).forEach((key) => {
      // @ts-ignore
      params = params.set(key, config.filters[key]);
    });

    return this.http.get<RestResponse<ArticleList>>(
      "/articles",
      { params }
    );
  }

  get(id: string): Observable<RestResponse<Article>> {
    return this.http
      .get<RestResponse<Article>>(`/articles/${id}`);
      }

  delete(id: string): Observable<RestResponse<void>> {
    return this.http.delete<RestResponse<void>>(`/articles/${id}`);
  }

  create(article: Partial<SubmitArticle>): Observable<RestResponse<string>> {
    return this.http
      .post<RestResponse<string>>("/articles", article);
  }

  update(article: Partial<SubmitArticle>, id: string): Observable<RestResponse<string>> {
    return this.http
      .put<RestResponse<string>>(`/articles/${id}`, article);
  }

  favorite(id: string): Observable<RestResponse<void>> {
    return this.http
      .post<RestResponse<void>>(`/articles/${id}/favorite`, {});
  }

  unfavorite(id: string): Observable<RestResponse<void>> {
    return this.http.delete<RestResponse<void>>(`/articles/${id}/favorite`);
  }
}
