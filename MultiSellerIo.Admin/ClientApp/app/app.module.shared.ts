import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Http, RequestOptions } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { ToastModule } from 'ng2-toastr/ng2-toastr';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/shared/navmenu/navmenu.component';
import { AccountLayoutComponent } from './components/shared/layouts/account-layout.component';
import { MainLayoutComponent } from './components/shared/layouts/main-layout.component';
import { HomeComponent } from './components/home/home.component';
import { AttributesComponent } from './components/attributes/attributes.component';
import { UpdateAttributesComponent } from './components/attributes/update-attributes.component';
import { AttributesService } from './components/attributes/attributes.service';
import { CategoriesComponent } from './components/categories/categories.component';
import { UpdateCategoriesComponent } from './components/categories/update-categories.component';
import { CategoriesService } from './components/categories/category.service';
import { LoginComponent } from './components/account/login/login.component';
import { AccountService } from './components/account/account.service';
import { CommonData } from './components/shared/common.data';
import { AuthGuard } from './components/shared/services/auth-guard.service';
import { BaseService } from './components/shared/services/base.service';
import { BlockUiService } from './components/shared/services/block-ui.service';
import { UsersComponent } from './components/users/users.component';
import { UsersService } from './components/users/users.service';

export function getToken(): string {
    var token = localStorage.getItem(CommonData.TOKEN_KEY);
    return token ? token : '';
}
export function authHttpServiceFactory(http: Http, options: RequestOptions) {
    return new AuthHttp(new AuthConfig({
        headerPrefix: 'Bearer',
        tokenName: CommonData.TOKEN_KEY,
        tokenGetter: (() => getToken())
    }), http, options);
}

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        AccountLayoutComponent,
        MainLayoutComponent,
        AttributesComponent,
        UpdateAttributesComponent,
        HomeComponent,
        CategoriesComponent,
        UpdateCategoriesComponent,
        LoginComponent,
        UsersComponent
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        BrowserAnimationsModule,
        ToastModule.forRoot(),
        RouterModule.forRoot(
            [
                {
                    path: '', component: MainLayoutComponent,children:
                    [
                        { path: '', redirectTo: 'home', pathMatch: 'full' },
                        { path: 'home', component: HomeComponent },
                        { path: 'attributes', component: AttributesComponent },
                        { path: 'update-attribute/:id', component: UpdateAttributesComponent },
                        { path: 'categories', component: CategoriesComponent },
                        { path: 'update-categories/:id', component: UpdateCategoriesComponent },
                        { path: 'users', component: UsersComponent },
                    ], canActivate:[AuthGuard]
                },
                {
                    path: 'account', component: AccountLayoutComponent, children:
                    [
                        { path: 'login', component: LoginComponent },
                    ]
                }
            ])
    ], providers: [
        {
            provide: AuthHttp,
            useFactory: authHttpServiceFactory,
            deps: [Http, RequestOptions]
        },
        AuthGuard,
        BaseService,
        BlockUiService,
        AttributesService,
        CategoriesService,
        AccountService,
        UsersService
    ]
})
export class AppModuleShared {
}
