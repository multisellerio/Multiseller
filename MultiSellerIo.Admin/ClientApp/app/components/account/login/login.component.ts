import { Component, ViewChild } from '@angular/core';
import {Router } from '@angular/router';
import { AccountService } from '../account.service';
import {CommonData} from '../../shared/common.data';

@Component({
    templateUrl: './login.component.html'
})
export class LoginComponent {
    public loginModel: any = { username: null, password: null };
    @ViewChild('loginForm') loginForm: any;

    constructor(private accountService: AccountService, private router:Router) { }

    // get authentication token
    public login() {
        if (!this.loginForm.valid)
            return;

        this.accountService.login(this.loginModel.username, this.loginModel.password).subscribe(data => {
            if (!data || !data.token || !data.user)
            {
                // TO DO Display error
                console.log('dasd');
            }
            // save data in local storage
            localStorage.setItem(CommonData.TOKEN_KEY, data.token);
            localStorage.setItem(CommonData.USER_ID_KEY, data.user.id);
            localStorage.setItem(CommonData.USERNAME_KEY, data.user.username);
            localStorage.setItem(CommonData.USER_EMAIL_KEY, data.user.email);
            this.router.navigate(['home']);
       
        }, error => {
            debugger;
        });
    }
}
