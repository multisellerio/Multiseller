import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { BlockUiService } from '../shared/services/block-ui.service';
import { AttributesService } from './attributes.service';
import { AttributeModel, AttributeValueModel } from './attribute.model';

@Component({
    templateUrl: './update-attributes.component.html',
    selector: '.update-attribute-section.m-grid__item.m-grid__item--fluid.m-wrapper'
})
export class UpdateAttributesComponent implements OnInit {
    @ViewChild('updateAttributeForm') updateAttributeForm: any;
    public attribute: AttributeModel = new AttributeModel();

    constructor(private route: ActivatedRoute,
        private attributesService: AttributesService,
        private blockUiService: BlockUiService,
        private toastr: ToastsManager,
        private vcr: ViewContainerRef
    ) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            let id = +params['id'];

            // get existing attribute to update attribute
            if (id && id != 0) {
                this.getAttributeById(id);
            }
        });
    }

    // get attribute by id
    private getAttributeById(id: number) {
        this.blockUiService.showLoader(true);
        this.attributesService.getAttributeById(id).finally(() => {
            this.blockUiService.showLoader(false);
        }).subscribe(data => {
            if (data)
                this.attribute = data;
        }, error => {
            this.toastr.error('Sorry an error occured, loading attribute failed', 'Error!');
        });
    }

    // add or update attribute
    public updateAttribute() {
        if (!this.updateAttributeForm.valid)
            return;

        this.attributesService.updateAttribute(this.attribute).subscribe(data => {

        }, error => {
        });
    }

    // add new product attribute value to array
    public addAttributeValue() {
        this.attribute.productAttributeValues.push({ id: 0, value: '', meta: '', productAttributeId: 0 });
    }

    // remove product attribute value by index
    public removeAttributeValue(indexToDelete: number) {
        this.attribute.productAttributeValues.splice(indexToDelete, 1);
    }

}
