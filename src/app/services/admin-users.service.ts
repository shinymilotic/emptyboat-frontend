import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../components/management/user/user.model";
import { CreateUserRequest } from "../components/management/user/create-user/create-user-request.model";
import { UserList } from "../components/management/user/user-list.model";

@Injectable({ providedIn: "root" })
export class AdminUserService {

  constructor(private readonly http: HttpClient) {}

  getUsers(pageNumber?: number, itemsPerPage?: number) : Observable<UserList> {
    let params = new HttpParams();

    if (pageNumber != null && itemsPerPage != null) {
      params = params.set('pageNumber', pageNumber);
      params = params.set('itemsPerPage', itemsPerPage);  
    }
    
    return this.http
      .get<UserList>(`/admin/users`, { params });
  }

  deleteUser(userId: string) : Observable<void> {
    return this.http
      .delete<void>(`/admin/users/${userId}`);
  }

  createUser(user: CreateUserRequest): Observable<void>  {
    return this.http.post<void>(`/admin/users`, user);
  }
}
