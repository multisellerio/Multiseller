import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";

@Injectable()
export class AccountService {
    constructor(private http: Http) { }

    public login(username: string, password: string): Observable<any> {

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post('http://localhost:50564/api/account/login', { Username: username, Password: password },
            options).map(this.extractRequests).catch(this.handleError);
    }

    private extractRequests(res: Response | any) {
        if (res['_body']) {
            const data = JSON.parse(res['_body']);
            if (data.value) { return data.value; }
            else { return data; }
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
        console.log(errMsg);
        return Observable.throw(errMsg);
    }
}
