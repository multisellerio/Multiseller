import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CategoriesService } from './category.service';
import { CategoryModel } from './category.model';
import { BlockUiService } from '../shared/services/block-ui.service';

@Component({
    selector: '.categories-section.m-grid__item.m-grid__item--fluid.m-wrapper',
    templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {
    public categories: CategoryModel[] = [];
    public categoryIdToDelete: number = 0;

    constructor(
        private categoriesService: CategoriesService,
        private blockUiService: BlockUiService,
        private toastr: ToastsManager,
        private vcr: ViewContainerRef
    ) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit(): void {
        this.getCategories();
    }

    // get all categories
    private getCategories() {
        this.blockUiService.showLoader(true);
        this.categoriesService.getCategories().finally(() => {
            this.blockUiService.showLoader(false);
        }).subscribe(data => {
            if (data)
                this.categories = data;
        }, error => {
            this.toastr.error('Sorry an error occured, loading categories failed', 'Error!');
        });
    }

    // delete category by id
    public deleteAttribute(modalCloseBtn: any) {
        if (this.categoryIdToDelete == 0)
            return;

        this.blockUiService.showLoader(true);
        this.categoriesService.deleteCategory(this.categoryIdToDelete).finally(() => {
            this.categoryIdToDelete = 0;
            this.blockUiService.showLoader(false);
        }).subscribe(data => {
            modalCloseBtn.click();
            this.toastr.success('Category deleted successfully', 'Success!');
            this.getCategories();
        }, error => {
            this.toastr.error('Sorry an error occured, deleting category failed', 'Error!');
        });
    }
 
}