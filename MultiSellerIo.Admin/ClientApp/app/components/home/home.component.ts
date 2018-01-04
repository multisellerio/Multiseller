import { Component,ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { BlockUiService } from '../shared/services/block-ui.service';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.css']
})
export class HomeComponent {

    constructor(private toastr: ToastsManager, vcr: ViewContainerRef, private blockUiService: BlockUiService) {
        this.toastr.setRootViewContainerRef(vcr);
      }

 showSuccess() {
     this.toastr.success('You are awesome!', 'Success!');
     this.blockUiService.showLoader(true);
 }
}
