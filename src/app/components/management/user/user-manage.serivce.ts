import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { User } from "./user.model";
import { CreateUserRequest } from "./create-user/create-user-request.model";

@Injectable({ providedIn: "root" })
export class UserManageService {

  constructor(
    private readonly http: HttpClient,
  ) {}

  getUsers(pageNumber?: number, itemsPerPage?: number) : Observable<User[]> {
    let params = new HttpParams();

    if (pageNumber != null && itemsPerPage != null) {
      params = params.set('pageNumber', pageNumber + 1);
      params = params.set('itemsPerPage', itemsPerPage);  
    }
    
    return this.http
      .get<User[]>(`/users`, { params });
  }

  getUsersCount() : Observable<number> {
    return this.http
      .get<number>(`/usersCount`);
  }

  deleteUser(userId: string) : Observable<void> {
    return this.http
      .delete<void>(`/users/${userId}`);
  }

  adminCreateUser(user: CreateUserRequest): Observable<void>  {
    return this.http.post<void>(`/admin/users`, user);
  }
}
