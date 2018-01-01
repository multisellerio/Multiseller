import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CategoriesService } from './category.service';
import { AttributesService } from './../attributes/attributes.service';
import { CategoryModel, CategoryAttributeModel } from './category.model';

@Component({
    templateUrl: './update-categories.component.html',
    selector: '.update-category-section.m-grid__item.m-grid__item--fluid.m-wrapper'
})
export class UpdateCategoriesComponent implements OnInit {
    @ViewChild('updateCategoryForm') updateCategoryForm: any;
    public category: CategoryModel = new CategoryModel();
    public parentCategories: any[] = [];
    public attributes: any[] = [];

    constructor(
        private route: ActivatedRoute,
        private categoriesService: CategoriesService,
        private attributesService: AttributesService) {
    }

    ngOnInit(): void {
        // load lookup data
        this.getParentCategories();
        this.getAttributes();

        this.route.params.subscribe(params => {
            let id = +params['id'];

            // get existing category to update category
            if (id && id != 0) {
                this.getCategoryById(id);
            }
        });
    }

    // get category by id
    private getCategoryById(id: number) {
        this.categoriesService.getCategoryById(id).subscribe(data => {
            if (data)
                this.category = data;
        }, error => {
            var x = error;
            debugger;
        });
    }

   

    // add or update category
    public updateCategory() {
        if (!this.updateCategoryForm.valid)
            return;

        this.categoriesService.updateCategory(this.category).subscribe(data => {

        }, error => {
        });
    }

    // add new category attribute to array
    public addCategoryAttribute() {
        this.category.categoryAttributes.push(new CategoryAttributeModel());
    }

    // remove category attribute by index
    public removeCategoryAttribute(indexToDelete: number) {
        this.category.categoryAttributes.splice(indexToDelete, 1);
    }


    // lookup data loading-----

    // get existing categories to set as parent categories
    private getParentCategories() {
        this.categoriesService.getCategories().subscribe(data => {
            if (data)
                this.parentCategories = data;
        }, error => {
            var x = error;
            debugger;
        });
    }

    // get product attributes
    private getAttributes() {
        this.attributesService.getAttributes().subscribe(data => {
            if (data)
                this.attributes = data;
        }, error => {
            var x = error;
        });
    }

    // ----------------------------
}
