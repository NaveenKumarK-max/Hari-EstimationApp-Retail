import { Component, trigger, state, style, transition, animate, keyframes,ViewChild, ElementRef,ChangeDetectorRef } from '@angular/core';
import { ModalController,IonicPage,Content, Events, NavController, NavParams, LoadingController, ToastController, Platform, ActionSheetController, Loading, AlertController } from 'ionic-angular';
import { CollectionPage } from '../../pages/collection/collection';
import { Toast } from '@ionic-native/toast';
import { CommonProvider, BaseAPIURL } from '../../providers/common';
import { RetailProvider } from '../../providers/retail';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';
import { CartPage } from '../../pages/cart/cart';
import { ScrollHideConfig } from '../../directives/hide-footer/hide-footer';
import { LoginPage } from '../../pages/login/login';
import { RegisterPage } from '../../pages/register/register';
import { DomSanitizer } from '@angular/platform-browser';
import { Slides } from 'ionic-angular';
import { EditorPage } from '../img-editor/editor';
import {NgxImageCompressService} from 'ngx-image-compress';
import { FilePath } from '@ionic-native/file-path';
declare var cordova: any;
import { FileChooser } from '@ionic-native/file-chooser';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions,CaptureVideoOptions } from '@ionic-native/media-capture';
import { CusSearchPage } from '../modal/customer/customer';
import { Addstone2Page } from '../addstone2/addstone2';
import { ChargesPage } from '../charges/charges';
import { EmpSearchPage } from '../modal/employee/employee';
import { FileOpener } from '@ionic-native/file-opener';
import { DocumentViewerOptions } from '@ionic-native/document-viewer';

