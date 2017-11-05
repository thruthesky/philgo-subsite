import { Component, Input } from '@angular/core';

import { AppService } from './../../providers/app.service';

@Component({
    selector: 'header-component',
    templateUrl: 'header.html'
})
export class HeaderComponent {
    @Input() title;
    constructor(
        public a: AppService
    ) {

    }
    

}
