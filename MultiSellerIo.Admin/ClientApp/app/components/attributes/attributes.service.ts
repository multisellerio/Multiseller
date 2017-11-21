import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";
import { AttributeModel } from './attribute.model';

@Injectable()
export class AttributesService {

    constructor(private http: Http) { }

    public getAttributes(): Observable<any> {
        return this.http.get('http://localhost:50812/api/attributes').map(this.extractRequests).catch(this.handleError);
    }

    public getAttributeById(id: number): Observable<any> {
        return this.http.get('http://localhost:50812/api/attributes/GetById/'+id).map(this.extractRequests).catch(this.handleError);
    }

    public updateAttribute(attribute: AttributeModel): Observable<any> {
        if (attribute.id == 0) {
            return this.http.post('http://localhost:50812/api/attributes', attribute).map(this.extractRequests).catch(this.handleError);
        } else {
            return this.http.put('http://localhost:50812/api/attributes', attribute).map(this.extractRequests).catch(this.handleError);
        }
    }

    public deleteAttribute(id: number): Observable<any> {
        return this.http.delete('http://localhost:50812/api/attributes/Delete/' + id).map(this.extractRequests).catch(this.handleError);
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