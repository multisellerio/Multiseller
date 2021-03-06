import { Component, ViewEncapsulation } from '@angular/core';
import { BlockUiService } from '../shared/services/block-ui.service';

require('../../../assets/demo/default/base/scripts.bundle.js');
require('../../../assets/scripts/layout.js');

@Component({
    selector: 'body',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
    public isShowLoader: boolean = false;

    constructor(private blockUiService: BlockUiService) {
        blockUiService.$start.subscribe(response => setTimeout(() => this.isShowLoader = response, 0));
    }
}
