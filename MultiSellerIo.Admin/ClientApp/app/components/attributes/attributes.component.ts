import { Component, OnInit } from '@angular/core';
import { AttributesService } from './attributes.service';
import { AttributeModel } from './attribute.model';

@Component({
    templateUrl: './attributes.component.html'
})
export class AttributesComponent implements OnInit {
    public attributes: AttributeModel[] = [];

    constructor(private attributesService: AttributesService) {
    }

    ngOnInit(): void {
        this.getAttributes();
    }

    // get all attributes
    private getAttributes() {
        this.attributesService.getAttributes().subscribe(data => {
            if (data)
                this.attributes = data;
        }, error => {
            var x = error;
        });
    }

    // delete attribute by id
    public deleteAttribute(id: number) {
        this.attributesService.deleteAttribute(id).subscribe(data => {
            debugger;
        }, error => {
        });
    }
 
}
