import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";
import { CategoryModel } from './category.model';

@Injectable()
export class CategoriesService {

    constructor(private http: Http) { }

    public getCategories(): Observable<any> {
        return this.http.get('http://localhost:50810/api/categories').map(this.extractRequests).catch(this.handleError);
    }

    public getCategoryById(id: number): Observable<any> {
        return this.http.get('http://localhost:50810/api/categories/GetById/'+id).map(this.extractRequests).catch(this.handleError);
    }

    public updateCategory(category: CategoryModel): Observable<any> {
        if (category.id == 0) {
            return this.http.post('http://localhost:50810/api/categories', category).map(this.extractRequests).catch(this.handleError);
        } else {
            return this.http.put('http://localhost:50810/api/categories', category).map(this.extractRequests).catch(this.handleError);
        }
    }

    public deleteCategory(id: number): Observable<any> {
        return this.http.delete('http://localhost:50810/api/categories/Delete/' + id).map(this.extractRequests).catch(this.handleError);
    }

    private extractRequests(res: Response|any) {
        if (res['_body']) {
            const data = JSON.parse(res['_body']);
            if (data.value)
            { return data.value; }
            else
            { return data; }
        }
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

}