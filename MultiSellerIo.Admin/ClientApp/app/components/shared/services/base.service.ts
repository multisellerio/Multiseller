import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from "rxjs/Observable";

@Injectable()
export class BaseService {
    public apiEndPoint: any = '';

    constructor() {
        var endpoints = document.getElementById('endpoints');
        if (endpoints && endpoints.dataset && endpoints.dataset.apiurl) {
            this.apiEndPoint = endpoints.dataset.apiurl;
        }
    }

    public extractRequests(res: Response | any) {
        if (res['_body']) {
            const data = JSON.parse(res['_body']);
            if (data.value)
            { return data.value; }
            else
            { return data; }
        }
    }

    public handleError(error: Response | any) {
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