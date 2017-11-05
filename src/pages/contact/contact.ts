import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AppService } from './../../providers/app.service';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(
    public navCtrl: NavController,
    public a: AppService
  ) {
    

  }

}
