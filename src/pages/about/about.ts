import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppService } from './../../providers/app.service';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(
    public navCtrl: NavController,
    public a: AppService
  ) {

  }

}