/**
 * Generated class for the ProductDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component( {
  selector: 'page-supprodetail',
  templateUrl: 'supprodetail.html',
    providers: [CommonProvider,RetailProvider],
    animations: [
        trigger( 'flyInTopSlow', [
            state( "0", style( {
                transform: 'translate3d(0,0,0)'
            } ) ),
            transition( '* => 0', [
                animate( '500ms ease-in', keyframes( [
                    style( { transform: 'translate3d(0,-500px,0)', offset: 0 } ),
                    style( { transform: 'translate3d(0,0,0)', offset: 1 } )
                ] ) )
            ] )
        ] )
    ]
} )
export class SupprodetailPage {
    @ViewChild(Content) content: Content;

    private _header: Headers;
    private _username: string = 'lmxretail';
    private _password: string = 'lmx@2017';
    checkStatus: boolean =false;
    /* public photos : any;
    public base64Image : string; */
    public targetPaths = [];
    public vidtargetPaths = [];

    public filenames = [];
    public vidfilenames = [];
    public charges = [];

    purityname: String = "";
    subcategory:any;
    categoryId: any;
    namey:any ='D0wqd2IyB1w';
    proid: any;
    type:any = 1;
    lastImage: string = null;
    productdet:any =  this.navParams.get( 'proid' );
    video:any = '';
    @ViewChild('slides') slides: Slides;
    slidess:any[] = this.navParams.get( 'single' );
    productid: any = 0;
    inf = false;
    gif = false;
    temp = [{'name':'Chennai'},{'name':'Coimbatore'},{'name':'Madurai'},{'name':'Salem'}]
    // footerScrollConfig: ScrollHideConfig= { cssProperty: 'margin-bottom', maxValue: undefined };
    base="data:image/png;base64,";
    showdiamond:any[] = [];
    showstone:any[] = [];
    productItems1:any[] = [] ;
    calc:any = 350;
    top:any = 0;
    loader: any;
    MAX_FILE_SIZE:any = 60000000;
    ALLOWED_MIME_TYPE = "video/mp4";
    selectedVideo: any;
    ids: any = '';
    idw:any = '';
    show= false;
    progress:any= 0;
    stoneMasData:any[] = [];
    stone_details:any[] = [];
    slideimg : any = this.productdet['TagImage'];
    metalRate:any;
    taxGroupItems:any;
    empData = JSON.parse(localStorage.getItem('empDetail'));
    employees:any[] = [];
    selectedOption:string;
    minDate: any;
    yearValues: number[];

    othermetals: any[] = [];
    supplier:any = this.navParams.get('supplier');
    totalvalue:any 
    totalgram:any
    totalct:any

    stoneMasTypes:any[] = [];
    constructor(private fileOpener: FileOpener,public modal:ModalController,public retail:RetailProvider,private mediaCapture: MediaCapture,public fileChooser:FileChooser,public filePath:FilePath,public imageCompress: NgxImageCompressService,public cd:ChangeDetectorRef,public sanitizer: DomSanitizer, private commonservice: CommonProvider,public navCtrl: NavController, public platform: Platform, public navParams: NavParams, private loadingCtrl: LoadingController, private toastCtrl: ToastController, private event: Events, private toast: Toast, public actionSheetCtrl: ActionSheetController, private camera: Camera, private transfer: Transfer, private ftransfer: FileTransfer, private file: File, public http: Http, private alertCtrl: AlertController ) {
      this.totalvalue = 0;   
      this.totalgram = 0;
      this.totalct = 0;
      console.log(this.supplier);
      console.log('prod detail : ',this.productdet);
      

      const currentDate = new Date();
      this.minDate = currentDate.toISOString();
      this.yearValues = this.generateFutureYears(currentDate.getFullYear(), 10);
       // this.selectedOption = 'option1'
       this.productdet['rate_type'] = 2
       this.productdet['balance_type'] = 2
       this.productdet['empname'] = ''
       this.commonservice.getBranchEmployees(this.empData['id_branch']).then(data=>{
         this.employees = data;
     });
        // this.productdet = navParams.get( 'proid' );
        // this.productdet['TagImage'] = navParams.get( 'proid' )['arr'][0]['TagImage'];

        // this.slidess = navParams.get( 'proid' )['arr'];
        let i =  this.slidess.findIndex(data=>data['TagNo'] == this.productdet['TagNo']);
        if(i >= 0){
          this.slidess.splice(i,1);
          this.slidess.unshift(this.productdet);
        }
          this.productdet['id_purity'] = this.productdet['purity_id'];
        console.log(this.productdet)
        console.log(this.slidess)

        console.log(this.productdet.hasOwnProperty('weight'))
        // this.show = true;
        this.showstone = this.productdet['TagStoneDetails'].length > 0 ? this.productdet['TagStoneDetails'].filter(data=>data['Nature'] != 'DIAMOND') : [];
        this.stone_details = this.productdet.hasOwnProperty('TagStoneDetails') ? this.productdet['TagStoneDetails'] : [];
        console.log(this.stone_details)
        this.othermetals = this.productdet.hasOwnProperty('other_metal_details') ? this.productdet['other_metal_details'] : [];
        console.log(this.othermetals);
        console.log('show stone:',this.showstone );
        
        for (let index = 0; index < this.showstone.length; index++) {
          console.log(this.showstone[index].stone_price);
          this.totalvalue += parseFloat(this.showstone[index].stone_price);
          if( this.showstone[index]['uom_id'] == 1){
            this.totalgram += parseFloat(this.showstone[index]['stone_wt'] )
          }else if( this.showstone[index]['uom_id'] == 6){
            this.totalct += parseFloat(this.showstone[index]['stone_wt'] )
          }
        console.log(this.totalvalue);
        console.log( this.totalgram );
        console.log(this.totalct);
        
        
       }


        // this.productdet['purities'] = [];
        // this.productdet['weights'] = [];
        // this.productdet['sizes'] = [];

        // this.productdet['weight'] = '';
        // this.productdet['pcs'] = '';
        // this.productdet['due_date'] = '';
        // this.productdet['id_weight'] = '';
        // this.productdet['id_purity'] = '';

        // this.productdet['id_size'] = '';
        // this.productdet['sample_details'] = '';

        this.showdiamond = this.productdet['TagStoneDetails'].length > 0 ? this.productdet['TagStoneDetails'].filter(data=>data['Nature'] == 'DIAMOND') : [];
        this._header = new Headers();
        this._header.append( 'Authorization', 'Basic ' + btoa( this._username + ':' + this._password ) );

        this.productItems1 = JSON.parse(localStorage.getItem('wish')) != null ?  JSON.parse(localStorage.getItem('wish')).filter(data=>data['TagNo'] == this.productdet['TagNo']) : [];
       setTimeout(() => {
        this.content.resize();
        console.log('271892718927')
       }, 300);

       let empData = JSON.parse(localStorage.getItem('empDetail'));

       this.retail.getAllStoneMaters({"id_branch":empData['id_branch']}).then(data=>{
         this.stoneMasData = data;
       })

       
       this.retail.getAllStoneTypes({"id_branch":empData['id_branch']}).then(data=>{
        this.stoneMasTypes = data;
      })


       this.retail.getAllTaxGroupItems().then(data=>{
        this.taxGroupItems = data;
        this.event.publish('taxGroup:loaded', true);

        this.commonservice.getCurrencyAndSettings({"id_metalrates":'',"id_branch":empData['id_branch']}).then(data=>{
          this.metalRate = data.metal_rates;
          this.calculate('');
        });
      });

	        this.commonservice.getdivision().then(data=>{

        this.productdet['allcharges'] = data['charges'];
        // loader.dismiss();
      });

      console.log(this.productdet,'0000000000000');


    }

    generateFutureYears(startYear: number, numYears: number): number[] {
      const futureYears = [];
      for (let i = 0; i < numYears; i++) {
        futureYears.push(startYear + i);
      }
      return futureYears;
    }

    ionViewDidLoad(){

    }
    photoURL(data) {

        // this.video.safeurl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+data) ;
    //    this.video  =  this.sanitizer.bypassSecurityTrustResourceUrl(this.video) ;
        // return this.sanitizer.bypassSecurityTrustResourceUrl(this.video) ;
        ;
      }
      back(){
        if(this.slides.getActiveIndex() != 0){
        this.slides.slidePrev();
        }
      }
      next(){

        this.slides.slideNext();
      }




    // ionViewDidLoad() {

    // }




    private presentToast( text ) {
        let toast = this.toastCtrl.create( {
            message: text,
            duration: 3000,
            position: 'middle'
        } );
        toast.present();
    }



    changeImage( image,type,video ) {

        if(type == 2){
            this.type = type;
            console.log('test');
            this.content.scrollToTop();
            console.log(this.type)
        }
        else{
        this.productdet.prodefaultimg = image;
        this.type = type;
        console.log(this.type)
        }
    }

    addtocart( product ) {
        var loginstatus = JSON.parse( localStorage.getItem( 'check' ));


        if( loginstatus == false || loginstatus == null){

            // let toast = this.toastCtrl.create( {
            //     message: 'Please Login / Register Your Account to Checkout Your Item',
            //     duration: 4000,
            //     position: 'middle'
            // } );
            // toast.present();
            let alert = this.alertCtrl.create({
                title: 'Dhamu Chettiar Nagai Maligai',
                message: 'Please Login / Register Your Account to View Item',
                enableBackdropDismiss: false, // <- Here! :)

                buttons: [
                  {
                    text: 'SignIn',
                    role: 'cancel',
                    handler: () => {
                        this.navCtrl.push(LoginPage)
                    }
                  },
                //   {
                //     text: 'Register',
                //     handler: () => {
                //         this.navCtrl.push(RegisterPage);
                //     }
                //   }
                ]
              });
              alert.present();
        }
        if( loginstatus == true){

        let loader = this.loadingCtrl.create( {
            // content: "Please wait...",
            // spinner: 'hide',
            // content: `<img src="assets/loader.gif" height="80px" width="80px"/>`,
        } );
        loader.present();

        if ( (product.is_chain && parseFloat(product.reqweight) < parseFloat(product.order_minweight) ) || product.id_purity == undefined ) {
            console.log( product );
            if (product.is_chain && parseFloat(product.reqweight) < parseFloat(product.order_minweight) ) {
                if ( this.platform.is( 'cordova' ) ) {
                    this.toast.show( 'Minimum order weight is '+product.order_minweight+' g', 'short', 'center' ).subscribe(
                        toast => {
                            console.log( toast );
                        }
                    );
                } else {
                    let toast = this.toastCtrl.create( {
                        message: 'Minimum order weight is '+product.order_minweight+' g',
                        duration: 5000,
                        position: 'middle'
                    } );
                    toast.present();
                }
            }
            else if ( product.id_purity == undefined ) {
                if ( this.platform.is( 'cordova' ) ) {
                    this.toast.show( 'Select purity', 'short', 'center' ).subscribe(
                        toast => {
                            console.log( toast );
                        }
                    );
                } else {
                    let toast = this.toastCtrl.create( {
                        message: 'Select purity',
                        duration: 4000,
                        position: 'middle'
                    } );
                    toast.present();
                }
            }
            /* else if ( product.sizeorlen == undefined ) {
                if ( this.platform.is( 'cordova' ) ) {
                    this.toast.show( 'Enter size or length', 'short', 'center' ).subscribe(
                        toast => {
                            console.log( toast );
                        }
                    );
                } else {
                    let toast = this.toastCtrl.create( {
                        message: 'Enter size or length',
                        duration: 5000,
                        position: 'middle'
                    } );
                    toast.present();
                }
            } */
            loader.dismiss();
        }
        else {
            if ( localStorage.getItem( 'appcartitems' ) != null ) {
                let curr_cartproducts = JSON.parse( localStorage.getItem( 'appcartitems' ) );
                let deliveryorders = [];
                let prodavail = true;
                curr_cartproducts.forEach(( orders ) => { // foreach statement
                    if ( orders.id_product == product.id_product && orders.id_purity == product.id_purity && product.sizeorlen == orders.sizeorlen && product.reqweight == orders.reqweight) {
                        orders.qty = parseInt(orders.qty) + parseInt(product.qty);
                        prodavail = false;
                    }
                    deliveryorders.push( orders );
                } );
                if ( prodavail ) {
                    deliveryorders.push( product );
                }
                localStorage.setItem( 'appcartitems', JSON.stringify( deliveryorders ) );
            } else {
                let deliveryorders = [];
                deliveryorders.push( product );
                localStorage.setItem( 'appcartitems', JSON.stringify( deliveryorders ) );
            }

            loader.dismiss();
            if ( this.platform.is( 'cordova' ) ) {
                this.toast.show( 'Item added to cart', 'short', 'center' ).subscribe(
                    toast => {
                        console.log( toast );
                    }
                );
            } else {
                let toast = this.toastCtrl.create( {
                    message: 'Item added to cart',
                    duration: 3000,
                    position: 'middle'
                } );
                toast.present();
            }
            this.event.publish( 'cart:changed', ( JSON.parse( localStorage.getItem( 'appcartitems' ) ).length ) );
            this.navCtrl.push( CartPage,{value:''} );
            //this.navCtrl.pop();

        }

    }
    }
    grid()
    {
        console.log("grid");
        this.checkStatus = true;
    }
    listgrid()
    {
        console.log("listgrid");
        this.checkStatus = false;
    }
    openProductdetails( id_design ) {
        this.navCtrl.push( SupprodetailPage, { proid: id_design } );
    }


        ionViewWillLeave(){
          this.event.publish( 'entered', false );

        }
    ionViewWillEnter(){

      this.event.publish( 'entered', true );
      this.event.publish( 'pageno', 20 );

      if(localStorage.getItem('dip') != ''){
        var path :any = JSON.parse(localStorage.getItem('dip'))
        var name :any = JSON.parse(localStorage.getItem('din'))
        console.log("dip : "+path+" -- "+"din : "+name)
      }
      if(path != null && path != undefined && path != '' && this.navParams.get('state') == true){
        this.targetPaths.push(path);
        console.log(this.targetPaths)
        this.filenames.push(name);
        console.log(this.filenames)
        this.productdet['targetPaths'] = this.targetPaths;

        this.productdet['sample_images'] = this.filenames;
      }
      this.event.subscribe('img', (userEventData) => {
      // this.productdet['sample_images'] = userEventData;
      });
      this.event.subscribe('tar', (userEventData) => {
        console.log(userEventData)
        this.targetPaths.pop();
        this.targetPaths.push(userEventData);
        console.log(this.targetPaths)
      });
      this.event.subscribe('file', (userEventData) => {
        console.log(userEventData)
        this.filenames.pop();
        this.filenames.push(userEventData);
        console.log(this.filenames)
        this.productdet['sample_images'] = this.filenames;
      });
      this.event.subscribe('err', (userEventData) => {
        this.targetPaths.splice( userEventData, 1 );
      });
      this.event.subscribe('errr', (userEventData) => {
        this.filenames.splice( userEventData, 1 );
      });
      console.log(this.productdet);
      console.log(this.targetPaths)

    }
    fixprice(data){
    //  console.log('price : ',data);
      

        let temp1:any = parseFloat(data).toFixed(3);

        // let temp:any = parseFloat(temp1);
        return temp1;
        // return temp.toLocaleString(undefined, {minimumFractionDigits: 3,
        //   maximumFractionDigits: 3});
        // return parseFloat(data).toLocaleString(undefined, {minimumFractionDigits: 2,
        //   maximumFractionDigits: 2});
        // return parseFloat(data).toFixed(2);
      }
      price(data){

        let temp1:any = parseFloat(data).toFixed();

        return temp1;

      }

      addw(){

        let productItems = JSON.parse(localStorage.getItem('wish')) != null ? JSON.parse(localStorage.getItem('wish')) : [] ;

          if(productItems.length > 0 ){

            let productItems1 = productItems.filter(data=>data['TagNo'] == this.productdet['TagNo']);

            if(productItems1.length == 0 ){
                productItems.push(this.productdet);
            localStorage.setItem('wish',JSON.stringify(productItems));
          this.presentToast( 'Product Wishlisted Successfully' );
          this.productItems1 = JSON.parse(localStorage.getItem('wish')) != null ?  JSON.parse(localStorage.getItem('wish')).filter(data=>data['TagNo'] == this.productdet['TagNo']) : [];

            }
            else{

                let index = productItems.findIndex(data=>data['TagNo'] == this.productdet['TagNo']);
                productItems.splice(index,1);
                localStorage.setItem('wish',JSON.stringify(productItems));
                this.presentToast( 'Product Removed Successfully' );
                this.productItems1 = JSON.parse(localStorage.getItem('wish')) != null ?  JSON.parse(localStorage.getItem('wish')).filter(data=>data['TagNo'] == this.productdet['TagNo']) : [];

            }
      }
      else{
            localStorage.setItem('wish',JSON.stringify([this.productdet]));
          this.presentToast( 'Product Wishlisted Successfully' );
          this.productItems1 = JSON.parse(localStorage.getItem('wish')) != null ?  JSON.parse(localStorage.getItem('wish')).filter(data=>data['TagNo'] == this.productdet['TagNo']) : [];

      }
      }

      scrolling(event) {

        if(event.scrollTop == 0){

          this.calc = 350;
        }
        else{
          this.calc = 350 - event.scrollTop;
          this.content.resize();
          this.cd.detectChanges();
        }
          // your content here for scrolling
        }

        proceedToWishlist(){

            console.log(this.productdet)

            if(this.productdet['id_purity'] == '' || this.productdet['weight'] == '' || this.productdet['pcs'] == '' || this.productdet['due_date'] == '' || this.productdet['empname'] == ''  ){
             console.log(this.productdet)


              if(this.productdet['id_purity'] == '' && this.supplier ==  true){
                this.commonservice.presentToast( 'Please Select Purity *',1000 );

              }
              else if(this.productdet['weight'] == '' && this.supplier ==  true){
                this.commonservice.presentToast( 'Please Enter Weight *',1000 );

              }
              else if(this.productdet['pcs'] == ''){
                this.commonservice.presentToast( 'Please Enter Pieces *',1000);

              }
              else if(this.productdet['due_date'] == ''){
                this.commonservice.presentToast( 'Please Enter No of Days *',1000);

              }
              else if(this.productdet['empname'] == ''){
                this.commonservice.presentToast( 'Please Enter Employee *',1000);

              }

            }else{

             if(this.productdet['from_weight'] > 0 && this.productdet['to_weight'] > 0) {

             if(parseFloat(this.productdet.weight) >= parseFloat(this.productdet['from_weight']) && parseFloat(this.productdet.weight) <= parseFloat(this.productdet['to_weight'])){
let empData = JSON.parse(localStorage.getItem('empDetail'));
                console.log(empData);

            this.productdet['net_wt']    = this.productdet['weight'] - this.productdet['less_wt'];

         this.productdet['net_wt']    = this.retail.setAsNumber(this.productdet['net_wt']).toFixed(3);

           this.productdet['actual_net_wt']    = this.productdet['net_wt'];

                let wishlistData = {
                                      'id_customer'     : '',
                                      'id_branch'       : empData['id_branch'],
                                      // 'id_employee'     : empData['id_employee'],
                                      'id_employee'     : this.productdet['id_employee'],
                                      'item_type'       : 3, // E-catalog
                                      'is_customized'   : 1,
                                      'id_product'      : this.productdet['product_id'],
                                      'design_no'       : this.productdet['design_id'],
                                      'id_sub_design'   : this.productdet['id_sub_design'],
                                      'id_mc_type'      : this.productdet['mc_type'],
                                      'mc'              : this.productdet['mc_value'],
                                      'stn_amt'         : 0,
                                      'due_date'        : this.productdet['due_date'],
                                      'length'          : this.productdet['len'],
                                      'width'           : this.productdet['width'],
                                      'dia'             : this.productdet['dia'],
                                      'weight'          : this.productdet['weight'],
                                      'id_size'            : this.productdet['id_size'],
                                      'id_weight'            : this.productdet['id_weight'],

                                      'pcs'             : this.productdet['pcs'],
                                      'id_purity'       : this.productdet['id_purity'],
                                      'hook_type'       : this.productdet['hook_type'],
                                      'sample_details'  : this.productdet['sample_details'],
                                      'image': this.productdet['TagImage'],
                                      'targetPaths': this.productdet['targetPaths'],
                                      'sample_images'   : this.productdet['sample_images'],
                                      'sample_videos'   : this.vidfilenames,
                                      'stones'          : this.productdet['TagStoneDetails'],
                                      'stone_price'          : this.productdet['stone_price'],
                                      'status'          : 1,
                                      'id_wishlist'     : this.productdet['id_wishlist'],
                                      'sub_design_name' : this.productdet['sub_design_name'],
                                      'design_name' : this.productdet['design_name'],
                                      'product_name' : this.productdet['product_name'],
                                      'id_category': this.productdet['id_category'],
                                      'id_supp_catalogue':this.productdet['id_supp_catalogue'],
                                      'stone_wt' : this.productdet['stone_wt'] ,
                                      'stone_details' : this.productdet['stone_details'] ,

                                       'MetalCode' : this.productdet['MetalCode'] ,
                                        'calculation_based_on' : this.productdet['calculation_based_on'] ,
                                         'sales_value' : this.productdet['sales_value'] ,
                                          'tgrp_id' : this.productdet['tgrp_id'] ,
                                             'less_wt' : this.productdet['less_wt'] ,
                                          'net_wt' : this.productdet['net_wt'] ,
                                         'charge_value' : this.productdet['charge_value'] ,
                                           'id_charge':this.productdet['id_charge'] ,
                                           'charges':this.productdet['charges'] ,
                                          'wast_percent' : this.productdet['retail_max_wastage_percent'],
                                          'metal_name': this.productdet['MetalName'],
                                          'sub_product': this.productdet['sub_design_name'],
                                          'tag_num': this.productdet['TagNo'],
                                         'gross_wt': this.productdet['GrossWt'],
                                         'Purity': this.productdet['Purity'],
                                         'rate': this.productdet['Rate'],
                                         'tax_group_id': this.productdet['tgrp_id'],
                                         'retail_max_wastage_percent': this.productdet['retail_max_wastage_percent'],

                                         'market_metal_type': this.productdet['market_metal_type'],
                                         'market_rate_field': this.productdet['market_rate_field'],
                                         'metal_type': this.productdet['rate_field'],
                                         'rate_type':this.productdet['rate_type'],
                                         'balance_type':this.productdet['balance_type'],
                                         'other_metal_details': this.productdet['other_metal_details'],
                                         'total_tax_rate':this.productdet['tax_price'],
                                         'order_rate':this.productdet['rate_per'],
                                         'taxable':this.productdet['taxable']
                                    };
                                     if(localStorage.getItem('carts') == null){
                                      localStorage.setItem('carts', JSON.stringify({"id_branch" : empData['id_branch'], "id_employee" : empData['id_employee'], "id_customer" : '', "status" : 1,"items" :[wishlistData]}));
                                     }
                                     else{

                                      let local :any[] = JSON.parse(localStorage.getItem('carts'))['items'] ;
                                      console.log(local)
                                      local.push(wishlistData);
                                      console.log(local)
                                      localStorage.setItem('carts', JSON.stringify({"id_branch" : empData['id_branch'], "id_employee" : empData['id_employee'], "id_customer" : '', "status" : 1,"items" :local}));

                                     }

                                      // this.loader.dismiss();
                  this.commonservice.presentToast( "Product added to cart successfully",'' );
                  this.navCtrl.push(CartPage);
             }
             else{
              this.commonservice.presentToast( 'Please Enter Valid Weight *',1000);
             }
             }
else{
                let empData = JSON.parse(localStorage.getItem('empDetail'));
                console.log(empData);

		    this.productdet['net_wt']    = this.productdet['weight'] - this.productdet['less_wt'];

         this.productdet['net_wt']    = this.retail.setAsNumber(this.productdet['net_wt']).toFixed(3);

           this.productdet['actual_net_wt']    = this.productdet['net_wt'];

                let wishlistData = {
                                      'id_customer'     : '',
                                      'id_branch'       : empData['id_branch'],
                                      // 'id_employee'     : empData['id_employee'],
                                      'id_employee'     : this.productdet['id_employee'],
                                      'item_type'       : 3, // E-catalog
                                      'is_customized'   : 1,
                                      'id_product'      : this.productdet['product_id'],
                                      'design_no'       : this.productdet['design_id'],
                                      'id_sub_design'   : this.productdet['id_sub_design'],
                                      'id_mc_type'      : this.productdet['mc_type'],
                                      'mc'              : this.productdet['mc_value'],
                                      'stn_amt'         : 0,
                                      'due_date'        : this.productdet['due_date'],
                                      'length'          : this.productdet['len'],
                                      'width'           : this.productdet['width'],
                                      'dia'             : this.productdet['dia'],
                                      'weight'          : this.productdet['weight'],
                                      'id_size'            : this.productdet['id_size'],
                                      'id_weight'            : this.productdet['id_weight'],

                                      'pcs'             : this.productdet['pcs'],
                                      'id_purity'       : this.productdet['id_purity'],
                                      'hook_type'       : this.productdet['hook_type'],
                                      'sample_details'  : this.productdet['sample_details'],
                                      'image': this.productdet['TagImage'],
                                      'targetPaths': this.productdet['targetPaths'],
                                      'sample_images'   : this.productdet['sample_images'],
                                      'sample_videos'   : this.vidfilenames,
                                      'stones'          : this.productdet['TagStoneDetails'],
                                      'stone_price'          : this.productdet['stone_price'],
                                      'status'          : 1,
                                      'id_wishlist'     : this.productdet['id_wishlist'],
                                      'sub_design_name' : this.productdet['sub_design_name'],
                                      'design_name' : this.productdet['design_name'],
                                      'product_name' : this.productdet['ProductName'],
                                      'id_category': this.productdet['id_category'],
                                      'id_supp_catalogue':this.productdet['id_supp_catalogue'],
                                      'stone_wt' : this.productdet['stone_wt'] ,
                                      'stone_details' : this.productdet['stone_details'] ,

									   'MetalCode' : this.productdet['MetalCode'] ,
									    'calculation_based_on' : this.productdet['calculation_based_on'] ,
										 'sales_value' : this.productdet['sales_value'] ,
										  'tgrp_id' : this.productdet['tgrp_id'] ,
										  	 'less_wt' : this.productdet['less_wt'] ,
										  'net_wt' : this.productdet['net_wt'] ,
										 'charge_value' : this.productdet['charge_value'] ,
	                                       'id_charge':this.productdet['id_charge'] ,
			                               'charges':this.productdet['charges'] ,
										  'wast_percent' : this.productdet['retail_max_wastage_percent'],
                      'metal_name': this.productdet['MetalName'],
                      'sub_product': this.productdet['sub_design_name'],
                      'tag_num': this.productdet['TagNo'],
                     'gross_wt': this.productdet['GrossWt'],
                     'Purity': this.productdet['Purity'],
                     'rate': this.productdet['Rate'],
                     'tax_group_id': this.productdet['tgrp_id'],
                     'retail_max_wastage_percent': this.productdet['retail_max_wastage_percent'],

                     'market_metal_type': this.productdet['market_metal_type'],
                     'market_rate_field': this.productdet['market_rate_field'],
                     'metal_type': this.productdet['rate_field'],
                     'rate_type':this.productdet['rate_type'],
                     'balance_type':this.productdet['balance_type'],
                     'other_metal_details': this.productdet['other_metal_details'],
                     'total_tax_rate':this.productdet['tax_price'],
                     'order_rate':this.productdet['rate_per'],
                     'taxable':this.productdet['taxable'],
                     'Status' : this.productdet['Status']
                                    };
                                     if(localStorage.getItem('carts') == null){
                                      localStorage.setItem('carts', JSON.stringify({"id_branch" : empData['id_branch'], "id_employee" : empData['id_employee'], "id_customer" : '', "status" : 1,"items" :[wishlistData]}));
                                     }
                                     else{

                                      let local :any[] = JSON.parse(localStorage.getItem('carts'))['items'] ;
                                      console.log(local)
                                      local.push(wishlistData);
                                      console.log(local)
                                      localStorage.setItem('carts', JSON.stringify({"id_branch" : empData['id_branch'], "id_employee" : empData['id_employee'], "id_customer" : '', "status" : 1,"items" :local}));

                                     }

                                      // this.loader.dismiss();
                  this.commonservice.presentToast( "Product added to cart successfully",'' );
                  this.navCtrl.push(CartPage);
            }
            }
          }
        public presentActionSheet() {
            let actionSheet = this.actionSheetCtrl.create( {
                title: 'Select Image Source',
                buttons: [
                     {
                         text: 'Load from Gallery',
                         handler: () => {
                            this.takePicture( this.camera.PictureSourceType.PHOTOLIBRARY );
                        }
                     },
                    {
                        text: 'Take Picture',
                        handler: () => {
                            this.takePicture( this.camera.PictureSourceType.CAMERA );
                        }
                    },
                    {
                        text: 'Cancel',
                        role: 'cancel'
                    }
                ]
            } );
            actionSheet.present();
        }

        public presentActionSheetvideo() {
          let actionSheet = this.actionSheetCtrl.create( {
              title: 'Select Video Source',
              buttons: [
                   {
                       text: 'Load from Gallery',
                       handler: () => {
                          this.recordVideo( this.camera.PictureSourceType.PHOTOLIBRARY );
                      }
                   },
                  {
                      text: 'Take Video',
                      handler: () => {
                          this.rec();
                      }
                  },
                  {
                      text: 'Cancel',
                      role: 'cancel'
                  }
              ]
          } );
          actionSheet.present();
      }

        public takePicture( sourceType ) {
          console.log(sourceType);
          // this.navCtrl.push(EditorPage,{images:'assets/img/earings.jpg'});
          // Create options for the   Dialog
          var options = {
              quality: 100,
              sourceType: sourceType,
              saveToPhotoAlbum: false,
              correctOrientation: true,
            // allowEdit:true
          };
          console.log(options);
          // Get the data of an image
          this.camera.getPicture( options ).then(( imagePath ) => {
            console.log("getPicture");
            this.loader = this.loadingCtrl.create( {
                content: "Fetching...",
                spinner: 'bubbles',
            } );
            this.loader.present();
            console.log("imagePath : "+imagePath);
            if ( this.platform.is( 'android' ) && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY ) {
                this.filePath.resolveNativePath( imagePath )
                    .then( filePath => {
                        console.log('ttttttttttt',this.filePath)
                        let correctPath = filePath.substr( 0, filePath.lastIndexOf( '/' ) + 1 );
                        let currentName = imagePath.substring( imagePath.lastIndexOf( '/' ) + 1, imagePath.lastIndexOf( '?' ) );
                        this.copyFileToLocalDir( correctPath, currentName, this.createFileName() );
                        // this.uploadImage();
                    } );
            }
            else {
                var currentName = imagePath.substr( imagePath.lastIndexOf( '/' ) + 1 );
                var correctPath = imagePath.substr( 0, imagePath.lastIndexOf( '/' ) + 1 );
                this.copyFileToLocalDir( correctPath, currentName, this.createFileName() );
                // this.uploadImage();

            }
          }, ( err ) => {
              console.log(err)
              this.commonservice.presentToast( 'Error while selecting image.','' );
          })

        }

        // Create a new name for the image
        private createFileName() {
            var d = new Date(),
                n = d.getTime(),
                newFileName = n + ".jpg";
            return newFileName;
        }

        // Copy the image to a local folder
        private copyFileToLocalDir( namePath, currentName, newFileName ) {
          console.log("#### copyFileToLocalDir ####");
          console.log("namePath/correctPath : "+namePath);
          console.log("currentName : "+currentName);
          console.log("createdFileName : "+newFileName);
          console.log("Directory : "+cordova.file.dataDirectory);
            this.file.copyFile( namePath, currentName, cordova.file.dataDirectory, newFileName ).then( success => {
              // console.log("#### copyFile -- Success ####");
              // console.log(success);
              //   this.lastImage = newFileName;
              //   var targetPath = this.pathForImage( newFileName );
              //   this.targetPaths.push( targetPath );
              //   this.filenames.push( this.lastImage );
              //   this.loader.dismiss();
              //   console.log(targetPath);
              //   console.log(this.filenames);
              //   this.navCtrl.push(EditorPage,{"images":targetPath,"design_no":this.design_no})
              var orientation = -1;

              this.imageCompress.compressFile(this.pathForImage(newFileName), orientation, 100, 100).then(async result=>{

                this.writeFile(result,this.createFileName());

              },err=>{
                console.log(err)

              });

            }, error => {
                this.commonservice.presentToast( 'Error while storing file.','' );
            } );
        }

        // Always get the accurate path to your apps folder
        public pathForImage( img ) {
          if ( img === null ) {
              return '';
          } else {
              return cordova.file.dataDirectory + img;
          }
        }
         //here is the method is used to write a file in storage
 writeFile(base64Data: any, fileName: any) {
    let contentType = this.getContentType(base64Data);
    let DataBlob = this.base64toBlob(base64Data, contentType);
    // here iam mentioned this line this.file.externalRootDirectory is a native pre-defined file path storage. You can change a file path whatever pre-defined method.
    var filePath = cordova.file.dataDirectory;

    this.file.writeFile(filePath, fileName, DataBlob, contentType).then((success) => {
        console.log(success['nativeURL'])
        var currentName = success['nativeURL'].substr(success['nativeURL'].lastIndexOf('/') + 1);
        var correctPath = success['nativeURL'].substr(0, success['nativeURL'].lastIndexOf('/') + 1);

        console.log("File Writed Successfully", success);
        console.log(currentName)
        console.log(correctPath)

          console.log("#### copyFile -- Success ####");
          console.log(success);
            this.lastImage = currentName;
            var targetPath = this.pathForImage( currentName );
            this.targetPaths.push( targetPath );
            this.filenames.push( this.lastImage );
            this.loader.dismiss();
            console.log(targetPath);
            console.log(this.filenames);
            this.loader.dismiss();

            this.navCtrl.push(EditorPage,{"images":targetPath,'productdet':this.productdet})



    }).catch((err) => {
        console.log("Error Occured While Writing File", err);
    })
  }

  //here is the method is used to get content type of an bas64 data
  public getContentType(base64Data: any) {
    let block = base64Data.split(";");
    let contentType = block[0].split(":")[1];
    return contentType;
  }

  //here is the method is used to convert base64 data to blob data
  public base64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    let byteCharacters =  atob(b64Data.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);
        let byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    let blob = new Blob(byteArrays, {
        type: contentType
    });
    return blob;
  }

  rec(){


let options: CaptureVideoOptions = {
  limit: 1,
  duration: 20,
}
this.loader = this.loadingCtrl.create( {
      content: "Fetching...",
      spinner: 'bubbles',
  } );
  this.loader.present();

  this.mediaCapture.captureVideo(options)
  .then( async (videoUrl) => {
    if (videoUrl) {
      console.log(videoUrl)
      setTimeout(async() => {
        console.log('outttt')
        this.loader.dismiss();
      this.recordVideo( this.camera.PictureSourceType.PHOTOLIBRARY );

        // this.loader = this.loadingCtrl.create( {
        //     content: "Fetching...",
        //     spinner: 'bubbles',
        // } );
        // this.loader.present();

    //   var filename = videoUrl[0]['fullPath'].substr(videoUrl[0]['fullPath'].lastIndexOf('/') + 1);
    //   var dirpath = videoUrl[0]['fullPath'].substr(0, videoUrl[0]['fullPath'].lastIndexOf('/') + 1);

    //   dirpath = dirpath.includes("file://") ? dirpath : "file://" + dirpath;

    //   try {
    //     var dirUrl = await this.file.resolveDirectoryUrl(dirpath);
    //     var retrievedFile = await this.file.getFile(dirUrl, filename, {});

    //   } catch(err) {
    //     console.log(err);
    //     this.loader.dismiss();
    //     return this.presentAlert("Error","Something went wrong.");
    //   }
    //   retrievedFile.file( data => {
    //     this.loader.dismiss();
    //     if (data.size > this.MAX_FILE_SIZE) return this.presentAlert("Error", `You cannot upload more than 5mb.`);
    //     if (data.type !== this.ALLOWED_MIME_TYPE) return this.presentAlert("Error", "Upload mp4 file type only.");

    //     this.selectedVideo = retrievedFile.nativeURL;
    //     console.log(this.selectedVideo)
    //     this.selectedVideo = decodeURIComponent(this.selectedVideo);
    //     console.log(this.selectedVideo)

    //     var currentName = this.selectedVideo.substr( this.selectedVideo.lastIndexOf( '/' ) + 1 );
    //     var correctPath = this.selectedVideo.substr( 0, this.selectedVideo.lastIndexOf( '/' ) + 1 );
    //     let type = this.selectedVideo.substr( this.selectedVideo.lastIndexOf( '.' ) + 1);
    //     console.log(currentName)
    //     console.log(correctPath)

    //     this.copyvideoToLocalDir( correctPath, currentName, this.createvideoName(),data,data.size,type );
    // });
  }, 2000);

  }
},
(err) => {
  this.loader.dismiss();
  console.log(err);
});


  }
     recordVideo(source) {
      const options: CameraOptions = {
        mediaType: this.camera.MediaType.VIDEO,
        sourceType: source
      }
      this.camera.getPicture(options)
      .then( async (videoUrl) => {
        if (videoUrl) {
            this.loader = this.loadingCtrl.create( {
                content: "Fetching...",
                spinner: 'bubbles',
            } );
            this.loader.present();

          var filename = videoUrl.substr(videoUrl.lastIndexOf('/') + 1);
          var dirpath = videoUrl.substr(0, videoUrl.lastIndexOf('/') + 1);

          dirpath = dirpath.includes("file://") ? dirpath : "file://" + dirpath;

          try {
            var dirUrl = await this.file.resolveDirectoryUrl(dirpath);
            var retrievedFile = await this.file.getFile(dirUrl, filename, {});

          } catch(err) {
            console.log(err);
            this.loader.dismiss();
            return this.presentAlert("Error","Something went wrong.");
          }
          retrievedFile.file( data => {
            this.loader.dismiss();
            if (data.size > this.MAX_FILE_SIZE) return this.presentAlert("Error", `You cannot upload more than 60mb.`);
            if (data.type !== this.ALLOWED_MIME_TYPE) return this.presentAlert("Error", "Upload mp4 file type only.");

            this.selectedVideo = retrievedFile.nativeURL;
            console.log(this.selectedVideo)
            this.selectedVideo = decodeURIComponent(this.selectedVideo);
            console.log(this.selectedVideo)

            var currentName = this.selectedVideo.substr( this.selectedVideo.lastIndexOf( '/' ) + 1 );
            var correctPath = this.selectedVideo.substr( 0, this.selectedVideo.lastIndexOf( '/' ) + 1 );
            let type = this.selectedVideo.substr( this.selectedVideo.lastIndexOf( '.' ) + 1);

            this.copyvideoToLocalDir( correctPath, currentName, this.createvideoName(),data,data.size,type );
        });
      }
    },
    (err) => {
      console.log(err);
    });
    }
    // selectVideo(){

    //   // choose your file from the device
    // this.fileChooser.open().then(uri => {
    //     this.loader = this.loadingCtrl.create( {
    //         content: "Fetching...",
    //         spinner: 'bubbles',
    //     } );
    //     this.loader.present();
    // console.log(111111111111)
    // console.log(uri)

    //   this.filePath.resolveNativePath(uri)
    //   .then(async(file) => {
    //     console.log(666666666666)

    //     console.log(file)

    //     var currentName = file.substr( file.lastIndexOf( '/' ) + 1 );
    //     var correctPath:any = file.substr( 0, file.lastIndexOf( '/' ) + 1 );
    //     let type =file.substr(file.lastIndexOf( '.' ) + 1);

    //     var filename = file.substr(file.lastIndexOf('/') + 1);
    //     var dirpath = file.substr(0, file.lastIndexOf('/') + 1);
    //     console.log(7777777777)

    //     console.log(dirpath)

    //     dirpath = dirpath.includes("file://") ? dirpath : "file://" + dirpath;

    //     try {
    //       var dirUrl = await this.file.resolveDirectoryUrl(dirpath);
    //       var retrievedFile = await this.file.getFile(dirUrl, filename, {});

    //     } catch(err) {
    //       console.log(888888888888)

    //       console.log(err)
    //       this.loader.dismiss();
    //       return this.presentAlert("Error","Please Choose File from File Explorer.");
    //     }
    //     retrievedFile.file( data => {
    //       console.log(999999999999)
    //       this.loader.dismiss();

    //       console.log(data)
    //       console.log(retrievedFile.nativeURL)

    //       if (data.size > this.MAX_FILE_SIZE) {
    //         this.loader.dismiss();
    //       }
    //       if (data.size > this.MAX_FILE_SIZE)  return this.presentAlert("Error", `You cannot upload more than 5mb.`);
    //       // this.selectedVideo = retrievedFile.nativeURL;

    //       if((type == 'mp4')){
    //         console.log(file)
    //         this.copyvideoToLocalDir( correctPath, currentName, this.createvideoName(),data,data.size,type );


    //       }
    //       else{
    //         this.loader.dismiss();
    //         let toast = this.toastCtrl.create( {
    //           message: 'Wrong File format',
    //           duration: 2000,
    //           position: "bottom"
    //       } );
    //       toast.present( toast );
    //       }

    //     });


    // })
    // .catch(err=>{
    //   this.loader.dismiss();
    //   let toast = this.toastCtrl.create( {
    //     message: 'Please Choose File from File Explorer',
    //     duration: 2000,
    //     position: "bottom"
    // } );
    // toast.present( toast );
    // console.log('000000000000')

    // console.log(err)

    // });

    // })
    // .catch(err=>{
    //   this.loader.dismiss();

    //   console.log(10101010110)

    //   console.log(err)
    // });
    // }
    public pathForvideo( img ) {
      if ( img === null ) {
          return '';
      } else {
          return cordova.file.dataDirectory + img;
      }
      }
      // Create a new name for the image
      private createvideoName() {
      var d = new Date(),
          n = d.getTime(),
          newFileName = n + ".mp4";
      return newFileName;
      }

      // Copy the image to a local folder
      private copyvideoToLocalDir( namePath, currentName, newFileName,data ,size,type) {

      this.file.copyFile( namePath, currentName, cordova.file.dataDirectory, newFileName ).then( success => {

        console.log(this.pathForvideo(newFileName))

        this.vidtargetPaths.push( this.pathForvideo(newFileName) );
        this.vidfilenames.push( newFileName );
        this.productdet['sample_videos'] = this.vidfilenames;

        this.uploadvideo(this.pathForvideo(newFileName),newFileName);
      }, error => {
        let toast = this.toastCtrl.create({
          message: 'Rename file and try again' ,
          duration: 3000,
          position: 'bottom'
          });
          toast.present();
          this.loader.dismiss();
          console.log( 'Error while storing file.' );
          console.log( error );

      } );
      }
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    presentAlert(title, message) {
        let alert = this.alertCtrl.create({
          title: title,
          subTitle: message,
          buttons: ['Dismiss']
        });
        alert.present();
      }
      checkstock(id){


        let empData = JSON.parse(localStorage.getItem('empDetail'));

        this.ids = id;
        this.commonservice.checkstock({'id_branch': empData['id_branch'],'id_weight':this.idw ,'id_size':id ,'id_category':  this.productdet['product_id'],'id_product':  this.productdet['product_id'],"design_no" :  this.productdet['design_id'],'id_sub_design': this.productdet['id_sub_design']}).then(result => {

          this.productdet['is_stock_avail'] = result['avail_pcs'];
          this.productdet['Status'] = result['avail_pcs'] > 0 ? 'OPEN' : 'CLOSE';

        });
      }
        checkwgstock(id){

          let ind = this.productdet.weights.findIndex(data=>data['id_weight'] == id);

          console.log(ind);
          this.productdet['purities'] = this.productdet.weights[ind]['purities'];
          this.productdet['sizes'] = this.productdet.weights[ind]['sizes'];

          this.productdet['mc_type'] = this.productdet.weights[ind]['mc_type'];
          this.productdet['mc_value'] = this.productdet.weights[ind]['mc_value'];

		  this.productdet['smith_due_date'] = this.productdet.weights[ind]['smith_due_date'];
          this.productdet['wastage'] = this.productdet.weights[ind]['wastage'];
          this.productdet['retail_max_wastage_percent'] = this.productdet.weights[ind]['wastage'];

		     this.productdet['calculation_based_on'] = this.productdet.weights[ind]['calculation_based_on'];

		            this.productdet['display_duration'] = this.productdet.weights[ind]['display_duration'];
          this.productdet['display_va'] = this.productdet.weights[ind]['display_va'];

		  this.productdet['to_weight'] = this.productdet.weights[ind]['to_weight'];
          this.productdet['from_weight'] = this.productdet.weights[ind]['from_weight'];

          let empData = JSON.parse(localStorage.getItem('empDetail'));

          this.idw = id;

          this.productdet['net_wt'] = this.productdet.weights[ind]['weight_value'];
          this.productdet['gross_wt'] = this.productdet.weights[ind]['weight_value'];
          this.productdet['weight'] = this.productdet.weights[ind]['weight_value'];


          this.commonservice.checkwgstock({'id_branch': empData['id_branch'],'id_size':this.ids , 'id_weight':id,'id_category':  this.productdet['product_id'],'id_product':  this.productdet['product_id'],"design_no" :  this.productdet['design_id'],'id_sub_design': this.productdet['id_sub_design']}).then(result => {

            this.productdet['is_stock_avail'] = result['avail_pcs'];
            this.productdet['Status'] = result['avail_pcs'] > 0 ? 'OPEN' : 'CLOSE';
          });
      }
      setPurity(data,name,whole){
        this.productdet['id_purity'] = data;
        this.purityname = name;
        this.productdet['metal_type'] = whole.rate_field;
          this.productdet['market_metal_type'] = whole.market_rate_field;
          this.calculate('');
      }

      // Sample image
      deletevideo( index ) {
      let confirm = this.alertCtrl.create( {
          title: 'Do you want to delete the video?',
          message: '',
          buttons: [
              {
                  text: 'No',
                  handler: () => {
                      console.log( 'Disagree clicked' );
                  }
              }, {
                  text: 'Yes',
                  handler: () => {
                      console.log( 'Agree clicked' );
                      this.vidtargetPaths.splice( index, 1 );
                      this.vidfilenames.splice( index, 1 );
                  }
              }
          ]
      } );
      confirm.present();
  }
