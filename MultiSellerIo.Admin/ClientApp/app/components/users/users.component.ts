import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { UsersService } from './users.service';
import { BlockUiService } from '../shared/services/block-ui.service';

@Component({
    selector:'.users-section.m-grid__item.m-grid__item--fluid.m-wrapper',
    templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
    public users: any[] = [];

    constructor(
        private usersService: UsersService,
        private blockUiService: BlockUiService,
        private toastr: ToastsManager,
        private vcr: ViewContainerRef
    ) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit(): void {
        this.getAllUsers();
    }

    // load all customers
    public getAllUsers() {
        this.blockUiService.showLoader(true);
        this.usersService.getUsers().finally(() => {
            this.blockUiService.showLoader(false);
        }).subscribe(data => {
            if (data)
                this.users = data;
        }, error => {
            this.toastr.error('Sorry an error occured, loading users data failed', 'ERROR!');
        });
    }
}