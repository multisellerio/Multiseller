import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AttributesService } from './attributes.service';
import { AttributeModel, AttributeValueModel } from './attribute.model';

@Component({
    templateUrl: './update-attributes.component.html'
})
export class UpdateAttributesComponent implements OnInit {
    @ViewChild('updateAttributeForm') updateAttributeForm: any;
    public attribute: AttributeModel = new AttributeModel();

    constructor(private route: ActivatedRoute, private attributesService: AttributesService) {
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
        this.attributesService.getAttributeById(id).subscribe(data => {
            if (data)
                this.attribute = data;
        }, error => {
            var x = error;
            debugger;
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
        this.attribute.productAttributeValues.push({ id: 0, value: '',meta: '', productAttributeId: 0 });
    }

    // remove product attribute value by index
    public removeAttributeValue(indexToDelete: number) {
        this.attribute.productAttributeValues.splice(indexToDelete, 1);
    }

}
