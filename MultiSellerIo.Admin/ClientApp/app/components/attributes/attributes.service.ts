import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { AuthHttp } from 'angular2-jwt';
import { AttributeModel } from './attribute.model';
import { BaseService } from '../shared/services/base.service';

@Injectable()
export class AttributesService extends BaseService {

    constructor(private authHttp: AuthHttp) {
        super();
    }

    public getAttributes(): Observable<any> {
        return this.authHttp.get(this.apiEndPoint + 'attributes').map(this.extractRequests).catch(this.handleError);
    }

    public getAttributeById(id: number): Observable<any> {
        return this.authHttp.get(this.apiEndPoint + 'attributes/GetById/' + id).map(this.extractRequests).catch(this.handleError);
    }

    public updateAttribute(attribute: AttributeModel): Observable<any> {
        if (attribute.id == 0) {
            return this.authHttp.post(this.apiEndPoint + 'attributes', attribute).map(this.extractRequests).catch(this.handleError);
        } else {
            return this.authHttp.put(this.apiEndPoint + 'attributes', attribute).map(this.extractRequests).catch(this.handleError);
        }
    }

    public deleteAttribute(id: number): Observable<any> {
        return this.authHttp.delete(this.apiEndPoint + 'attributes/' + id).map(this.extractRequests).catch(this.handleError);
    }

}