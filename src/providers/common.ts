import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ToastController } from 'ionic-angular';
//import { encode } from 'punycode';
import 'rxjs';
//import { Chart } from 'chart.js';


/*
  Generated class for the CommonProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class CommonProvider {

    private _header: Headers;
    private _imageheader: Headers;
    private _username: string = 'lmxretail';
    private _password: string = 'lmx@2017';
    status: any = false;
    cmpName = "Hari Jewellery ";
    cmpShortName = "RTM";
    msgTimeout = 10000; // Alert Block timeout
    toastTimeout = 6000; // Toast message timeout
    currentUser = JSON.parse(localStorage.getItem('empDetail'));
    designs:any[] = [];

    constructor(public http: Http, public toast: ToastController) {
        this._header = new Headers();

         this._header.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      //  this._header.append('Content-Type', 'application/json');

        this._imageheader = new Headers();
        this._imageheader.append('Authorization', 'Basic ' + btoa(this._username + ':' + this._password));
    }


    public getHeader() {
        let options = new RequestOptions({ headers: this._header });
        return options;
    }
    public getImageHeader() {
        let options = new RequestOptions({ headers: this._imageheader });
        return options;
    }
    public getAuthUserName() {
        return this._username;
    }
    public getAuthUserPwd() {
        return this._password;
    }

    public presentToast( text, duration ) {
        let toast = this.toast.create( {
            message: text,
            duration: (duration == '' ? this.toastTimeout : duration),
            position: 'bottom',
            //dismissOnPageChange : true,
            showCloseButton : true,
            closeButtonText : "Ok"
        } );
        toast.present();
    }
    /*updatestatus(data) {
        console.log(data)
        this.status = data;
        console.log(this.status);
    }*/

    public doLogin(logindata) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/authenticate', logindata, this.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }
    public createCustomer(postData) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/createCustomer', postData, this.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }

    public createQuickCustomer(postData) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/createQuickCustomer', postData, this.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }

    getbranch(): any {
        var d = new Date(),
            n = d.getTime()

        return this.http
            .get(BaseAPIURL + 'admin_app_api/getBranchList?&nocache=' + n)
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }

    getBranchEmployees(id_branch): any {
        var d = new Date(),
            n = d.getTime()

        return this.http
            .get(BaseAPIURL + 'admin_app_api/getBranchEmployees?id_branch='+id_branch+'&nocache=' + n)
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }

    public getCustBySearch(data) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/getCustBySearch', data,this.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }

    getCusAppVersion(): any {
        return this.http
            .get(BaseAPIURL + 'admin_app_api/getVersion', this.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }

    public getCurrencyAndSettings(data) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/getCurrencyAndSettings', data,this.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }

    getcountry(): any {
        var d = new Date(),
            n = d.getTime()
        return this.http
            .get(BaseAPIURL + 'admin_app_api/getCountry?nocache=' + n)
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }
    getstate(id): any {
        var d = new Date(),
            n = d.getTime()
        return this.http
            .get(BaseAPIURL + 'admin_app_api/getState?id_country=' + id + '&nocache=' + n)
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }
    getcity(id): any {
        var d = new Date(),
            n = d.getTime()
        return this.http
            .get(BaseAPIURL + 'admin_app_api/getCity?id_state=' + id + '&nocache=' + n)
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }
    getVillages(): any {
        var d = new Date(),
            n = d.getTime()
        return this.http
            .get(BaseAPIURL + 'admin_app_api/getVillages?&nocache=' + n)
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }
    getoldcategory(): any {
        var d = new Date(),
            n = d.getTime()
        return this.http
            .get(BaseAPIURL + 'admin_app_api/getOldMetalCategory?&nocache=' + n)
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }
    getoldrates(): any {
        var d = new Date(),
            n = d.getTime()
        return this.http
            .get(BaseAPIURL + 'admin_app_api/getAllOldMetalRates?&nocache=' + n)
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }
    public verifyLoginOTP(data) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/verifyLoginOTP', data, this.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }

    // Dashboard
    public getRetDashboard( postData ) {
        return this.http
        .post( BaseAPIURL + 'admin_app_api/get_ret_dashboard', postData, this.getHeader() )
        .map(( response ) => {
            // some response manipulation
            let result = response.json();
            return result;
        } )
        .toPromise();
    }
    public getlist(postData) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/getCurrentDayEstimationsByBranch', postData, this.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }
    public getdivision() {
        return this.http
            .get(BaseAPIURL + 'admin_app_api/getRetCharges', this.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }
    public getsubdesigns( postData ) {
        return this.http
        .post( BaseAPIURL + 'admin_app_api/getSubDesigns', postData, this.getHeader() )
        .map(( response ) => {
            // some response manipulation
            let result = response.json();
            return result;
        } )
        .toPromise();
    }

    public deletegallery( postData ) {
        return this.http
        .post( BaseAPIURL + 'admin_app_api/deletesubdesignimage', postData, this.getHeader() )
        .map(( response ) => {
            // some response manipulation
            let result = response.json();
            return result;
        } )
        .toPromise();
    }
    public deletedesgallery( postData ) {
        return this.http
        .post( BaseAPIURL + 'admin_app_api/deleteDesignimage', postData, this.getHeader() )
        .map(( response ) => {
            // some response manipulation
            let result = response.json();
            return result;
        } )
        .toPromise();
    }
    public updatedefault( postData ) {
        return this.http
        .post( BaseAPIURL + 'admin_app_api/updateDefaultSubDesignImage', postData, this.getHeader() )
        .map(( response ) => {
            // some response manipulation
            let result = response.json();
            return result;
        } )
        .toPromise();
    }
    public updatedefaultdes( postData ) {
        return this.http
        .post( BaseAPIURL + 'admin_app_api/updateDefaultDesignImage', postData, this.getHeader() )
        .map(( response ) => {
            // some response manipulation
            let result = response.json();
            return result;
        } )
        .toPromise();
    }
    public updatedefaulttag( postData ) {
        return this.http
        .post( BaseAPIURL + 'admin_app_api/updateDefaultTagImage', postData, this.getHeader() )
        .map(( response ) => {
            // some response manipulation
            let result = response.json();
            return result;
        } )
        .toPromise();
    }
    public updatecustomer(postData) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/updateCustomer', postData, this.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }
    public getcustomer(postData) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/estcustomerDetails', postData, this.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }
    public getsub(postData) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/estcustomerDetails', postData, this.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }
    public getslip(postData) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/slipdetails', postData, this.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }
    public checkstock(postData) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/getCheckStockAvail', postData, this.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }
    fin(): any {
        var d = new Date(),
            n = d.getTime()

        return this.http
            .get(BaseAPIURL + 'admin_app_api/getFinancialYear?nocache=' + n)
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }
    public checkwgstock(postData) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/getCheckStockAvail', postData, this.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }
    othermetal(): any {

        var d = new Date(),
            n = d.getTime()

        return this.http
            .get(BaseAPIURL + 'admin_app_api/getFinancialYear?nocache=' + n)
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }
    public getsubdesignsold( postData ) {
        return this.http
        .post( BaseAPIURL + 'admin_app_api/getProductSubDesignBySearch', postData, this.getHeader() )
        .map(( response ) => {
            // some response manipulation
            let result = response.json();
            return result;
        } )
        .toPromise();
    }
    public getsubdesignsproduct( postData ) {
        return this.http
        .post( BaseAPIURL + 'admin_app_api/getProductBySearch', postData, this.getHeader() )
        .map(( response ) => {
            // some response manipulation
            let result = response.json();
            return result;
        } )
        .toPromise();
    }
/*     generateotp(mobile): any {
        var d = new Date(),
            n = d.getTime()
        return this.http
            .get(BaseAPIURL + 'mobile_api/generateOTP?mobile=' + mobile + '&nocache=' + n)
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }
 */
    public filter( passworddata ) {
        console.log(passworddata)
        return this.http
        .post( BaseAPIURL + 'admin_app_api/applyFilter', passworddata, this.getHeader() )
        .map(( response ) => {
            // some response manipulation
            let result = response.json();
            return result;
        } )
        .toPromise();
    }
/*     public filter( passworddata ) {
      var currentUser = JSON.parse(localStorage.getItem('sssuser'));
            passworddata['id_customer'] = currentUser['customer']['id_customer']
            console.log(passworddata)
            console.log(passworddata)
            return this.http
            .post( 'https://skjewels.in/skjsavings/admin/index.php/admin_app_api/applyFilter', passworddata, this.getHeader() )
            .map(( response ) => {
                // some response manipulation
                let result = response.json();
                return result;
            } )
            .toPromise();
        } */
    public search( passworddata ) {
        console.log(passworddata)
        return this.http
        .post( BaseAPIURL + 'admin_app_api/search', passworddata, this.getHeader() )
        .map(( response ) => {
            // some response manipulation
            let result = response.json();
            return result;
        } )
        .toPromise();
    }
    public getfilter(temp): any {
        var currentUser = JSON.parse( localStorage.getItem( 'newuser' ) );
        return this.http
            .get( BaseAPIURL+'admin_app_api/get_filter?supplier='+temp, this.getHeader() )
            .map(( response ) => {
                // some response manipulation
                let result = response.json();
                return result;
            } )
            .toPromise();

    }
    public getreasons(): any {
        var currentUser = JSON.parse( localStorage.getItem( 'newuser' ) );
        return this.http
            .get( BaseAPIURL+'admin_app_api/get_enq_fields', this.getHeader() )
            .map(( response ) => {
                // some response manipulation
                let result = response.json();
                return result;
            } )
            .toPromise();

    }

    public getreview(): any {
        var currentUser = JSON.parse( localStorage.getItem( 'newuser' ) );
        return this.http
            .get( BaseAPIURL+'admin_app_api/getCusReviewOptions', this.getHeader() )
            .map(( response ) => {
                // some response manipulation
                let result = response.json();
                return result;
            } )
            .toPromise();

    }

    public feedback(data): any {
        console.log(data)
        return this.http
        .post( BaseAPIURL + 'admin_app_api/updateCusReview', data, this.getHeader() )
        .map(( response ) => {
            // some response manipulation
            let result = response.json();
            return result;
        } )
        .toPromise();

    }

    public logout(): any {

        let empData = JSON.parse(localStorage.getItem('empDetail'));
        empData['uid']
        return this.http
        .post( BaseAPIURL + 'admin_app_api/logout', {'username':empData['username'],'status':0}, this.getHeader() )
        .map(( response ) => {
            // some response manipulation
            let result = response.json();
            return result;
        } )
        .toPromise();

    }

    setdata(data){

        this.designs = data;
        // return this.designs;

    }

    public getwish(): any {
        var currentUser = JSON.parse( localStorage.getItem( 'newuser' ) );
        let empData = JSON.parse(localStorage.getItem('empDetail'));

        return this.http
            .get( BaseAPIURL+'admin_app_api/get_wishlist?type=5', this.getHeader() )
            .map(( response ) => {
                // some response manipulation
                let result = response.json();
                return result;
            } )
            .toPromise();

    }
	 public notconverted(): any {
        var currentUser = JSON.parse( localStorage.getItem( 'newuser' ) );
        let empData = JSON.parse(localStorage.getItem('empDetail'));

        return this.http
            .get( BaseAPIURL+'admin_app_api/get_wishlist', this.getHeader() )
            .map(( response ) => {
                // some response manipulation
                let result = response.json();
                return result;
            } )
            .toPromise();

    }
    public delwish(data): any {

        let empData = JSON.parse(localStorage.getItem('empDetail'));
        empData['uid']
        return this.http
        .post( BaseAPIURL + 'admin_app_api/delete_wishlist', {'username':empData['username'],'wishlist_id':data}, this.getHeader() )
        .map(( response ) => {
            // some response manipulation
            let result = response.json();
            return result;
        } )
        .toPromise();

    }

    public limit(data): any {

        let empData = JSON.parse(localStorage.getItem('empDetail'));
        empData['uid']
        return this.http
        .post( BaseAPIURL+'admin_app_api/get_mc_va_limit', {'username':empData['username'],'wishlist_id':data}, this.getHeader() )
        .map(( response ) => {
            // some response manipulation
            let result = response.json();
            return result;
        } )
        .toPromise();

    }
    getedit(data): any {
        var d = new Date(),
            n = d.getTime()
        return this.http
            .get(BaseAPIURL+'admin_app_api/editEstimation/' + data)
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }
    getuom(): any {
        var d = new Date(),
            n = d.getTime()
        return this.http
            .get(BaseAPIURL+'admin_app_api/get_uomdetails')
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }
    getset(data): any {
        let empData = JSON.parse(localStorage.getItem('empDetail'));
        empData['uid']
        return this.http
        .post( BaseAPIURL+'admin_app_api/get_mc_va_limit',data, this.getHeader() )
        .map(( response ) => {
            // some response manipulation
            let result = response.json();
            return result;
        } )
        .toPromise();
    }

    public metal(postData){
      return this.http
      .post( 'https://skjewels.in/skjsavings/admin/index.php/admin_app_api/get_supplier_items', postData, this.getHeader())
      .map((response) => {
          // some response manipulation
          let result = response.json();
          return result;
      })
      .toPromise();
  }

  public addToWishlist(postData){
    return this.http
    .post( 'https://skjewels.in/skjsavings/admin/index.php/admin_app_api/createWishlist', postData, this.getHeader())
    .map((response) => {
        // some response manipulation
        let result = response.json();
        return result;
    })
    .toPromise();
}

getSections(id_branch): any {
  var d = new Date(),
      n = d.getTime()

  return this.http
      .get(BaseAPIURL + 'admin_app_api/getSections/'+id_branch)
      .map((response) => {
          // some response manipulation
          let result = response.json();
          return result;
      })
      .toPromise();
}

public getOrder_status() {
    return this.http
        .get(BaseAPIURL + 'admin_app_api/getOrderFilters ', this.getHeader())
        .map((response) => {
            // some response manipulation
            let result = response.json();
            return result;
        })
        .toPromise();
}

public get_order_list(data): any {
 
    return this.http
    .post( BaseAPIURL+'admin_app_api/getOrderedList', data, this.getHeader())
    .map((response) => {
        // some response manipulation
        let result = response.json();
        return result;
    })
    .toPromise();

}

public getarea(data): any {
 
    return this.http
    .post( BaseAPIURL+'admin_app_api/get_village_by_pincode', data, this.getHeader())
    .map((response) => {
        // some response manipulation
        let result = response.json();
        return result;
    })
    .toPromise();

}


public uploadTagImage(data): any {
 
    return this.http
    .post( BaseAPIURL+'admin_app_api/uploadTagimage', data, this.getHeader())
    .map((response) => {
        // some response manipulation
        let result = response.json();
        return result;
    })
    .toPromise();

}

}

export const BaseAPIURL = 'https://erp.harijewellery.in/staging/admin/index.php/';
// export const BaseAPIURL = 'http://192.168.1.44/harijwl/admin/index.php/';
// export const BaseAPIURL = 'http://192.168.1.44/etail_development_src/admin/index.php/';


// https://staging.rajathangamaligai.com/admin/






