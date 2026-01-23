import { Component, trigger, state, style, transition, animate, keyframes,ViewChild, ElementRef,ChangeDetectorRef } from '@angular/core';
import { ModalController,IonicPage,Content, Events, NavController, NavParams, LoadingController, ToastController, Platform, ActionSheetController, Loading, AlertController } from 'ionic-angular';
import { CollectionPage } from '../../pages/collection/collection';
import { Toast } from '@ionic-native/toast';
import { CommonProvider, BaseAPIURL } from '../../providers/common';


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
import { AddStoneDetailPage } from '../modal/add-stone-detail/add-stone-detail';
import { Addstone2Page } from '../addstone2/addstone2';
import { ChargesPage } from '../charges/charges';

import { FileOpener } from '@ionic-native/file-opener';
import { EstiPage } from '../estimation/estimation';
import { RetailProvider } from '../../providers/retail';


/**
 * Generated class for the CartListViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-cart-list-view',
  templateUrl: 'cart-list-view.html',
  providers: [CommonProvider,RetailProvider],
})
export class CartListViewPage  {

  @ViewChild(Content) content: Content;
  fileTransfer: FileTransferObject = this.transfer.create();

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
productdet:any =  this.navParams.get( 'data' );
productdetarr:any =  this.navParams.get( 'single' );

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
stoneMasData:any[] = [] ;
stone_details:any[] = [] ;

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
esti = {"choose":'',"cus_id": "", "customer" : "", "id_branch" : "", "id_employee" : "", "emp_name" : "","is_tag": false, "is_non_tag": false, "is_home_bill": false, "is_old_metal": false, "tag":[], "non_tag":[], "home_bill":[], "old_metal":[],"chit_details":[{'slip_no':'','slip_amt':''}]};

tot_purch_wgt = 0;
tot_purch_rate = 0;
tot_sale_wgt = 0;
tot_sale_rate = 0;
tot_charge = 0;

total_esti_value = 0;

advance = 0;
tot_gift_rate = 0;
dates = [];
tot_incen = 0;
slideimg : any
metalRate:any;
taxGroupItems:any;
stone:any

constructor(private fileOpener: FileOpener,public modal:ModalController,public retail:RetailProvider,private mediaCapture: MediaCapture,public fileChooser:FileChooser,public filePath:FilePath,public imageCompress: NgxImageCompressService,public cd:ChangeDetectorRef,public sanitizer: DomSanitizer, private commonservice: CommonProvider,public navCtrl: NavController, public platform: Platform, public navParams: NavParams, private loadingCtrl: LoadingController, private toastCtrl: ToastController, private event: Events, private toast: Toast, public actionSheetCtrl: ActionSheetController, private camera: Camera, public transfer: FileTransfer, private file: File, public http: Http, private alertCtrl: AlertController ) {
// let data1 = this.navParams.get( 'item' );
// console.log(data1,'hhhhhhhhhhhhh');

console.log(this.productdet,'uuuuuuuuuuuu');


// this.get_group_item()

}

get_group_item(){
  this.retail.getAllTaxGroupItems().then(data=>{
    this.taxGroupItems = data;
    console.log( this.taxGroupItems,'jjjjjjjjj');

    this.event.publish('taxGroup:loaded', true);

    this.commonservice.getCurrencyAndSettings({"id_metalrates":this.esti['choose'],"id_branch":this.esti['id_branch']}).then(data=>{


      this.metalRate = data.metal_rates;
      console.log( this.metalRate,'kkkkkkkkkkk');

      this.calculate();

    });
  });

}



price(data){

  let temp1:any = parseFloat(data).toFixed();

  return temp1;

}

fixprice(data){
console.log(data,'pppppppp');

  let temp1:any = parseFloat(data).toFixed(3);
  return temp1;

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




  calculate(){

    let detail = {itemData : this.productdet, metalRate : this.metalRate, tax_details : this.taxGroupItems, item_type : 'tag'};

    console.log(detail,'kkkkkkkkkkk');

    console.log('*******',this.retail.calculateSaleValue(detail))
    let data = this.retail.calculateSaleValue(detail);
    console.log(data,'uuuuuuuuuuuu');

    this.productdet['taxable'] = data['taxable'];
    this.productdet['sales_value'] = data['sales_value'];
    this.productdet['rate_per'] = data['rate_per'];

  }

}
