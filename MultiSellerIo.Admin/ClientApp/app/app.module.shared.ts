import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { CounterComponent } from './components/counter/counter.component';
import { AttributesComponent } from './components/attributes/attributes.component';
import { UpdateAttributesComponent } from './components/attributes/update-attributes.component';
import { AttributesService } from './components/attributes/attributes.service';

import { CategoriesComponent } from './components/categories/categories.component';
import { UpdateCategoriesComponent } from './components/categories/update-categories.component';
import { CategoriesService } from './components/categories/category.service';

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        CounterComponent,
        FetchDataComponent,
        AttributesComponent,
        UpdateAttributesComponent,
        HomeComponent,
        CategoriesComponent,
        UpdateCategoriesComponent
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'counter', component: CounterComponent },
            { path: 'fetch-data', component: FetchDataComponent },
            { path: 'attributes', component: AttributesComponent },
            { path: 'update-attribute/:id', component: UpdateAttributesComponent },
            { path: 'categories', component: CategoriesComponent },
            { path: 'update-categories/:id', component: UpdateCategoriesComponent },
            { path: '**', redirectTo: 'home' }
        ])
    ], providers: [AttributesService, CategoriesService]
})
export class AppModuleShared {
}
