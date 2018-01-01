import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AttributesService } from './attributes.service';
import { AttributeModel } from './attribute.model';
import { BlockUiService } from '../shared/services/block-ui.service';

@Component({
    selector: '.attributes-section.m-grid__item.m-grid__item--fluid.m-wrapper',
    templateUrl: './attributes.component.html'
})
export class AttributesComponent implements OnInit {
    public attributes: AttributeModel[] = [];
    public attributeIdToDelete: number = 0;

    constructor(
        private attributesService: AttributesService,
        private blockUiService: BlockUiService,
        private toastr: ToastsManager,
        private vcr: ViewContainerRef
    ) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit(): void {
        this.getAttributes();
    }

    // get all attributes
    private getAttributes() {
        this.blockUiService.showLoader(true);
        this.attributesService.getAttributes().finally(() => {
            this.blockUiService.showLoader(false);
        }).subscribe(data => {
            if (data)
                this.attributes = data;
        }, error => {
            this.toastr.error('Sorry an error occured, loading attributes failed', 'Error!');
        });
    }

    // delete attribute by id
    public deleteAttribute(modalCloseBtn: any) {
        if (this.attributeIdToDelete == 0)
            return;

        this.blockUiService.showLoader(true);
        this.attributesService.deleteAttribute(this.attributeIdToDelete).finally(() => {
            this.attributeIdToDelete = 0;
            this.blockUiService.showLoader(false);
        }).subscribe(data => {
            modalCloseBtn.click();
            this.toastr.success('Attribute deleted successfully', 'Success!');
            this.getAttributes();
        }, error => {
            this.toastr.error('Sorry an error occured, deleting attribute failed', 'Error!');
        });
    }

}