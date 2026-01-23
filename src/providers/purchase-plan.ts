import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { CommonProvider, BaseAPIURL } from '../providers/common';

@Injectable()
export class PurchaseplanProvider {
    constructor( private http: Http, private commonService: CommonProvider ) { }
	// Functions
    /* 
	Sample GET
	----------
	getCategoryData(): any {
        return this.http
            .get( BaseAPIURL + 'Master_api/readall_category', this.commonService.getHeader() )
            .map(( response ) => {
                let result = response.json();
                return result.responseData;
            } )
            .toPromise();
    }  
	Sample POST
	------------
	public doLogin( logindata ) {
        return this.http
            .post( BaseAPIURL + 'mobile_api/authenticate', logindata, this.getHeader() )
            .map(( response ) => {
                // some response manipulation
                let result = response.json();
                return result;
            } )
            .toPromise();
    }
	*/



}

