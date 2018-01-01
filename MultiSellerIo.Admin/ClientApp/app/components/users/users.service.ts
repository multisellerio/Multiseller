import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class UsersService {
    constructor(public authHttp: AuthHttp) { }

    public getUsers(): Observable<any> {
        return this.authHttp.get('http://localhost:50810/api/users').map(this.extractRequests).catch(this.handleError);
    }

    private extractRequests(res: Response | any) {
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
