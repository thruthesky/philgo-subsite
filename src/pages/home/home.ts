import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppService } from './../../providers/app.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    public a: AppService
  ) {

  }

}
