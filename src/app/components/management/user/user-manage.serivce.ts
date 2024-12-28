import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { RestResponse } from "src/app/models/restresponse.model";
import { User } from "./user.model";

@Injectable({ providedIn: "root" })
export class UserManageService {

  constructor(
    private readonly http: HttpClient,
  ) {}

  getUsers(page?: number, size?: number) : Observable<RestResponse<User[]>> {
    let params = new HttpParams();

    if (page != null && size != null) {
      params = params.set('page', page);
      params = params.set('size', size);  
    }
    return this.http
      .get<RestResponse<User[]>>(`/users`, { params });
  }
}
