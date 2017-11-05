// 설정
// const philgoApiEndpoint = 'http://philgo.org/api.php';
const philgoApiEndpoint = 'https://www.philgo.com/api.php';
const philgoFileServerUrl = "https://file.philgo.com";
// const philgoApiEndpointLocation = 'http://www.philgo.com/etc/location/philippines/json.php';


export interface ERROR_RESPONSE {
    code: number;
    message?: string;
};

export interface SUBSITE_INFO {
    domain: string;
    idx_member: string;
    settings: {
        category1: string;
        category2: string;
        category3: string;
        profile_memo: string;
        subject: string;
        copyright: string;
        contact: string;
        mobile: string;
        landline: string;
        email: string;
        facebook: string;
    };
    map_src: string;
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';



@Injectable()
export class PhilgoApiService {

    constructor(
        public http: HttpClient
    ) {

    }

    get serverUrl() {
        return philgoApiEndpoint;
    }


    /**
     * Request to server through POST method.
     * @param data request data
     * 
     *      data['session_id'] - user session id
     *      data['route'] - route
     * 
     *      data['cache_id'] - cache_id. 캐시아이디를 입력하면, 캐시가 있는지 검사한다.
     *          만약 캐시가 있으면, data['callback'] 를 호출한다.
     * 
     */
    post(data): Observable<any> {


        console.log('data: ', data);


        let cache_id = data['cache_id'];
        if ( cache_id ) {
            let cache_data = this.get( cache_id );
            if ( cache_data ) data['callback']( cache_data );
            delete data['cache_id'];
            delete data['callback'];        
        }
        
        console.log('post url: ', this.serverUrl + '?' + this.http_build_query(data));
        
        return this.http.post(this.serverUrl, data)
            .map(res => {
                console.log("resonse: ", res);
                if (!res) {
                    console.log("NO RESPONSE DATA: ", data);
                    return this.throw(-888, 'No response data from server');
                }

                if (res['code'] == void 0) {
                    return this.throw(-999, "NO CODE. This may be server error");
                }
                else if (res['code'] != 0) {
                    if (res['message'] === void 0) res['message'] = 'No error message from server.';
                    return this.throw( res['code'], res['message']);
                }
                else return res['data'];
            })
            .map( res => {
                this.set( cache_id, res );
                return res;
            })
            .catch(e => {
                console.log("post() => catch {} : with : ", e.message);
                if ( this.error(e).code ) return this.throw( this.error(e).code, this.error(e).message );
                return this.throw(-1, '서버 접속에 실패하였습니다.');
            });
    }

    set( name, value ) {
        localStorage.setItem( name, JSON.stringify(value) );
    }
    get( name ) {
        let data = localStorage.getItem( name );
        try {
            return JSON.parse( data );
        }
        catch (e) {
            return data;
        }

        
    }


    

    /**
     * To throw an error or To return an Observable error.
     * 
     * @param code error code
     * @param message error message
     * @param obj if true, it returns Observable.throw(). if false, throws an error.
     */
    throw(code, message?, obj = false): any {
        console.log("PhilgoApiServer::throw with ", message);
        if (obj) {
            return Observable.throw(this.makeErrorResponse(code, message));
        }
        else throw this.makeErrorResponse(code, message);
    }

    /**
     * Returns an Error object with JSON.stringify(code, message)
     * @param code error code
     * @param message error message
     */
    makeErrorResponse(code, message?): Error {
        if (!message) message = '';
        const e = { code: code, message: message };
        return new Error(JSON.stringify(e));
    }


    /**
     * Returns an ERROR_RESPONSE object from an Javascript Error Object.
     * @param e error object
     * 
     * @code
     
        if ( str instanceof Error) {
            str = this.xapi.error(str).message;
        }
        alert ( str );
     *
     * @endcode
     */
    error(e: Error): ERROR_RESPONSE {

        console.log("getError: message: ", e.message);
        let re = <ERROR_RESPONSE>{};
        if (e.message === void 0) return re;
        try {
            re = JSON.parse(e.message);
            console.log("JSON.parse(e.message) => ", re);
        }
        catch (ex) { // failed to JOSN parse error message. Meaning it is not error object. it may be a server error message.
            // console.error(" ========> JSON.parse() failed: ", ex);
            re['code'] = -1;
            re['message'] = "알수 없는 서버 응답입니다. 서버 프로그램 오류 일 수 있습니다.";
        }
        return re;
    }




    /**
     *
     * @code
     
            api.version().subscribe(
                re => console.log("re: ", re),
                e => {
                    console.log(api.error(e).message);
                }
            );
    
     * @endcode
     *
     * 
     *
    
    
    // api.version().subscribe(
    //   re => console.log("re: ", re),
    //   e => {
    //     console.log(e);
    //     console.log(api.error(e).message);
    //     a.alert(e);
    //   }
    // );

     */
    version(): Observable<any> {
        return this.post({ method: 'version' });
    }


    /**
     * 
     * 
     * @param subdomain 
     * 
    api.subsiteInfo( a.subsiteDomain ).subscribe( re => {
      
    }, e => a.alert( e ) );

     */
    subsiteInfo( data ) {
        data['method'] = 'subsiteInfo';
        return this.post( data );
    }

    forumPage( data ) {
        data['method'] = 'forumPage';
        return this.post( data );
    }


    getUrlFromIdx(idx: string) {
        idx = idx + '';
        const last = idx.split('').pop();

        return philgoFileServerUrl + '/data/upload/' + last + '/' + idx;



    }



    /**
     * 이 함수는 Http Query 를 만들 때 사용한다. 주로 테스트 할 때에만 필요하다. 테스트가 끝나면, 이 함수를 삭제해야 한다.
     * @param formdata 
     * @param numericPrefix 
     * @param argSeparator 
     */
    http_build_query(formdata, numericPrefix = '', argSeparator = '') {
        var urlencode = this.urlencode;
        var value
        var key
        var tmp = []
        var _httpBuildQueryHelper = function (key, val, argSeparator) {
            var k
            var tmp = []
            if (val === true) {
                val = '1'
            } else if (val === false) {
                val = '0'
            }
            if (val !== null) {
                if (typeof val === 'object') {
                    for (k in val) {
                        if (val[k] !== null) {
                            tmp.push(_httpBuildQueryHelper(key + '[' + k + ']', val[k], argSeparator))
                        }
                    }
                    return tmp.join(argSeparator)
                } else if (typeof val !== 'function') {
                    return urlencode(key) + '=' + urlencode(val)
                } else {
                    throw new Error('There was an error processing for http_build_query().')
                }
            } else {
                return ''
            }
        }

        if (!argSeparator) {
            argSeparator = '&'
        }
        for (key in formdata) {
            value = formdata[key]
            if (numericPrefix && !isNaN(key)) {
                key = String(numericPrefix) + key
            }
            var query = _httpBuildQueryHelper(key, value, argSeparator)
            if (query !== '') {
                tmp.push(query)
            }
        }

        return tmp.join(argSeparator)
    }


    urlencode(str) {
        str = (str + '')
        return encodeURIComponent(str)
            .replace(/!/g, '%21')
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\*/g, '%2A')
            .replace(/%20/g, '+')
    }



}
