import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppService } from './../../providers/app.service';
import { PhilgoApiService } from './../../providers/philgo-api/philgo-api.service';

@Component({
    selector: 'page-forum',
    templateUrl: 'forum.html'
})
export class ForumPage {

    post_id;
    category;
    title;
    pageNo: number = 0;
    noMorePosts: boolean = false;
    limit = 12;
    pages = [];
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public a: AppService,
        public api: PhilgoApiService
    ) {

        this.title = navParams.get('title');
        this.post_id = navParams.get('post_id');
        this.category = navParams.get('category');

        if ( ! this.title ) this.title = this.post_id;

        
        this.loadPage();
    }

    get req() {
        let request = {
            post_id: this.post_id,
            category: this.category,
            page_no: this.pageNo,
            limit: this.limit
        };

        if ( this.pageNo <= 3 ) { // 첫번째 페이지 부터 3 번째 페이지까지 캐시를 한다.
            request['cache_id'] = `${this.post_id}-${this.category}-${this.pageNo}-${this.limit}`;
            request['cache_callback'] = re => this.displayPage(re);
        }

        return request;
    }

    loadPage( infiniteScroll? ) {

        if (this.noMorePosts) return;
        this.pageNo++;


        console.log("loadPage with: ", this.pageNo);

        this.beforePageLoad();
        this.api.forumPage( this.req ).subscribe( re => {
            console.log('api.forumPage: ', re);
            this.displayPage( re );
            this.afterLoadPage( infiniteScroll, re );
        }, e => {
            this.afterLoadPage( infiniteScroll );
            this.a.alert(e);
         } );

    }

    beforePageLoad() {
        if ( this.pageNo == 1 ) this.a.showLoader();
    }
    afterLoadPage( infiniteScroll, page? ) {
        if (infiniteScroll) infiniteScroll.complete();
        if ( page ) {
            if ( this.pageNo == 1 ) this.a.hideLoader();
            if ( page.posts.length < this.limit ) this.noMorePosts = true;
        }
    }

    

    displayPage( page ) {
        console.log("Display: ", page);
        this.api.pre( page );
        this.pages[ page.page_no - 1] = page; // 캐시가 있어서, push 를 하면 안된다.
        this.a.render();
    }



  doInfinite(infiniteScroll) {
    if (this.noMorePosts) return infiniteScroll.complete();
    this.loadPage(infiniteScroll);
  }


}
