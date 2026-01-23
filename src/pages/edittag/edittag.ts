import { Component, Pipe, PipeTransform, trigger, state, style, transition, animate, keyframes, ElementRef ,ViewChild,ChangeDetectorRef   } from '@angular/core';
import { AlertController,NavController, Events, LoadingController, ToastController, ModalController, Platform, NavParams,ActionSheetController   } from 'ionic-angular';
import { DecimalPipe } from '@angular/common';
// import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { Printer, PrintOptions } from '@ionic-native/printer';
import { CommonProvider,BaseAPIURL } from '../../providers/common';
import { RetailProvider } from '../../providers/retail';
import { AddEstiItemPage } from '../modal/add-esti-item/add-esti-item';
import { EstiBasicDetailPage } from '../modal/esti-basic-detail/esti-basic-detail';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { HomePage } from '../home/home';
import { RatioCrop, RatioCropOptions } from 'ionic-cordova-plugin-ratio-crop';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import {NgxImageCompressService} from 'ngx-image-compress';
import { ImagePicker } from '@ionic-native/image-picker';

/*
  Generated class for the Estimation page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

declare var cordova: any;


@Component({
  selector: 'page-edittag',
  templateUrl: 'edittag.html',
  providers: [CommonProvider, RetailProvider]

})

export class EdittagPage {
  fileTransfer: FileTransferObject = this.transfer.create();
  empData = JSON.parse(localStorage.getItem('empDetail'));
  esti_type = 'tag';
  page_type = "create";
  branches = [];
  employees = [];
  askBranch = 0;
  selectedCusData = [];
  nonTagStock = [];
  homeBillStock:any;
  metalRate:any;
  taxGroupItems:any;
  settings = [];
  ret_settings = [];
  tagMsg = "";
  tagErrorMsg = "";
  scannerOn = false;
  scanSub:any;
  ntMsg = "";
  ntErrorMsg = "";
  hbMsg = "";
  hbErrorMsg = "";
  purities = [];
  collections = [];
  omErrorMsg = "";
  ombMsg = "";
  oldMetalCat = [];
  stoneMasData = [];
  esti = {"cus_id": "", "customer" : "", "id_branch" : "", "id_employee" : "", "emp_name" : "","is_tag": false, "is_non_tag": false, "is_home_bill": false, "is_old_metal": false, "tag":[], "non_tag":[], "home_bill":[], "old_metal":[]};
  tot_purch_wgt = 0;
  tot_purch_rate = 0;
  tot_sale_wgt = 0;
  tot_sale_rate = 0;
  total_esti_value = 0;
  oldMetalTypes = [];
  estiDetail = {};
  dataCheckList  = {"empData" : false, "taxGroup" : false, "branch" : false, "settings" : false};
  loggedInBranch :any;
  tagData = {"tag_code":"","is_partial":0,"stone_details":[]};
  loader: any;
  progress:any= 0;
  show = false;

  public targetPaths = [];
  public filenames = [];
  images:any[] = [];
  image:any = '';
  imagename:any = '';
  whole : any;

  constructor(public alertCtrl:AlertController,private imagePicker: ImagePicker,public cd:ChangeDetectorRef,public imageCompress: NgxImageCompressService,private barcodeScanner: BarcodeScanner,private transfer1: Transfer,public crop:RatioCrop,public camera:Camera,public actionSheetCtrl:ActionSheetController,public navParams: NavParams, private navCtrl: NavController, public load:LoadingController, private printer : Printer, private nav: NavController, private events: Events, private commonservice: CommonProvider, public retail:RetailProvider, private toast: ToastController, private event: Events, public modal: ModalController, public common: CommonProvider,private fileOpener: FileOpener,private transfer: FileTransfer,public file:File,private filePath: FilePath, private fileChooser: FileChooser,public  platform: Platform) {
    this.nav = nav;
    this.page_type = this.navParams.get('page_type');
    this.loggedInBranch = this.empData['id_branch'];
    this.esti['id_log'] = this.empData['id_log'];
    /*this.retail.getHomeStock({"type":"all", "searchTxt":"", "searchField":"", "id_branch":this.esti['id_branch']}).then(data=>{
      this.homeBillStock = data;
    })*/
  }

  ionViewDidLoad() {
      // let loader = this.load.create({
      //   content: 'Please Wait',
      //   spinner: 'bubbles',
      // });
      // loader.present();
      // let loader2 = this.load.create({
      //   content: 'Please Wait',
      //   spinner: 'bubbles',
      // });
      // loader2.present();
      // let loader3 = this.load.create({
      //   content: 'Please Wait',
      //   spinner: 'bubbles',
      // });
      // loader3.present();
      let loader4 = this.load.create({
        content: 'Please Wait',
        spinner: 'bubbles',
      });
      loader4.present();


      this.retail.getAllTaxGroupItems().then(data=>{
        this.taxGroupItems = data;
        this.events.publish('taxGroup:loaded', true);
        this.dataCheckList['taxGroup'] = true;
        this.common.getCurrencyAndSettings({"id_branch":this.esti['id_branch']}).then(data=>{
          this.metalRate = data.metal_rates;
          this.settings = data.settings;
          this.ret_settings = data.ret_settings;
          this.events.publish('settings:loaded', true);
          this.events.publish('ret_settings:loaded', true);
          this.dataCheckList['settings'] = true;
          loader4.dismiss();
        })
      })


      // if((this.loggedInBranch == 0 || this.loggedInBranch == '' || this.loggedInBranch == null) && this.empData['branch_settings'] == 1){
      //   this.askBranch = 1;
      //   this.common.getbranch().then(data=>{
      //     this.branches = data;
      //     this.events.publish('branch:loaded', true);
      //     this.dataCheckList['branch'] = true;
      //     loader.dismiss();
      //   })
      // }else{
      //   this.esti['id_branch'] = this.loggedInBranch;
      //   this.estiDetail['id_branch'] = this.loggedInBranch;
      //   this.events.publish('branch:loaded', true);
      //   this.dataCheckList['branch'] = true;
      //   loader.dismiss();
      // }

      // this.common.getBranchEmployees(this.empData['id_branch']).then(data=>{
      //   this.employees = data;
      //   this.openEstiBasicDetailModal();
      //   this.events.publish('empData:loaded', true);
      //   this.dataCheckList['empData'] = true;
      //   loader2.dismiss();
      // })
      // this.retail.getAllTaxGroupItems().then(data=>{
      //   this.taxGroupItems = data;
      //   this.events.publish('taxGroup:loaded', true);
      //   this.dataCheckList['taxGroup'] = true;
      //   loader3.dismiss();
      // })
      // this.common.getCurrencyAndSettings({"id_branch":this.esti['id_branch']}).then(data=>{
      //   this.metalRate = data.metal_rates;
      //   this.settings = data.settings;
      //   this.ret_settings = data.ret_settings;
      //   this.events.publish('settings:loaded', true);
      //   this.events.publish('ret_settings:loaded', true);
      //   this.dataCheckList['settings'] = true;
      //   loader4.dismiss();
      // })

  }

  /* for footer as hide in default. it's assigned in app.components.ts */
  ionViewWillLeave(){
    this.events.publish( 'entered', false );

    }
  ionViewWillEnter(){

  this.events.publish( 'entered', true );
  this.events.publish( 'pageno', 1 );

  }

  estiTypeChanged(ev){
    let type = ev._value;
    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();
    if(type != 'tag' && type != 'summary'){
        if((this.stoneMasData).length == 0){
          this.retail.getAllStoneMaters({"id_branch":this.esti['id_branch']}).then(data=>{
            this.stoneMasData = data;
            loader.dismiss();
          })
        }
        if(type == 'non_tag'){
          this.retail.getNonTagItems({"id_branch":this.esti['id_branch']}).then(data=>{
            this.nonTagStock = data;
            loader.dismiss();
          })
        }
        else if(type == 'home_bill'){
          if( (this.purities).length == 0 ){ // Purities
            this.retail.getAllPurities("").then(data=>{
              this.purities = data;
              loader.dismiss();
            })
          }else{
            loader.dismiss();
          }
          if( (this.collections).length == 0 && this.ret_settings['collections_required'] == 1){  // Collections
            this.retail.getCollections({"type":"active", "last_id":-1}).then(data=>{
              this.collections = data;
              loader.dismiss();
            })
          }else{
            loader.dismiss();
          }
        }
        else if(type == 'old_metal'){
          this.retail.getOldMetalType().then(data=>{
            this.oldMetalTypes = data;
            loader.dismiss();
          })
        }else{
          loader.dismiss();
        }
    }else{
      loader.dismiss();
    }
    this.calcEstiSummary();
  }

  empSelected(){
    let emp = {"allowed_old_met_pur" : ""};
    this.employees.forEach(e => {
      if(this.esti['id_employee'] == e.id_employee){
        emp = e;
      }
    })
    if(emp.allowed_old_met_pur != ''){
      var categories = emp.allowed_old_met_pur;
      var catArr   = categories.split(",");
      catArr.forEach(cat => {
        var categoryArr = cat.split("-");
        this.oldMetalCat.push({"id_category" : categoryArr[0], "cat_name" : categoryArr[1]});
      })
    }
  }

  openEstiBasicDetailModal() {
    let data = { "askBranch" : this.askBranch, employees : this.employees, selectedCusData : this.selectedCusData, esti : this.esti, branches : this.branches};
    console.log(data);
    let modal = this.modal.create(EstiBasicDetailPage, data,{enableBackdropDismiss: false})
    modal.present();
    modal.onDidDismiss(data => {
      if(data != null){
        this.selectedCusData = data.selectedCusData;
        this.esti['cus_id'] = data.cus_id;
        this.esti['customer'] = data.customer;
        this.empSelected();
      }
    });
  }

  openItemAddModal(type,item,action) {
    let idx = -1;
    let estiData = [];
    if(action == 'edit'){
      estiData = item;
      idx = this.esti[type].indexOf(item);
    }
    let data = {type:type, action:action, ret_settings : this.ret_settings, esti : estiData, id_branch:this.esti['id_branch'], metal_rates:this.metalRate, taxGroupItems:this.taxGroupItems, nonTagStock:this.nonTagStock, homeBillStock : this.homeBillStock, purities : this.purities, collections : this.collections, oldMetalCat : this.oldMetalCat, stoneMasData : this.stoneMasData, oldMetalTypes : this.oldMetalTypes};
    console.log(data);
    let modal = this.modal.create(AddEstiItemPage,data,{enableBackdropDismiss: false})
    modal.present();
    modal.onDidDismiss(data => {
      if(data != null){
        if(data.item_data != null){
          // ADD
          if(action == 'add'){
            let addItem = true;
            if(type == "tag"){ // Tag Item
              this.esti[type].forEach(item => {
                  if(item.tag_id == data.item_data.tag_id){
                    addItem = false;
                    this.tagMsg = "";
                    this.tagErrorMsg = "Tag Already exist..";
                    setTimeout(()=>{
                      this.tagErrorMsg = "";
                    },this.common.msgTimeout);
                  }
              })
            }
            if(addItem){
              this.esti[type].push(data.item_data);
            }
          }
          // UPDATE
          if(action == 'edit' && idx >= 0){
            console.log(this.esti[type][idx]);
            this.esti[type][idx] = data.item_data;
            console.log(estiData);
          }

        }
        this.calcEstiSummary();
        if(data.submitType == 'SN'){ // Save and New
          this.openItemAddModal(type,'','add');
        }
      }
      else if(action == 'edit' && idx >= 0){
        console.log(estiData);
        this.esti[type][idx] = estiData;
      }
    });
  }

  calcEstiSummary(){
    console.log(this.esti);
    this.tot_sale_wgt = 0;
    this.tot_sale_rate = 0;
    this.tot_purch_wgt = 0;
    this.tot_purch_rate = 0;
    this.esti['tag'].forEach(tag => {
      this.tot_sale_wgt = Number(this.tot_sale_wgt) + Number(tag.net_wt);
      this.tot_sale_rate = Number(this.tot_sale_rate) + Number(tag.sales_value);
    })
    this.esti['non_tag'].forEach(non_tag => {
      this.tot_sale_wgt = Number(this.tot_sale_wgt) + Number(non_tag.net_wt);
      this.tot_sale_rate = Number(this.tot_sale_rate) + Number(non_tag.sales_value);
    })
    this.esti['home_bill'].forEach(home_bill => {
      this.tot_sale_wgt = Number(this.tot_sale_wgt) + Number(home_bill.net_wt);
      this.tot_sale_rate = Number(this.tot_sale_rate) + Number(home_bill.sales_value);
    })
    this.esti['old_metal'].forEach(old_metal => {
      this.tot_purch_wgt = Number(this.tot_purch_wgt) + Number(old_metal.net_wt);
      this.tot_purch_rate = Number(this.tot_purch_rate) + Number(old_metal.amount);
    })
    this.total_esti_value = Number(this.tot_sale_rate) - Number(this.tot_purch_rate);
  }

  /*openBarcodeScanner(){
    this.barcodeScanner.scan().then(barcodeData => {
      if(barcodeData){
        console.log(barcodeData);
        this.getTagByID(barcodeData);
      }
     }).catch(err => {
         console.log('Error', err);
     });
  }*/

  closeScanner(){
    this.scannerOn = false;
    // this.scanSub.unsubscribe();
    // this.qrScanner.hide().then();
    // this.qrScanner.destroy().then();
  }

  openQRScanner(){
    this.scannerOn = true;

    console.log("QR Scanner");
    this.barcodeScanner.scan().then((barcodeData) => {

      this.scannerOn = false;
            if(barcodeData['text'] != ''){
              this.getTagByID(barcodeData['text']);
            }
          },err=>{
            this.scannerOn = false;

            console.log(err)
          });
    // console.log("QR Scanner");
    // // Optionally request the permission early
    // this.qrScanner.prepare()
    // .then((status: QRScannerStatus) => {
    //   console.log("Then");
    //   if (status.authorized) {
    //     console.log("authorized");
    //     // start scanning
    //     this.scannerOn = true;
    //     this.qrScanner.show().then();
    //     this.scanSub = this.qrScanner.scan().subscribe((text: string) => {
    //       console.log('Scanned something', text);
    //       // Hide and unsubscribe from scanner
    //       this.qrScanner.hide().then();
    //       this.qrScanner.destroy().then();
    //       this.scanSub.unsubscribe();
    //       this.scannerOn = false;
    //       if(text != ''){
    //         this.getTagByID(text);
    //       }
    //     });
    //   }
    //   else if (status.denied) {
    //     console.log("camera permission was permanently denied");
    //     // camera permission was permanently denied
    //     // you must use QRScanner.openSettings() method to guide the user to the settings page
    //     // then they can grant the permission from there
    //     this.qrScanner.openSettings();
    //   }
    //   else {
    //     console.log("Camera Access permission denied. Kindly enable to Scan QR");
    //     // permission was denied, but not permanently. You can ask for permission again at a later time.
    //     alert('Camera Access permission denied. Kindly enable to Scan QR.');
    //   }
    // })
    // .catch((e: any) => console.log('Error is', e));
  }
   // Tag Item
   getTagData(tag_code){

      // Search Tag
      let loader = this.load.create({
        content: 'Please Wait',
        spinner: 'bubbles',
      });
      loader.present();
      var postData = {"type":'EstiTag',"searchTxt":tag_code,"searchField":"tag_code","id_branch":this.loggedInBranch};
      this.retail.getTagData(postData).then(data=>{
        if(data.status){
            this.tagMsg = data.msg;
            this.tagErrorMsg = "";
            setTimeout(()=>{
                  this.tagMsg = "";
            },this.common.msgTimeout);
            data.tagData['actual_gross_wt'] = data.tagData['gross_wt'];
            data.tagData['actual_less_wt'] = data.tagData['less_wt'];
            data.tagData['actual_net_wt'] = data.tagData['net_wt'];
            let detail = {itemData : data.tagData, metalRate : this.metalRate, tax_details : this.taxGroupItems, item_type : "tag"};
            let tagItem = this.retail.calculateSaleValue(detail);
            let addItem = true;
            this.esti['tag'].forEach(item => {
                if(item.tag_id == tagItem.tag_id){
                  this.tagMsg = "";
                  addItem = false;
                  this.tagErrorMsg = "Tag Already exist..";
                  setTimeout(()=>{
                        this.tagErrorMsg = "";
                  },this.common.msgTimeout);
                }
            })
            if(addItem){
               this.esti['is_tag'] = true;
               this.esti['tag'].push(tagItem);
             }
            // copy x
let y:any = Object.assign({}, this.esti['tag']);
console.log(y);

this.esti['tag'].reverse();
console.log(this.esti['tag']);

        }else{
          this.tagMsg = "";
          this.tagErrorMsg = data.msg;
          setTimeout(()=>{
                this.tagErrorMsg = "";
          },this.common.msgTimeout);
        }

        loader.dismiss();
      },err=>{
        loader.dismiss();

      })

  }

  getTagByID(tagData){
    if(tagData != ''){
     var istagId = (tagData.search("/") > 0 ? true : false);
     var isTagCode = (tagData.search("-") > 0 ? true : false);
     if(istagId){
       var tId   = tagData.split("/");
       var searchTxt = (tId.length >= 2 ? tId[0] : "");
       var searchField  = "tag_id";
     }
     else if(isTagCode){
       var searchTxt = tagData;
       var searchField  = "tag_code";
     }
     // Search Tag
     let loader = this.load.create({
       content: 'Please Wait',
       spinner: 'bubbles',
     });
     loader.present();
     var postData = {"searchTxt":searchTxt,"searchField":searchField,"id_branch":this.loggedInBranch};
     this.retail.getTagData(postData).then(data=>{
       if(data.status){
           this.tagMsg = data.msg;
           this.tagErrorMsg = "";
           setTimeout(()=>{
                 this.tagMsg = "";
           },this.common.msgTimeout);
           data.tagData['actual_gross_wt'] = data.tagData['gross_wt'];
           data.tagData['actual_less_wt'] = data.tagData['less_wt'];
           data.tagData['actual_net_wt'] = data.tagData['net_wt'];
           let detail = {itemData : data.tagData, metalRate : this.metalRate, tax_details : this.taxGroupItems, item_type : "tag"};
           let tagItem = this.retail.calculateSaleValue(detail);
           let addItem = true;
           this.esti['tag'].forEach(item => {
               if(item.tag_id == tagItem.tag_id){
                 this.tagMsg = "";
                 addItem = false;
                 this.tagErrorMsg = "Tag Already exist..";
                 setTimeout(()=>{
                       this.tagErrorMsg = "";
                 },this.common.msgTimeout);
               }
           })
           if(addItem){
              this.esti['is_tag'] = true;
              this.esti['tag'].push(tagItem);
            }
            let y:any = Object.assign({}, this.esti['tag']);
            console.log(y);

            this.esti['tag'].reverse();
            console.log(this.esti['tag']);

       }else{
         this.tagMsg = "";
         this.tagErrorMsg = data.msg;
         setTimeout(()=>{
               this.tagErrorMsg = "";
         },this.common.msgTimeout);
       }

       loader.dismiss();
     },err=>{
      loader.dismiss();

     })
    }
  }

  deleteItem(item_type, idx){
    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    if(item_type == 'tag'){
      this.esti[item_type].splice(idx, 1);
      this.tagErrorMsg = "";
      this.tagMsg = "Tag removed from estimation..";
      setTimeout(()=>{
            this.tagMsg = "";
      },this.common.msgTimeout);
    }
    if(item_type == 'non_tag'){
      this.esti[item_type].splice(idx, 1);
      this.ntErrorMsg = "";
      this.ntMsg = "Non-Tag item removed from estimation..";
      setTimeout(()=>{
            this.ntMsg = "";
      },this.common.msgTimeout);
    }
    if(item_type == 'home_bill'){
      this.esti[item_type].splice(idx, 1);
      this.hbErrorMsg = "";
      this.hbMsg = "Home Bill item removed from estimation..";
      setTimeout(()=>{
            this.hbMsg = "";
      },this.common.msgTimeout);
    }
    if(item_type == 'old_metal'){
      this.esti[item_type].splice(idx, 1);
      this.omErrorMsg = "";
      this.ombMsg = "Old Metal item removed from estimation..";
      setTimeout(()=>{
            this.ombMsg = "";
      },this.common.msgTimeout);
    }
    this.calcEstiSummary();
    loader.dismiss();
  }

  createEsti(){
    this.esti['is_tag'] = ( (this.esti['tag']).length > 0 ? true : false );
    this.esti['is_non_tag'] = ( (this.esti['non_tag']).length > 0 ? true : false );
    this.esti['is_home_bill'] = ( (this.esti['home_bill']).length > 0 ? true : false );
    this.esti['is_old_metal'] = ( (this.esti['old_metal']).length > 0 ? true : false );
    console.log(this.esti);
    // Validate Postdata
    if(this.esti['cus_id'] == '' || this.esti['id_employee'] == '' || this.esti['id_branch'] == ''){
      let toastMsg = this.toast.create({
        message: "Please fill required fields",
        duration: this.common.toastTimeout,
        position: 'center'
      });
      toastMsg.present();
    }
    else if(this.esti['is_tag']  || this.esti['is_non_tag'] || this.esti['is_home_bill'] || this.esti['is_old_metal']){
      if(this.esti['tag'] || this.esti['non_tag'] || this.esti['home_bill'] || this.esti['old_metal']){
        let loader = this.load.create({
          content: 'Please Wait',
          spinner: 'bubbles',
        });
        loader.present();
        this.esti['type'] = 1;
        this.esti['total_cost'] = this.total_esti_value;
        this.retail.createEstimation(this.esti).then(data=>{
          if(data.status){
            this.tot_sale_wgt = 0;
            this.tot_sale_rate = 0;
            this.tot_purch_wgt = 0;
            this.tot_purch_rate = 0;
            this.total_esti_value = 0;
            this.selectedCusData = [];
            this.esti = {"cus_id" : this.esti['cus_id'], "customer" : this.esti['customer'],"id_branch" : this.esti['id_branch'], "id_employee" : this.esti['id_employee'], "emp_name" : this.esti['emp_name'], "is_tag": false, "is_non_tag": false, "is_home_bill": false, "is_old_metal": false, "tag":[], "non_tag":[], "home_bill":[], "old_metal":[]};
            if(data.printURL != ''){
              console.log(data.printURL);
              this.downloadfile(data.printURL,data.esti_name);
            }
          }
          loader.dismiss();
          let toastMsg = this.toast.create({
            message: data.msg,
            duration: this.common.toastTimeout,
            position: 'center'
          });
          toastMsg.present();
          this.navCtrl.setRoot(HomePage);
        })
      }
      else{
        let toastMsg = this.toast.create({
          message: "Minimum 1 estimation item is required",
          duration: this.common.toastTimeout,
          position: 'center'
        });
        toastMsg.present();
      }
    }
    else{
      let toastMsg = this.toast.create({
        message: "Invalid Estimation",
        duration: this.common.toastTimeout,
        position: 'center'
      });
      toastMsg.present();
    }

  }

  getEstiByEstiNo(){
    if(this.estiDetail['esti_no'] != ''){
      let loader = this.load.create({
        content: 'Please Wait',
        spinner: 'bubbles',
      });
      loader.present();
	  this.estiDetail['id_branch'] = this.loggedInBranch;
      this.retail.getEstiPrintURL(this.estiDetail).then(data=>{
        if(data.status){
          if(data.printURL != ''){
            console.log(data.printURL);
            this.downloadfile(data.printURL,data.esti_name);
          }
        }
        loader.dismiss();
        let toastMsg = this.toast.create({
          message: data.msg,
          duration: this.common.toastTimeout,
          position: 'center'
        });
        toastMsg.present();
      })
    }else{
      let toastMsg = this.toast.create({
        message: "Enter valid estimation number",
        duration: this.common.toastTimeout,
        position: 'center'
      });
      toastMsg.present();
    }
  }

  downloadfile(url,name) {
    console.log(url)
    var date = new Date();
    date.setDate(date.getDate());
    console.log(date.toISOString().split('T')[0])
    this.platform.ready().then(() =>{
      console.log("Platform ready");
      if(this.platform.is('android')) {
        console.log("Platform Android");
        this.file.checkDir(this.file.externalDataDirectory, this.common.cmpShortName).then((data) => {
          console.log("Check directory IDO");
          this.file.checkDir(this.file.externalDataDirectory+''+this.common.cmpShortName+'/', date.toISOString().split('T')[0]).then(_ => {
            console.log("Check directory IDO "+date.toISOString().split('T')[0]);
            this.viewFile(url,name);
          }).catch(er => {
              this.file.createDir(this.file.externalDataDirectory+''+this.common.cmpShortName+'/', date.toISOString().split('T')[0],false).then(_ => {
                console.log("Create directory IDO "+date.toISOString().split('T')[0]);
                this.viewFile(url,name);
              }).catch(err => {
                console.log(err);
                console.log('Couldn\'t create directory')
              });
          });
        }).catch(err => {
          this.file.createDir(this.file.externalDataDirectory, this.common.cmpShortName,false).then(_ => {
            console.log('Create directory IDO')
            this.file.createDir(this.file.externalDataDirectory+''+this.common.cmpShortName+'/', date.toISOString().split('T')[0],false).then(_ => {
              console.log('Create directory IDO / '+date.toISOString().split('T')[0]);
              this.viewFile(url,name);
            }).catch(err1 => {
            console.log(err1);
            console.log('Couldn\'t create directory')
            });
          }).catch(err2 =>{
            console.log(err2);
            console.log('Couldn\'t create directory')});
        });
      }
    });
  }

  viewFile(url,name){
    var date = new Date();
    date.setDate(date.getDate());
    console.log(date);
    console.log(date.toISOString().split('T')[0])
    this.platform.ready().then(() => {
      console.log('platform ready viewFile')
      this.file.resolveDirectoryUrl(this.file.externalDataDirectory+''+this.common.cmpShortName+'/'+date.toISOString().split('T')[0]).then((resolvedDirectory) => {
        console.log(resolvedDirectory);
        console.log("resolved  directory: " + resolvedDirectory.nativeURL);
        this.file.checkFile(resolvedDirectory.nativeURL, name).then((data) => {
          console.log(data)
          console.log(resolvedDirectory.nativeURL+name)
          this.fileOpener.open(resolvedDirectory.nativeURL+name, 'application/pdf')
          .then(() => console.log('File is opened'))
          .catch(e => console.log('Error opening file', e));
        },err=>{
          console.log(err)
          let loader = this.load.create({
            content: 'Please Wait',
            spinner: 'bubbles',
          });
          loader.present();

          var targetPath = this.file.externalDataDirectory+''+this.common.cmpShortName+'/'+date.toISOString().split('T')[0]+'/'+name;
          this.fileTransfer.download(url, targetPath,true).then((entry) => {
            console.log('download complete: ' + entry.toURL());
            loader.dismiss();
            this.fileOpener.open(entry.toURL(), 'application/pdf')
            .then(() => console.log('File is opened'))
            .catch(e => console.log('Error opening file', e));
          }, (error) => {
            loader.dismiss();
            console.log(error)
          });
        });
      },err=>{
        console.log(err)
      });
    });
  }

  printEsti(content){
    console.log(content);
    this.printer.isAvailable().then(onSuccess =>{
      console.log("isAvailable - Success");
    },
    onError => {
      console.log(onError);
      console.log("isAvailable - Error");
    });

    let options: PrintOptions = {
        name: 'Estimation',
        //printerId: 'printer007',
        //duplex: true,
        //landscape: true,
        grayscale: true
      };

    this.printer.print(content, options).then(onSuccess =>{
      console.log("print - Success");
    },
    onError => {
      console.log("print - Error");
    });

  }
  delete(index){

    console.log(this.esti['tag'])

    if(this.esti['tag'][index]['id_tag_img'] != null && this.esti['tag'][index]['id_tag_img'] != ''){
    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();
    var postData = {"tagid":this.esti['tag'][index]['tag_id'],"imgid":this.esti['tag'][index]['id_tag_img']};
    this.retail.deletetagimage(postData).then(data=>{

      this.esti['tag'][index]['image'] = '';
      this.esti['tag'][index]['id_tag_img'] = null;

      loader.dismiss();
    },err=>{
      loader.dismiss();

    });
  }else{
    let toastMsg = this.toast.create({
      message: "Image not found.",
      duration: this.common.toastTimeout,
      position: 'center'
    });
    toastMsg.present();

  }

  }
  public presentActionSheet(index) {
    let actionSheet = this.actionSheetCtrl.create( {
        title: 'Select Image Source',
        buttons: [
             {
                 text: 'Load from Gallery',
                 handler: () => {
                  this.takePicture( this.camera.PictureSourceType.PHOTOLIBRARY,index);


                //   let options = {
                //     maximumImagesCount: 2,
                //     quality: 100,

                //    };

                // this.imagePicker.getPictures(options).then(results => {
                //   if(results.length > 0){
                //     this.loading();

                //   }

                //         console.log('111111111111111');
                //         for(var i=0; i < results.length;i++){

                //           console.log(results[i])
                //           var documentURL = decodeURIComponent(results[i]);
                //           console.log(documentURL)

                //           results[i] = documentURL;
                //           console.log(results[i])

                //                 var temp = results.length - 1 == i ? true : false;
                //                  let correctPath = results[i].substr( 0, results[i].lastIndexOf( '/' ) + 1 );
                //                  let currentName = results[i].substr( results[i].lastIndexOf( '/' ) + 1 );
                //                  this.copyFileToLocalDir( correctPath, currentName, this.createFileName(),temp,'gal');

                //         };


                //        });
                  }
             },
            {
                text: 'Take Picture',
                handler: () => {
                    this.takePicture( this.camera.PictureSourceType.CAMERA,index);
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

  public takePicture( sourceType,index ) {

    // Create options for the Camera Dialog
    var options = {
    quality: 100,
    sourceType: sourceType,
    saveToPhotoAlbum: false,
    correctOrientation: true,

    // allowEdit:true

    };
    var cropOptions = {
      quality: 100,
      widthRatio: -1,
      heightRatio: -1
    }
  this.loading();
    // Get the data of an image
    this.camera.getPicture( options ).then(( imagePath ) => {
      console.log(imagePath);

     if ( this.platform.is( 'android' ) && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY ) {
       console.log(imagePath)
       this.crop.ratioCrop(imagePath, cropOptions).then(out => {

         this.filePath.resolveNativePath( out )
             .then( filePath => {
              console.log(filePath)
              console.log(333333333333333)

                 let correctPath = filePath.substr( 0, filePath.lastIndexOf( '/' ) + 1 );
                //  let currentName = imagePath.substring( imagePath.lastIndexOf( '/' ) + 1, imagePath.lastIndexOf( '?' ) );
                let currentName = filePath.substring( filePath.lastIndexOf( '/' ) + 1);
                this.dismissLoader();

                 this.copyFileToLocalDir( correctPath, currentName, this.createFileName(),index );
    // this.uploadImage();
             },err=>{
              this.dismissLoader();

             } );
            },err=>{
              this.dismissLoader();

            } );


     } else {
      this.crop.ratioCrop(imagePath, cropOptions).then(out => {

        this.filePath.resolveNativePath( out )
            .then( filePath => {
             console.log(filePath)
    var currentName = filePath.substr( filePath.lastIndexOf( '/' ) + 1 );
    var correctPath = filePath.substr( 0, filePath.lastIndexOf( '/' ) + 1 );
    this.dismissLoader();

    this.copyFileToLocalDir( correctPath, currentName, this.createFileName(),index );
    // this.uploadImage();
  } ,err=>{
    this.dismissLoader();

  } );
  },err=>{
    this.dismissLoader();

  } );

    }

    }, ( err ) => {
      this.dismissLoader();
  console.log(err);
    console.log( 'Error while selecting image.' );
    } );

    }
    public pathForImage( img ) {
    if ( img === null ) {
        return '';
    } else {
        return cordova.file.dataDirectory + img;
    }
    }
    // Create a new name for the image
    private createFileName() {
    var d = new Date(),
        n = d.getTime(),
        newFileName = n + ".jpg";
    return newFileName;
    }

 // Copy the image to a local folder
 private copyFileToLocalDir( namePath, currentName, newFileName,index ) {
  this.file.copyFile( namePath, currentName, cordova.file.dataDirectory, newFileName ).then( success => {

    console.log(this.pathForImage(newFileName));

  //  this.uploadImage(newFileName,index)
  var orientation = -1;

  this.imageCompress.compressFile(this.pathForImage(newFileName), orientation, 100, 100).then(async result=>{

    this.writeFile(result,this.createFileName(),index);

  },err=>{
    console.log(err)

  });

  }, error => {

      console.log( error);
  } );
  }
  public uploadImage(name,index) {
    this.show = true;

      // Destination URL
      var url = BaseAPIURL+'admin_app_api/uploadTagimage';
      var d = new Date(),
      n = d.getTime()
    // File for Upload
    var targetPath = this.pathForImage( name )  + '?nocache=' + n;

    // File name only
    var filename = name;
    var options = {
      fileKey: "name",
      fileName: filename,
      chunkedMode: false,
      mimeType: "image/jpeg",
      params: {
        fileName: filename,
        tagid:this.esti['tag'][index]['tag_id'],
        imgid : this.esti['tag'][index]['id_tag_img']
      }
    };




    const fileTransfer: TransferObject = this.transfer1.create();


    // let loader = this.load.create( {
    //   content: "Uploading..."
    // } );
    // loader.present();


    console.log(targetPath)
    console.log(encodeURI(url))
    console.log(options)
    console.log(url)

    // Use the FileTransfer to upload the image
    fileTransfer.upload( targetPath, encodeURI(url), options ).then(( data ) => {
      console.log(data);
      console.log(this.pathForImage(name));

      let result = JSON.parse( data.response );
      console.log(result);
      console.log(result['imageid'])
      // loader.dismissAll();
      this.esti['tag'][index]['image'] = this.pathForImage(name);
      this.esti['tag'][index]['id_tag_img'] = result['imageid'];
      let toastMsg = this.toast.create({
        message: "Image succesfully uploaded.",
        duration: this.common.toastTimeout,
        position: 'center'
      });
      toastMsg.present();
      this.show = false;

    }, err => {
      // loader.dismissAll()
      console.log(err);
       let toastMsg = this.toast.create({
        message: "Error while uploading Image.",
        duration: this.common.toastTimeout,
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

  }
  loading(){

    this.loader = this.load.create( {
        content: "Please Wait..."
    });
    this.loader.present();
  }
  dismissLoader() {
    this.loader.dismiss();
  }
  refresh() {
    console.log('refresheed')
    this.cd.detectChanges();
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

 //here is the method is used to write a file in storage
 writeFile(base64Data: any, fileName: any,index) {
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
      this.targetPaths.push( success['nativeURL'])
      this.filenames.push( currentName );

      // this.copyFileToLocalDir( correctPath, currentName, this.createFileName() );
      this.uploadImage(currentName,index)
      this.dismissLoader();


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

deletePhoto( index,data ) {
  let confirm = this.alertCtrl.create( {
      title: `Sure you want to delete this image? There is no undo!`,
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

                if(this.images[index].hasOwnProperty('id_design_img')){
                    let loader = this.load.create({
                      content: 'Please Wait',
                      spinner: 'dots',
                    });
                    loader.present();

                    let temp = {'empcode':this.empData['uid'],'id_sub_design':this.whole['id_sub_design'],id_sub_design_mapping:this.whole['id_sub_design_mapping'],'id_design_img':this.whole['img_details'][index]['id_design_img']}

                    this.common.deletegallery(temp).then(data=>{
                      let toast = this.toast.create({
                        message: data['message'],
                        duration: 3000,
                        position: 'bottom'
                      });
                      loader.dismiss();
                      toast.present();
                      this.images.splice(index,1);

                      let check:any = this.images.findIndex(data => data['is_default'] == 1);
  if(check < 0){

    this.imagename = '';
    this.image = '';
  }
  else{

  }
                    },err=>{
                      loader.dismiss();

                    });

                  }
                  else{
                    this.images.splice(index,1);

                    let check:any = this.images.findIndex(data => data['is_default'] == 1);
if(check < 0){

  this.imagename = '';
  this.image = '';
}
else{

}
                  }

              }
          }
      ]
  } );
  confirm.present();
}
checkdefault(index){
  console.log(this.images[index])
  if(this.images[index].hasOwnProperty('id_design_img')){
    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'dots',
    });
    loader.present();
    if(this.images[index]['is_default'] == 0){
      this.images[index]['is_default'] = 1;
      this.image = this.images[index]['image_name'];
      this.images.forEach((element,i) => {

        if(index == i){

        }
        else{
          this.images[i]['is_default'] = 0;

        }
      });
    }
    else{
      this.images[index]['is_default'] = 0;
      this.image = '';
      this.imagename = '';
    }

    let temp = {'empcode':this.empData['uid'],'id_sub_design':this.whole['id_sub_design'],id_sub_design_mapping:this.whole['id_sub_design_mapping'],'id_design_img':this.whole['img_details'][index]['id_design_img'],'is_default':this.images[index]['is_default']}

    this.common.updatedefault(temp).then(data=>{
      let toast = this.toast.create({
        message: 'Default Image Updated Successfully',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
      loader.dismiss();
    });
  }
  else{
  if(this.images[index]['is_default'] == 0){
    this.images[index]['is_default'] = 1;
    this.image = this.images[index]['image_name'];
    this.images.forEach((element,i) => {

      if(index == i){

      }
      else{
        this.images[i]['is_default'] = 0;

      }
    });
  }
  else{
    this.images[index]['is_default'] = 0;
    this.image = '';
    this.imagename = '';
  }
}
}

submit(){
  let check:any = this.images.findIndex(data => data['is_default'] == 1);

  if(this.imagename != '' || check >= 0){
    // this.uploadImage(this.imagename)

  }else{
    let toastMsg = this.toast.create({
      message: "Please Upload Default Image.",
      duration: this.common.toastTimeout,
      position: 'center'
    });
    toastMsg.present();
  }
}
}
