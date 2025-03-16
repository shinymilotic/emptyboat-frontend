import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { TagManage } from "../components/management/tag/tag-manage.model";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class AdminTagService {

    constructor(private readonly http: HttpClient) {}

    public getTagManage(pageNumber?: number, itemsPerPage?: number) : Observable<TagManage[]> {
        let params = new HttpParams();

        if (pageNumber != null && itemsPerPage != null) {
        params = params.set('pageNumber', pageNumber);
        params = params.set('itemsPerPage', itemsPerPage);  
        }
        
        return this.http
        .get<TagManage[]>(`/admin/tags`, { params });
    }

    public deleteTag(tagId: string) : Observable<void> {
        let params = new HttpParams();

        if (tagId != null) {
        params = params.set('tagId', tagId);
        }

        return this.http.delete<void>(`/admin/tags`, { params });
    }

    public createTag(tag: any) : Observable<void> {
        return this.http.post<void>(`/admin/tags`, tag);
    }
}
