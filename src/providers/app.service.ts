import { Injectable, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { NavController, LoadingController, AlertController } from 'ionic-angular';

import { PhilgoApiService, SUBSITE_INFO } from './philgo-api/philgo-api.service';




@Injectable()
export class AppService {


    loader;
    navCtrl: NavController = null;
    pages = {};



    info: SUBSITE_INFO = <SUBSITE_INFO>{
        settings: {
            subject: '필고 서브사이트 로딩 중'
        }
    };

    constructor(
        public ngZone: NgZone,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public api: PhilgoApiService
    ) {

        if (window['subsite_domain'] === void 0) this.alert({ title: '설정오류', subTitle: "서브도메인을 추가해 주세요.", message: '서브도메인 설정이 되지 않았습니다. 관리자에게 연락을 해 주세요.' });

        this.loadSubsiteInfo();
    }

    loadSubsiteInfo() {
        this.api.subsiteInfo({
            sub_domain: this.subsiteDomain,
            cache_id: 'siteinfo',
            callback: re => { this.info = re; console.log("cached info with callback() : ", re); }
        }).subscribe(re => {
            this.info = re;
            // console.log('siteinfo: re: ', re);
        }, e => this.alert(e));
    }





    get subsiteDomain() {
        return window['subsite_domain'];
    }
    get postId() {
        return 'subsite_' + this.subsiteDomain;
    }


    showLoader() {
        console.log("Show loader");
        this.loader = this.loadingCtrl.create({
            content: "Please wait...",
            duration: 30000,
            dismissOnPageChange: true
        });
        this.loader.present();
    }
    hideLoader() {
        if (this.loader) this.loader.dismiss();
    }


    /**
     * Displays an error message to user.
     *
     * @note it closes the 'loader' box. normally, 'loader' will be opened for http request.
     *
     * @param str
     *      It can be
     *          - a string.
     *          - an Error object of Javascripit 'Error' class
     *          - an object of { title: '...', subTitle: '...', message: '...', buttonText: '...', callback: () => {} }
     *
     * @code
     *      x.subscribe(re => re, e => this.a.alert( e )
     *
            a.alert('Hello, Alert !');
            a.alert( { title: 'title', subTitle: 'subtitle', message: 'message', buttonText: 'YES', callback: () => {
            console.log( this );
            } } );
            a.alert( new Error('This is an error alert') );

     * @endcode
     */
    alert(str): void {
        if (!str) {
            str = { title: 'No alert information was given.' };
        }
        console.log(str);
        if (typeof str === 'string') {
            str = { message: str };
        }
        else if (str instanceof Error) {
            console.log("instanceof Error");
            const message = this.api.error(str).message;
            const code = this.api.error(str).code;
            str = { title: '에러', subTitle: '에러 코드: ' + code, message: message };
        }
        else if (str instanceof HttpErrorResponse) {
            console.log("instanceof HttpErrorResponse");
            const HER = str;
            let title = 'HTTP_ERROR';
            let subTitle = '';
            let message = '';
            if (HER.message !== void 0) subTitle = HER.message;
            if (HER.error.message !== void 0) subTitle = HER.error.message;
            if (HER.error.text !== void 0) message = HER.error.text;

            str = { title: title, subTitle: subTitle, message: message };
            console.log('str: ', str);
        }
        else if (str['title'] !== void 0 || str['subTitle'] !== void 0 || str['message'] !== void 0) {

        }

        let options = {};
        if (str['title']) options['title'] = str['title'];
        if (str['subTitle']) options['subTitle'] = str['subTitle'];
        if (str['message']) options['message'] = str['message'];

        options['buttons'] = [{
            text: str['buttonText'] === void 0 ? '확인' : str['buttonText'],
            handler: str['callback'] === void 0 ? null : str['callback']
        }];

        this.alertCtrl.create(options).present();
    }


    shortDate(stamp) {

        let d = new Date(stamp * 1000);
        let today = new Date();

        let dt = '';
        if (d.getFullYear() == today.getFullYear() && d.getMonth() == today.getMonth() && d.getDate() == today.getDate()) {
            dt = d.toLocaleString();
            dt = dt.substring(dt.indexOf(',') + 2).toLowerCase();
            dt = dt.replace(/\:\d\d /, ' ');
        }
        else {
            dt = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
        }
        return dt;
    }





    render() {
        this.ngZone.run(() => { });
    }

    openCategory(category) {
        this.setRoot('ForumPage', { post_id: this.postId, category: category, title: category });
    }

    openForum(post_id) {
        let title = '';
        if ( post_id == 'qna' ) title = '질문과 답변';
        else if ( post_id == 'freetalk' ) title = '자유 게시판';
        else if ( post_id == 'buyandsell' ) title = '장터 게시판';
        this.setRoot('ForumPage', { post_id: post_id, title: title });
    }

    setRoot( page, params ) {
        if ( this.pages[ page ] === void 0 ) return this.alert("잘못된 페이지입니다. app.service::setRoot()");
        let component = this.pages[ page ];
        this.navCtrl.setRoot(component, params, {
            animate: true,
            direction: 'forward'
        });
    }



}
