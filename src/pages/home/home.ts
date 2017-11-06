import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppService } from './../../providers/app.service';
import { PhilgoApiService } from './../../providers/philgo-api/philgo-api.service';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  page;

  constructor(
    public navCtrl: NavController,
    public a: AppService,
    public api: PhilgoApiService
  ) {



    this.loadPage();
  }


  loadPage() {

    let request = {
      post_id: this.a.postId,
      page_no: 1,
      limit: 10,
      cache_id: 'front-page-cache',
      cache_callback: re => this.displayPage(re),
      fields: 'idx, idx_member, gid, category, subject, content, no_of_comment, no_of_view'
    };

    this.api.forumPage( request ).subscribe( re => {
      this.displayPage(re);
    }, e => this.a.alert(e));

  }



  displayPage( page ) {
    this.api.pre( page );
    this.page = page;
    this.a.render();
}



}
