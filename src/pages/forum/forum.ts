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
            limit_no: this.limit
        };

        if ( this.pageNo == 1 ) {
            request['cache_id'] = `${this.post_id}-${this.category}-${this.pageNo}-${this.limit}`;
            request['callback'] = re => this.displayPage(re);
        }

        return request;
    }

    loadPage() {

        if (this.noMorePosts) return;
        this.pageNo++;

        this.a.showLoader();
        this.api.forumPage( this.req ).subscribe( re => {
            console.log('api.forumPage: ', re);
            this.displayPage( re );
            this.a.hideLoader();
        }, e => {
            this.a.hideLoader();
            this.a.alert(e);
         } );

    }

    displayPage( page ) {
        console.log("Display: ", page);
        this.pages.push( page );
        this.a.render();
    }


}
