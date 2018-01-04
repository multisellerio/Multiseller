import { Injectable } from '@angular/core';
import { Subject } from "rxjs/Rx";

@Injectable()
export class BlockUiService {

    private blockUi = new Subject<boolean>();
    public $start = this.blockUi.asObservable();

    showLoader(isShow: boolean) {
        this.blockUi.next(isShow);
    }
}
