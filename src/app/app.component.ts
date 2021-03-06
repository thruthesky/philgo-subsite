import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { AppService } from '../providers/app.service';

import { PhilgoApiService } from '../providers/philgo-api/philgo-api.service';



import { ForumPage } from '../pages/forum/forum';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;
  @ViewChild(Nav) nav: Nav;

  constructor(
    platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    api: PhilgoApiService,
    public a: AppService
  ) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

  }

  ngAfterViewInit() {

    this.setNavigations();

    // setTimeout( () => {
    //   this.a.push( 'ForumPage', { post_id: 'freetalk', title: '자유 게시판' } );
    // }, 300);
  }

  /**
   * 핑퐁 참조 (circular-reference) 를 피하기 위해서 여기서 페이지를 정의한다.
   */
  setNavigations() {

    this.a.navCtrl = this.nav;

    this.a.pages['TabsPage'] = TabsPage;
    this.a.pages['HomePage'] = HomePage;
    this.a.pages['ForumPage'] = ForumPage;
    

  }
}
