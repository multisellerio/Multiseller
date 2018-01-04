import { Component, OnInit } from '@angular/core';
import { CategoriesService } from './category.service';
import { CategoryModel } from './category.model';

@Component({
    templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {
    public categories: CategoryModel[] = [];

    constructor(private categoriesService: CategoriesService) {
    }

    ngOnInit(): void {
        this.getCategories();
    }

    // get all categories
    private getCategories() {
        this.categoriesService.getCategories().subscribe(data => {
            if (data)
                this.categories = data;
        }, error => {
            var x = error;
        });
    }

    // delete category by id
    public deleteCategory(id: number) {
        this.categoriesService.deleteCategory(id).subscribe(data => {
            debugger;
        }, error => {
        });
    }
 
}