// Sample image
    deletePhoto( index ) {
      let confirm = this.alertCtrl.create( {
          title: 'Do you want to delete the image?',
          message: '',
          buttons: [
              {
                  text: 'No',
                  handler: () => {
                      console.log( 'Disagree clicked' );
                  }
              }, {
                  text: 'Yes',
                  handler: () => {
                      console.log( 'Agree clicked' );
                      this.targetPaths.splice( index, 1 );
                      this.filenames.splice( index, 1 );
            this.productdet['targetPaths'] = this.targetPaths;
            this.productdet['sample_images'] = this.filenames;
                      // this.deletephotos.push(this.filenames[index])
                      // this.lastImage == '';
                  }
              }
          ]
      } );
      confirm.present();
  }
  addWishlist(item){

    this.retail.addToWishlist(data=>{

    })
  }


  public uploadvideo(path,name) {

    // let loader = this.load.create( {
    //   content: "Uploading..."
    // } );
    // loader.present();
    this.show = true;

      // Destination URL
      var url = BaseAPIURL+'admin_app_api/uploadvideo';
      var d = new Date(),
      n = d.getTime()
    // File for Upload
    let empData = JSON.parse(localStorage.getItem('empDetail'));

    // File name only
    var filename = name;
    var options = {
      fileKey: "name",
      fileName: name,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: {
        fileName: name,
        id_supp_catalogue:this.productdet['id_supp_catalogue'],
        branch_id:empData['id_branch'],
        created_by:empData['uid'],
      }
    };




    const fileTransfer: TransferObject = this.transfer.create();



    console.log(path)
    console.log(name)

    console.log(encodeURI(url))
    console.log(options)
    console.log(url)

    // Use the FileTransfer to upload the image
    fileTransfer.upload( path, encodeURI(url), options ).then(( data ) => {
      console.log(data);

      let result = JSON.parse( data.response );
      console.log(result);
      console.log(result['imageid'])

      let toastMsg = this.toastCtrl.create({
        message: "Video succesfully uploaded.",
        duration: this.commonservice.toastTimeout,
        position: 'center'
      });
      toastMsg.present();
      this.show = false;

    }, err => {
      // loader.dismissAll()
      console.log(err);
       let toastMsg = this.toastCtrl.create({
        message: "Error while uploading Video.",
        duration: this.commonservice.toastTimeout,
        position: 'center'
      });
      toastMsg.present();
      this.show = false;

    } );

    fileTransfer.onProgress((data) => {
      console.log(data)

      this.progress = Math.round((data.loaded/data.total) * 100) ;
      this.refresh();
      console.log(this.progress)

    });
// },err=>{
//   console.log(err);
// });

  }
  refresh() {
    console.log('refresheed')
    this.cd.detectChanges();
  }


  addWishlistw(item){


    let empData = JSON.parse(localStorage.getItem('empDetail'));

      let modal = this.modal.create(CusSearchPage,{'show':'true'})
      modal.present();
      modal.onDidDismiss(mData => {
        console.log(mData)
        if(mData != null){
          // this.idcus = mData['id_customer'];

          let loader = this.loadingCtrl.create({
            content: 'Please Wait',
            spinner: 'bubbles',
          });
          loader.present();

          this.retail.addToWishlist(
            {
              "customer_name" : mData['firstname'],
              "mobile"          : mData['mobile'],
              "customer_id"     : mData['id_customer'],
              "id_sub_design"   : item['id_sub_design'],
              "product_id"      : item['product_id'],
              "design_id"         : item['design_id'],
              "branch_id"       : empData['id_branch'],
              "employee_id"     : empData['uid'],
              'id_supp_catalogue':item['id_supp_catalogue']
          }).then(data=>{


            let toastMsg = this.toastCtrl.create({
              message: data.msg,
              duration: this.commonservice.toastTimeout,
              position: 'middle'
            });
            toastMsg.present();

            loader.dismiss();

          },err=>{
            let toastMsg = this.toastCtrl.create({
              message: "try again",
              duration: this.commonservice.toastTimeout,
              position: 'middle'
            });
            toastMsg.present();
            loader.dismiss();

          })
        }else{

        }
      });



  }

  slide(){

    console.log(this.slides.getActiveIndex())
    this.productdet = this.slidess.length - 1 < this.slides.getActiveIndex() ?  this.slidess[this.slides.getActiveIndex() - 1] : this.slidess[this.slides.getActiveIndex()] ;
    console.log(this.productdet)
    this.slideimg  = this.productdet['TagImage'];
    this.productdet['net_wt'] = this.productdet['NetWt'];
    this.productdet['gross_wt'] = this.productdet['GrossWt'];

    this.productdet['metal_type'] = this.productdet['rate_field'];
    this.productdet['market_metal_type'] = this.productdet['market_rate_field'];
    this.productdet['tax_group_id'] = this.productdet['tgrp_id'];

    this.calculate('');

        this.cd.detectChanges();
  }
    // Stone Details
  addStone(){

    let gross:any = 0;


      gross =  this.productdet['weight'];
console.log(this.stone_details)
    let modal = this.modal.create(Addstone2Page,{"stoneMasData":this.stoneMasData, "action":"add" , "stone_details":this.stone_details,"ptype":'home_bill','gross':gross,'stoneMasTypes':this.stoneMasTypes });
    modal.present();
    modal.onDidDismiss(data => {
      if(data != null){

        this.stone_details  = data;
        console.log(this.stone_details)

        let stData = this.calcStoneDetail();
      this.productdet['stone_wt'] = stData['stone_wt'];
      this.productdet['stone_price'] = stData['stone_price'];
      this.productdet['stone_details'] = this.stone_details;

       if(this.stone_details.length != 0){
         this.productdet['less_wt'] = this.retail.setAsNumber(stData['stone_wt']);

         this.productdet['net_wt']    = this.productdet['weight'] - this.productdet['less_wt'];

         this.productdet['net_wt']    = this.retail.setAsNumber(this.productdet['net_wt']).toFixed(3);

           this.productdet['actual_net_wt']    = this.productdet['net_wt'];
           this.calculate('');

       }

      }
    });

  }

  calcStoneDetail(){
    // if(this.item_type == 'tag'){

      // let data = {"wt" : 0, "amount" : 0};
      // this.stone_details.forEach( (i,index) => {
      //   if(this.stone_details[index]['lwt']){
      //     this.stone_details[index]['is_apply_in_lwt'] = 1;
      //     data['wt']   = data['wt'] + (i['uom_id'] == '2' ? Number(i['wt']) / 5 : Number(i['wt']));
      //   }else{
      //     this.stone_details[index]['is_apply_in_lwt'] = 0;
      //   }
      //   data['amount'] = data['amount'] + Number(i['amount']);
      // })
      // return data;
    // }
    // else{
    let data = {"stone_wt" : 0, "stone_price" : 0};
    this.stone_details.forEach( (i,index) => {
      if(this.stone_details[index]['lwt']){
        this.stone_details[index]['is_apply_in_lwt'] = 1;

      // data['stone_wt']   = data['stone_wt'] + Number(i['stone_wt']);
      data['stone_wt']   = data['stone_wt'] + (i['uom_id'] == '6' ? Number(i['stone_wt']) / 5 : Number(i['stone_wt']));

      }
      else{
        this.stone_details[index]['is_apply_in_lwt'] = 0;
      }
      data['stone_price'] = data['stone_price'] + Number(i['stone_price']);
    })
    return data;
  }
  setimg(img,ind){

    this.slideimg  =img;

    console.log(this.slideimg)
  }
  checkcode(){

    let temp:any[] = this.productdet['allcharges'].filter(data=>data['id_charge'] == this.productdet['id_charge']);
    this.productdet['chargecode'] = temp[0]['code_charge'];
    this.productdet['charge_value'] = temp[0]['value_charge'];
	    this.productdet['id_charge'] = temp[0]['id_charge'];
			    this.productdet['charges'] = temp;


  }
  // }
  addcharge(){


    let modal = this.modal.create(ChargesPage,{"stoneMasData":this.stoneMasData, "action":"add" , "stone_details":this.charges,"ptype":'pro','gross':'' });
    modal.present();
    modal.onDidDismiss(data => {
      if(data != null){

        this.charges  = data;

      this.productdet['charges'] = this.charges;

       if(this.charges.length != 0){
        this.productdet['charge_value'] = 0;

    this.charges.forEach(tag => {

      this.productdet['charge_value'] = Number(this.productdet['charge_value']) + Number(tag.charge_value);
    })
    this.calculate('');

       }

      }
    });

  }

  calculate(changedInput){

    console.log(this.stone_details)
    // if(this.stone_details.length == 0){
// console.log(this.productdet['less_wt'],'oooooooooooo');

this.productdet['gross_wt'] = this.productdet['weight'] 
      // this.productdet['net_wt']    = this.productdet['weight'] - this.productdet['less_wt'];
      // console.log(this.productdet['net_wt']);
      // this.productdet['less_wt'] = this.productdet['weight']

    //}
    if(changedInput == 'wastage_wt'){

      let wast_percent= parseFloat((((this.retail.setAsNumber(this.productdet['wast_wgt']))*100)/this.retail.setAsNumber(this.productdet['net_wt'])).toFixed(3));
      this.productdet['retail_max_wastage_percent']  = wast_percent;

    }
    let detail = {itemData : this.productdet, metalRate : this.metalRate, tax_details : this.taxGroupItems, item_type : 'tag'};
    console.log(detail,'99999999');
    

    console.log('*******',this.retail.calculateSaleValue(detail))
    let data = this.retail.calculateSaleValue(detail);
    this.productdet['taxable'] = data['taxable'];
    this.productdet['sales_value'] = data['sales_value'];
    }


    calculatecus(){

      this.productdet['metalratec'] = 'true';

      console.log(this.stone_details)
      if(this.stone_details.length == 0){

        this.productdet['net_wt']    = this.productdet['weight'] - this.productdet['less_wt'];
        console.log(this.productdet['net_wt']);

      }

      let detail = {itemData : this.productdet, metalRate : this.metalRate, tax_details : this.taxGroupItems, item_type : 'tag'};

      console.log('*******',this.retail.calculateSaleValue(detail))
      let data = this.retail.calculateSaleValue(detail);
      this.productdet['taxable'] = data['taxable'];
      this.productdet['sales_value'] = data['sales_value'];
      }

       // naveen
       openEmpModal(){
        let modal = this.modal.create(EmpSearchPage,{"empData" : this.employees})
        modal.present();
        modal.onDidDismiss(data => {
          if(data != null){

          this.productdet['empname'] = data.emp_name;
          this.productdet['id_employee']  = data.id_employee;
          }
        });
        }

        radio_option(data:any){
          console.log(data,'options');

        }

        open(data){

          console.log(data);

          this.fileOpener.open(data, 'image/jpg')
          .then(() => console.log('File is opened'))
          .catch(e => console.log('Error opening file', e));

        }

}
