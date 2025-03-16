import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ArticleList } from "../components/management/article/article-list.model";

@Injectable({ providedIn: "root" })
export class AdminRoleService {

  constructor(private readonly http: HttpClient) {}


}
