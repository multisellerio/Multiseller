import { Component, AfterViewInit, ViewEncapsulation } from '@angular/core';


@Component({
    selector: '[appNavMenu]',
    templateUrl: './navmenu.component.html',
    styleUrls: ['./navmenu.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class NavMenuComponent implements AfterViewInit {
      mLayout: any;
    ngAfterViewInit() {
    
       // let item = $(menu).find('a[href="' + window.location.pathname + '"]').parent('.m-menu__item'); (<any>$(menu).data('menu')).setActiveItem(item);
    }
}
