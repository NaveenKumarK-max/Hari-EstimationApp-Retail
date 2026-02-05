import { Component, ChangeDetectorRef, Pipe, PipeTransform, trigger, state, style, transition, animate, keyframes, ElementRef, ViewChild } from '@angular/core';
import { NavController, Events, LoadingController, ToastController, ModalController, Platform, NavParams } from 'ionic-angular';
import { DecimalPipe } from '@angular/common';
// import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { Printer, PrintOptions } from '@ionic-native/printer';
import { CommonProvider } from '../../providers/common';
import { RetailProvider } from '../../providers/retail';
import { AddEstiItemPage } from '../modal/add-esti-item/add-esti-item';
import { EstiBasicDetailPage } from '../modal/esti-basic-detail/esti-basic-detail';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { HomePage } from '../home/home';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { CusSearchPage } from '../modal/customer/customer';
import { BluetoothPage } from '../bluetooth/bluetooth';
import { GiftPage } from '../gift/gift';
import { Content } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular'
import { WriteReviewPage } from '../write-review/write-review';
import { EmpSearchPage } from '../modal/employee/employee';

/*
  Generated class for the Estimation page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-estimation',
  templateUrl: 'estimation.html',
  providers: [CommonProvider, RetailProvider]

})

export class EstiPage {
  @ViewChild(Content) content: Content;

  fileTransfer: FileTransferObject = this.transfer.create();
  empData = JSON.parse(localStorage.getItem('empDetail'));
  esti_type = 'tag';
  page_type = "create";
  employees = [];
  branches = [];
  askBranch = 0;
  selectedCusData = [];
  nonTagStock = [];
  homeBillStock: any;
  metalRate: any;
  taxGroupItems: any;
  settings = [];
  ret_settings = [];
  tagMsg = "";
  tagErrorMsg = "";
  scannerOn = false;
  scanSub: any;
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
  esti = { "choose": '', "cus_id": "", "customer": "", "id_branch": "", "id_employee": "", "emp_name": "", "is_tag": false, "is_non_tag": false, "is_home_bill": false, "is_old_metal": false, "tag": [], "non_tag": [], "home_bill": [], "old_metal": [], "chit_details": [{ 'slip_no': '', 'slip_amt': '' }] };
  tot_purch_wgt = 0;
  tot_purch_rate = 0;
  tot_sale_wgt = 0;
  tot_sale_rate = 0;
  tot_charge = 0;

  total_esti_value = 0;
  oldMetalTypes = [];
  estiDetail = {};
  dataCheckList = { "empData": false, "taxGroup": false, "branch": false, "settings": false };
  loggedInBranch: any;
  color = 'black';

  tagData = { 'taged': 1, 'fin_year': '', "order_id": "", "tag_code": "", "tag_code1": "", "tag_code2": "", "is_partial": 0, "stone_details": [] };
  show = true;
  list: any[] = [];
  togtype = '';
  checkold = false;
  fin = [];
  advance = 0;
  tot_gift_rate = 0;
  dates = [];
  tot_incen = 0;
  ferror: any = null;
  showr = false;

  es = this.navParams.get('estimation');
  stoneMasTypes: any[] = [];


  totalPieces: number = 0;
  totalGwt: number = 0;
  totalNwt: number = 0;
  totalTaxable: number = 0;
  totalGST: number = 0;
  invoiceValue: number = 0;
  netTotal: number = 0;
  totalStoneWt = 0;
  totalStoneAmount = 0;
  totalDiaWt = 0;
  totalDiaAmount = 0;


  constructor(public actionSheetCtrl: ActionSheetController, public cd: ChangeDetectorRef, private barcodeScanner: BarcodeScanner, public navParams: NavParams, private navCtrl: NavController, public load: LoadingController, private printer: Printer, private nav: NavController, private events: Events, private commonservice: CommonProvider, public retail: RetailProvider, private toast: ToastController, private event: Events, public modal: ModalController, public common: CommonProvider, private fileOpener: FileOpener, private transfer: FileTransfer, public file: File, private filePath: FilePath, private fileChooser: FileChooser, public platform: Platform) {
    this.nav = nav;
    console.log(this.es);



    this.page_type = this.navParams.get('page_type');
    this.loggedInBranch = this.empData['id_branch'];
    this.esti['id_log'] = this.empData['id_log'];

    this.esti['id_employee'] = this.empData['uid'];
    this.esti['emp_name'] = this.empData['username'];
    this.esti['id_branch'] = this.empData['id_branch'];
    if (this.es != undefined) {
      this.esti['cus_id'] = this.es['cus_id'];
      this.esti['customer'] = this.es['cus_name'];
      this.esti['firstname'] = this.es['customer_name'];
    }



    if (this.navParams.get('empname') != undefined && this.navParams.get('empname') != '') {

      this.esti['emp_name'] = this.navParams.get('empname');
      this.esti['id_employee'] = this.navParams.get('empid');

      this.empData['emp_name'] = this.navParams.get('empname');
      this.empData['id_employee'] = this.navParams.get('empid');
    }
    if (this.navParams.get('bname') != undefined && this.navParams.get('bid') != '') {

      this.esti['branch_name'] = this.navParams.get('bname');
      this.esti['id_branch'] = this.navParams.get('bid');

      this.empData['branch_name'] = this.navParams.get('bname');
      this.empData['id_branch'] = this.navParams.get('bid');

      this.loggedInBranch = this.navParams.get('bid');
    }
    /*this.retail.getHomeStock({"type":"all", "searchTxt":"", "searchField":"", "id_branch":this.esti['id_branch']}).then(data=>{
      this.homeBillStock = data;
    })*/

    this.commonservice.getlist({ 'id_branch': this.empData['id_branch'], 'id_emp': this.empData['uid'] }).then(res => {

      this.list = res['estdetails'];
      this.content.resize();
    }, err => {
    });

    /*     this.commonservice.getlist({'id_branch':this.empData['id_branch'],'uid':this.empData['uid']}).then(res => {

          this.list = res['estdetails'];
          this.slist = res['estdetails'];

          loader.dismiss();
        },err=>{
          loader.dismiss();
        }); */

    this.retail.getAllStoneMaters({ "id_branch": this.esti['id_branch'] }).then(data => {
      this.stoneMasData = data;
    })

    this.retail.getAllStoneTypes({ "id_branch": this.esti['id_branch'] }).then(data => {
      this.stoneMasTypes = data;
    })

    this.commonservice.fin().then(res => {

      this.fin = res;
      this.tagData['fin_year'] = this.fin.filter(data => data['fin_status'] == 1)[0]['fin_year_code'];
    });
    this.event.subscribe('gift', (gift) => {

      this.esti['chit_details'] = gift['fields'];
      this.esti['cus_id'] = gift['idcus'];
      console.log(gift)
      this.calcEstiSummary();

    });
    if (this.es == undefined) {

      this.openEstiBasicDetailModal();
    }

  }

  ionViewDidLoad() {

    // this.retail.chooserate().then(data=>{
    //   // this.dates = data;
    //   // console.log(data);
    // });

    if (this.navParams.get('empname') != undefined && this.navParams.get('empname') != '') {

      this.esti['emp_name'] = this.navParams.get('empname');
      this.esti['id_employee'] = this.navParams.get('empid');

      this.empData['emp_name'] = this.navParams.get('empname');
      this.empData['id_employee'] = this.navParams.get('empid');
    }
    if (this.navParams.get('bname') != undefined && this.navParams.get('bid') != '') {

      this.esti['branch_name'] = this.navParams.get('bname');
      this.esti['id_branch'] = this.navParams.get('bid');

      this.empData['branch_name'] = this.navParams.get('bname');
      this.empData['id_branch'] = this.navParams.get('bid');

      this.loggedInBranch = this.navParams.get('bid');
    }

    console.log(this.loggedInBranch);
    console.log('000000000000000');
    if (this.page_type == "create") {
      let loader = this.load.create({
        content: 'Please Wait',
        spinner: 'bubbles',
      });
      loader.present();
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
      // let loader4 = this.load.create({
      //   content: 'Please Wait',
      //   spinner: 'bubbles',
      // });
      // loader4.present();
      if ((this.loggedInBranch == 0 || this.loggedInBranch == '' || this.loggedInBranch == null) && this.empData['branch_settings'] == 1) {
        this.askBranch = 1;
        this.common.getbranch().then(data => {
          this.branches = data;
          this.events.publish('branch:loaded', true);
          this.dataCheckList['branch'] = true;

          this.common.getBranchEmployees(this.empData['id_branch']).then(data => {
            this.employees = data;
            // this.openEstiBasicDetailModal();
            this.events.publish('empData:loaded', true);
            this.dataCheckList['empData'] = true;
            this.empSelected();

            this.retail.getAllTaxGroupItems().then(data => {
              this.taxGroupItems = data;
              this.events.publish('taxGroup:loaded', true);
              this.dataCheckList['taxGroup'] = true;

              this.common.getCurrencyAndSettings({ "id_metalrates": this.esti['choose'], "id_branch": this.esti['id_branch'] }).then(data => {
                this.metalRate = data.metal_rates;
                this.settings = data.settings;
                this.ret_settings = data.ret_settings;
                this.events.publish('settings:loaded', true);
                this.events.publish('ret_settings:loaded', true);
                this.dataCheckList['settings'] = true;
                loader.dismiss();
                if (this.navParams.get('ecat') != undefined) {

                  this.tagData['tag_code'] = this.navParams.get('ecat');
                  this.esti['id_branch'] = this.navParams.get('bcode');

                  this.getTagByID(this.tagData['tag_code']);

                }
                console.log(283289)

                this.navParams.get('tag').forEach(element => {

                  console.log(283289)

                  element['actual_gross_wt'] = element['gross_wt'];
                  element['actual_less_wt'] = element['less_wt'];
                  element['actual_net_wt'] = element['net_wt'];
                  element['charge_value'] = element['charge_value'];
                  element['charges'] = element['charges'];
                  element['checkwas'] = element['retail_max_wastage_percent'];

                  element['metal_type'] = element['rate_field'];
                  element['market_metal_type'] = element['market_rate_field'];

                  let detail = { itemData: element, metalRate: this.metalRate, tax_details: this.taxGroupItems, item_type: "tag" };
                  let tagItem = this.retail.calculateSaleValue(detail);
                  let t: any = {};
                  t['item_data'] = tagItem;
                  this.from('tag', t, 'add');

                });
                this.navParams.get('non_tag').forEach(element => {
                  // if(element['calculation_based_on'] == 3){

                  //   element['sales_value'] = element['taxable'];
                  // }
                  element['metal_type'] = element['rate_field'];
                  element['market_metal_type'] = element['market_rate_field'];

                  let detail = { itemData: element, metalRate: this.metalRate, tax_details: this.taxGroupItems, item_type: "non_tag" };

                  let tagItem = this.retail.calculateSaleValue(detail);

                  let t: any = {};
                  t['item_data'] = tagItem;
                  console.log(283289)

                  this.from('non_tag', t, 'add');

                });
                this.navParams.get('home_bill').forEach(element => {
                  // if(element['calculation_based_on'] == 3){

                  //   element['sales_value'] = element['taxable'];
                  // }
                  element['metal_type'] = element['rate_field'];
                  element['market_metal_type'] = element['market_rate_field'];
                  let detail = { itemData: element, metalRate: this.metalRate, tax_details: this.taxGroupItems, item_type: "home_bill" };

                  let tagItem = this.retail.calculateSaleValue(detail);

                  let t: any = {};
                  t['item_data'] = tagItem;
                  console.log(283289)

                  this.from('home_bill', t, 'add');

                });
                this.navParams.get('old_metal').forEach(element => {
                  // element['rate'] = Math.round(Math.ceil(this.metalRate['goldrate_22ct'])) ;
                  element['rate'] = parseFloat(element.id_old_metal_type == '1' ? this.metalRate['goldrate_22ct'] : this.metalRate['silverrate_1gm']);
                  element['category'] = element['metal'];

                  let net_wt = parseFloat(((element['gross_wt']) - (element['dust_wt']) - (element['stone_wt']) - (element['wastage_wt'])).toFixed(3));
                  element['other_stone_price'] = element.hasOwnProperty('other_stone_price') ? element['other_stone_price'] : 0;
                  element['amount'] = Math.round((net_wt * element['rate']) + (element['other_stone_price']));
                  element['purpose'] = element['id_purpose'] == 1 ? 'Cash' : 'Exchange';

                  let t: any = {};
                  t['item_data'] = element;
                  console.log(283289)

                  this.from('old_metal', t, 'add');

                });

              })
            })

          })


        })
      } else {
        this.esti['id_branch'] = this.loggedInBranch;
        this.estiDetail['id_branch'] = this.loggedInBranch;
        this.events.publish('branch:loaded', true);
        this.dataCheckList['branch'] = true;

        this.common.getBranchEmployees(this.empData['id_branch']).then(data => {
          this.employees = data;
          // this.openEstiBasicDetailModal();
          this.events.publish('empData:loaded', true);
          this.dataCheckList['empData'] = true;
          this.empSelected();

          this.retail.getAllTaxGroupItems().then(data => {
            this.taxGroupItems = data;
            this.events.publish('taxGroup:loaded', true);
            this.dataCheckList['taxGroup'] = true;

            this.common.getCurrencyAndSettings({ "id_metalrates": this.esti['choose'], "id_branch": this.esti['id_branch'] }).then(data => {
              this.metalRate = data.metal_rates;
              this.settings = data.settings;
              this.ret_settings = data.ret_settings;
              this.events.publish('settings:loaded', true);
              this.events.publish('ret_settings:loaded', true);
              this.dataCheckList['settings'] = true;
              loader.dismiss();
              if (this.navParams.get('ecat') != undefined) {

                this.tagData['tag_code'] = this.navParams.get('ecat');
                this.esti['id_branch'] = this.navParams.get('bcode');

                this.getTagByID(this.tagData['tag_code']);

              }
              console.log(283289)

              this.navParams.get('tag').forEach(element => {
                console.log(283289)
                element['actual_gross_wt'] = element['gross_wt'];
                element['actual_less_wt'] = element['less_wt'];
                element['actual_net_wt'] = element['net_wt'];
                element['charge_value'] = element['charge_value'];
                element['charges'] = element['charges'];
                element['checkwas'] = element['retail_max_wastage_percent'];

                element['metal_type'] = element['rate_field'];
                element['market_metal_type'] = element['market_rate_field'];

                let detail = { itemData: element, metalRate: this.metalRate, tax_details: this.taxGroupItems, item_type: "tag" };
                let tagItem = this.retail.calculateSaleValue(detail);
                let t: any = {};
                t['item_data'] = tagItem;
                this.from('tag', t, 'add');
              });

              this.navParams.get('non_tag').forEach(element => {
                // if(element['calculation_based_on'] == 3){

                //   element['sales_value'] = element['taxable'];
                // }
                element['metal_type'] = element['rate_field'];
                element['market_metal_type'] = element['market_rate_field'];

                let detail = { itemData: element, metalRate: this.metalRate, tax_details: this.taxGroupItems, item_type: "non_tag" };

                let tagItem = this.retail.calculateSaleValue(detail);

                let t: any = {};
                t['item_data'] = tagItem;
                console.log(283289)

                this.from('non_tag', t, 'add');

              });
              this.navParams.get('home_bill').forEach(element => {
                // if(element['calculation_based_on'] == 3){

                //   element['sales_value'] = element['taxable'];
                // }
                element['metal_type'] = element['rate_field'];
                element['market_metal_type'] = element['market_rate_field'];

                let detail = { itemData: element, metalRate: this.metalRate, tax_details: this.taxGroupItems, item_type: "home_bill" };

                let tagItem = this.retail.calculateSaleValue(detail);

                let t: any = {};
                t['item_data'] = tagItem;
                console.log(283289)

                this.from('home_bill', t, 'add');

              });
              this.navParams.get('old_metal').forEach(element => {
                let detail = { itemData: element, metalRate: this.metalRate, tax_details: this.taxGroupItems, item_type: "old_metal" };
                element['rate'] = parseFloat(element.id_old_metal_type == '1' ? this.metalRate['goldrate_22ct'] : this.metalRate['silverrate_1gm']);

                let net_wt = parseFloat(((element['gross_wt']) - (element['dust_wt']) - (element['stone_wt']) - (element['wastage_wt'])).toFixed(3));
                element['other_stone_price'] = element.hasOwnProperty('other_stone_price') ? element['other_stone_price'] : 0;
                element['amount'] = Math.round((net_wt * element['rate']) + (element['other_stone_price']));
                element['category'] = element['metal'];
                element['purpose'] = element['id_purpose'] == 1 ? 'Cash' : 'Exchange';
                // let tagItem = this.retail.calculateSaleValue(detail);

                let t: any = {};
                t['item_data'] = element;
                console.log(283289)

                this.from('old_metal', t, 'add');

              });
            })
          })
        })


      }


    }
  }

  /* for footer as hide in default. it's assigned in app.components.ts */
  // ionViewWillLeave(){
  //   this.events.publish( 'entered', false );

  //   }
  ionViewWillEnter() {

    this.events.publish('entered', true);
    this.events.publish('pageno', 1);

  }

  estiTypeChanged(ev) {
    let type = ev._value;
    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();
    if (type != 'summary') {
      if ((this.stoneMasData).length == 0) {
        this.retail.getAllStoneMaters({ "id_branch": this.esti['id_branch'] }).then(data => {
          this.stoneMasData = data;
          loader.dismiss();
        })
      }
      if (type == 'non_tag') {
        this.retail.getNonTagItems({ "id_branch": this.esti['id_branch'] }).then(data => {
          this.nonTagStock = data;
          loader.dismiss();
          console.log(this.nonTagStock, 'jjjjjjjjjjj');
          if (this.esti[this.esti_type].length == 0) {

            this.openItemAddModal(this.esti_type, '', 'add');
          }
        })
      }
      else if (type == 'home_bill') {
        this.retail.getNonTagItems({ "id_branch": this.esti['id_branch'] }).then(data => {
          this.nonTagStock = data;
          //  loader.dismiss();
          console.log(this.nonTagStock, 'jjjjjjjjjjj');

          //   this.openItemAddModal(this.esti_type, '', 'add');


          if ((this.purities).length == 0) { // Purities
            this.retail.getAllPurities("").then(data => {
              this.purities = data;
              if ((this.collections).length == 0 && this.ret_settings['collections_required'] == 1) {  // Collections
                this.retail.getCollections({ "type": "active", "last_id": -1 }).then(data => {
                  this.collections = data;
                  loader.dismiss();
                  if (this.esti[this.esti_type].length == 0) {

                    this.openItemAddModal(this.esti_type, '', 'add');
                  }
                })
              } else {
                loader.dismiss();
                if (this.esti[this.esti_type].length == 0) {

                  this.openItemAddModal(this.esti_type, '', 'add');
                }
              }
              // loader.dismiss();
            })
          } else {
            // loader.dismiss();
            if ((this.collections).length == 0 && this.ret_settings['collections_required'] == 1) {  // Collections
              this.retail.getCollections({ "type": "active", "last_id": -1 }).then(data => {
                this.collections = data;
                loader.dismiss();
                if (this.esti[this.esti_type].length == 0) {

                  this.openItemAddModal(this.esti_type, '', 'add');
                }
              })
            } else {
              loader.dismiss();
              if (this.esti[this.esti_type].length == 0) {

                this.openItemAddModal(this.esti_type, '', 'add');
              }
            }
          }
        })

      }
      else if (type == 'old_metal') {
        this.retail.getOldMetalType().then(data => {
          this.oldMetalTypes = data;
          loader.dismiss();
          if (this.esti[this.esti_type].length == 0) {

            this.openItemAddModal(this.esti_type, '', 'add');
          }
        })
      } else {
        loader.dismiss();
      }
    } else {
      loader.dismiss();
    }
    this.calcEstiSummary();
  }

  empSelected() {
    this.oldMetalCat = [];
    let emp = { "allowed_old_met_pur": "" };
    this.employees.forEach(e => {
      if (this.esti['id_employee'] == e.id_employee) {
        emp = e;
      }
    })
    if (emp.allowed_old_met_pur != '') {
      var categories = emp.allowed_old_met_pur;
      var catArr = categories.split(",");
      catArr.forEach(cat => {
        var categoryArr = cat.split("-");
        this.oldMetalCat.push({ "id_category": categoryArr[0], "cat_name": categoryArr[1] });
      })
    }
  }

  openEstiBasicDetailModal() {
    console.log('paggee', this.page_type);
    console.log(this.navParams.get('tit'))
    let data = { "askBranch": this.askBranch, employees: this.employees, selectedCusData: this.selectedCusData, esti: this.esti, branches: this.branches };
    console.log(data);
    // let modal = this.modal.create(EstiBasicDetailPage, data,{enableBackdropDismiss: false})
    // modal.present();
    // modal.onDidDismiss(data => {
    //   if(data != null){
    //     this.selectedCusData = data.selectedCusData;
    //     this.esti['cus_id'] = data.cus_id;
    //     this.esti['customer'] = data.customer;
    //     this.empSelected();
    //   }
    // });
    if (this.navParams.get('tit') != 'Print Estimation') {  /* krishna */

      let modal = this.modal.create(CusSearchPage, { 'show': 'true', 'first': this.esti['firstname'] })
      modal.present();
      modal.onDidDismiss(mData => {
        console.log(mData)
        if (mData != null) {
          this.selectedCusData = mData;
          this.esti['cus_id'] = mData['id_customer'];
          this.esti['customer'] = mData['label'];
          this.esti['firstname'] = mData['firstname'];
          this.esti['esti_for'] = mData['cus_type'] == 2 ? 3 : mData['cus_type'];

          this.empSelected();
        } else {

        }
      });
    }


  }

  check() {

    if (this.show == false) {

      this.show = true;
    }
    else {
      this.show = false;

    }
  }
  openItemAddModal(type, item, action) {
    let idx = -1;
    let estiData = [];
    if (action == 'edit') {
      estiData = item;
      idx = this.esti[type].indexOf(item);
      console.log(idx)
      console.log(item)
      console.log(this.esti);
      console.log(this.esti[type][idx]);
    }
    console.log(this.stoneMasTypes, 'ppppppppppp');

    let data = { type: type, action: action, ret_settings: this.ret_settings, esti: estiData, id_branch: this.esti['id_branch'], metal_rates: this.metalRate, taxGroupItems: this.taxGroupItems, nonTagStock: this.nonTagStock, homeBillStock: this.homeBillStock, purities: this.purities, collections: this.collections, oldMetalCat: this.oldMetalCat, stoneMasData: this.stoneMasData, oldMetalTypes: this.oldMetalTypes, stoneMasTypes: this.stoneMasTypes };
    console.log(data);
    let modal = this.modal.create(AddEstiItemPage, data, { enableBackdropDismiss: false })
    modal.present();
    modal.onDidDismiss(data => {
      if (data != null) {
        if (data.item_data != null) {
          // ADD
          if (action == 'add') {
            let addItem = true;
            if (type == "tag") { // Tag Item
              this.esti[type].forEach(item => {
                if (item.tag_id == data.item_data.tag_id) {
                  addItem = false;
                  this.tagMsg = "";
                  this.tagErrorMsg = "Tag Already exist..";

                  let toastMsg = this.toast.create({
                    message: this.tagErrorMsg,
                    duration: this.common.toastTimeout,
                    position: 'middle'
                  });
                  toastMsg.present();

                  setTimeout(() => {
                    this.tagErrorMsg = "";
                  }, this.common.msgTimeout);
                }
              })
            }
            if (addItem) {
              this.esti[type].push(data.item_data);

            }
          }
          // UPDATE
          if (action == 'edit' && idx >= 0) {
            // console.log(idx)
            // console.log(this.esti[type][idx]);
            // console.log(data.item_data);
            console.log(data.item_data, 'data');

            // data.item_data['tot_mc'] =data.item_data['mc_type'] == 1? data.item_data['mc_value']:data.item_data['mc_value'] * data.item_data['gross_wt'];

            this.esti[type][idx] = data.item_data;
            this.calculateTotals();
          }

        }
        this.calcEstiSummary();
        if (data.submitType == 'SN') { // Save and New
          this.openItemAddModal(type, '', 'add');
        }
      }
      else if (action == 'edit' && idx >= 0) {
        console.log(estiData);

        this.esti[type][idx] = estiData;
      }
      let y: any = Object.assign({}, this.esti[type]);
      console.log(y);
      console.log(this.esti[type]);


      if (action != 'edit') {

        this.esti[type].reverse();
        console.log(this.esti[type]);
      }
    });
  }
  colorchange(index) {

    if (this.esti['tag'][index]['is_partial'] == '0') {
      this.esti['tag'][index]['is_partial'] = '1';
    }
    else {
      this.esti['tag'][index]['is_partial'] = '0';
      this.esti['tag'][index]['gross_wt'] = this.esti['tag'][index]['actual_gross_wt'];
      this.esti['tag'][index]['less_wt'] = this.esti['tag'][index]['actual_less_wt'];
      this.esti['tag'][index]['net_wt'] = this.esti['tag'][index]['actual_net_wt'];
      let detail = { itemData: this.esti['tag'][index], metalRate: this.metalRate, tax_details: this.taxGroupItems, item_type: 'tag' };
      this.esti['tag'][index] = this.retail.calculateSaleValue(detail);
      this.calcEstiSummary();

    }
  }
  colorchangehome(index) {

    if (this.esti['home_bill'][index]['is_partly_sold'] == '0') {
      this.esti['home_bill'][index]['is_partly_sold'] = '1';
    }
    else {
      this.esti['home_bill'][index]['is_partly_sold'] = '0';
      this.esti['home_bill'][index]['gross_wt'] = this.esti['home_bill'][index]['actual_gross_wt'];
      this.esti['home_bill'][index]['less_wt'] = this.esti['home_bill'][index]['actual_less_wt'];
      this.esti['home_bill'][index]['net_wt'] = this.esti['home_bill'][index]['actual_net_wt'];
      let detail = { itemData: this.esti['home_bill'][index], metalRate: this.metalRate, tax_details: this.taxGroupItems, item_type: 'home_bill' };
      this.esti['home_bill'][index] = this.retail.calculateSaleValue(detail);
      this.calcEstiSummary();

    }
  }
  calcSaleValue(index) {
    console.log(this.esti['tag'][index])
    // console.log(this.esti['tag'][index]['gross_wt'],'gross');

    if (parseFloat(this.esti['tag'][index]['gross_wt']) > parseFloat(this.esti['tag'][index]['actual_gross_wt'])) {
      this.esti['tag'][index]['gross_wt'] = this.esti['tag'][index]['actual_gross_wt'];
      console.log(this.esti['tag'][index]['gross_wt'], 'gross');
    }
    if (parseFloat(this.esti['tag'][index]['gross_wt']) < parseFloat(this.esti['tag'][index]['actual_less_wt'])) {
      this.esti['tag'][index]['gross_wt'] = this.esti['tag'][index]['actual_less_wt'];
      console.log(this.esti['tag'][index]['gross_wt'], 'gross');
    }

    if (parseFloat(this.esti['tag'][index]['less_wt']) > parseFloat(this.esti['tag'][index]['actual_less_wt'])) {
      this.esti['tag'][index]['less_wt'] = this.esti['tag'][index]['actual_less_wt'];
    }
    // this.checking(index)
    // if(this.esti_type == 'tag'){
    if (parseFloat(this.esti['tag'][index]['gross_wt']) <= parseFloat(this.esti['tag'][index]['actual_gross_wt']) && parseFloat(this.esti['tag'][index]['net_wt']) <= parseFloat(this.esti['tag'][index]['actual_net_wt']) && parseFloat(this.esti['tag'][index]['less_wt']) >= parseFloat(this.esti['tag'][index]['actual_less_wt'])) {
      this.esti['tag'][index]['net_wt'] = this.esti['tag'][index]['gross_wt'] - this.esti['tag'][index]['less_wt'];
      let detail = { itemData: this.esti['tag'][index], metalRate: this.metalRate, tax_details: this.taxGroupItems, item_type: 'tag' };
      this.esti['tag'][index] = this.retail.calculateSaleValue(detail);
      this.calcEstiSummary();

    } else {
      this.tagErrorMsg = "Entered weight greater than tag weight";
      // this.esti['tag'][index]['gross_wt']  = this.esti['tag'][index]['actual_gross_wt'] ;
      // this.esti['tag'][index]['less_wt']   = this.esti['tag'][index]['actual_less_wt'];
      // this.esti['tag'][index]['net_wt']    = this.esti['tag'][index]['actual_net_wt'];
      // Alert Message Timeout
      setTimeout(() => {
        this.tagErrorMsg = "";
      }, this.common.msgTimeout);
    }
    // }
    // else if(this.item_type == 'non_tag'){
    //   let stData = this.calcStoneDetail();
    //   this.ntData['stone_wt'] = stData['stone_wt'];
    //   this.ntData['stone_price'] = stData['stone_price'];
    //   if(parseFloat(this.ntData['gross_wt']) > parseFloat(this.selectedNTStock['gross_wt'])){
    //     this.ntData['gross_wt'] = this.selectedNTStock['gross_wt'];
    //   }
    //   if(parseFloat(this.ntData['less_wt']) > parseFloat(this.selectedNTStock['less_wt'])){
    //     this.ntData['less_wt'] = this.retail.setAsNumber(this.selectedNTStock['less_wt']);
    //   }
    //   if(parseFloat(this.ntData['piece']) > parseFloat(this.selectedNTStock['piece'])){
    //     this.ntData['piece'] = this.selectedNTStock['piece'];
    //   }
    //   this.ntData['net_wt']    = parseFloat(this.ntData['gross_wt']) - this.retail.setAsNumber(this.ntData['less_wt']);
    //   let detail = {itemData : this.ntData, metalRate : this.metalRate, tax_details : this.tax_details, item_type : this.item_type};
    //   this.ntData = this.retail.calculateSaleValue(detail);
    // }
    // else if(this.esti_type == 'home_bill'){
    //   let stData = this.calcStoneDetail();
    //   this.esti['home_bill'][index]['stone_wt'] = stData['stone_wt'];
    //   this.esti['home_bill'][index]['stone_price'] = stData['stone_price'];
    //   if(this.esti['home_bill'][index]['is_partly_sold'] == 1){
    //     if(parseFloat(this.esti['home_bill'][index]['gross_wt']) > parseFloat(this.esti['home_bill'][index]['stock_gross_wt'])){
    //       this.esti['home_bill'][index]['gross_wt'] = this.retail.setAsNumber(this.esti['home_bill'][index]['stock_gross_wt']);
    //     }
    //     if(parseFloat(this.esti['home_bill'][index]['less_wt']) > parseFloat(this.esti['home_bill'][index]['stock_less_wt'])){
    //       this.esti['home_bill'][index]['less_wt'] = this.retail.setAsNumber(this.esti['home_bill'][index]['stock_less_wt']);
    //     }
    //   }
    //   this.esti['home_bill'][index]['net_wt'] = parseFloat(this.esti['home_bill'][index]['gross_wt']) - this.retail.setAsNumber(this.esti['home_bill'][index]['less_wt']);
    //   let detail = {itemData : this.esti['home_bill'][index], metalRate : this.metalRate, tax_details : this.taxGroupItems, item_type : this.esti_type};
    //   this.esti['home_bill'][index] = this.retail.calculateSaleValue(detail);
    // }
  }
  calcSaleValuehome(index) {
    // let stData = this.calcStoneDetail();
    // this.esti['home_bill'][index]['stone_wt'] = stData['stone_wt'];
    // this.esti['home_bill'][index]['stone_price'] = stData['stone_price'];
    if (this.esti['home_bill'][index]['is_partly_sold'] == 1) {
      if (parseFloat(this.esti['home_bill'][index]['gross_wt']) > parseFloat(this.esti['home_bill'][index]['stock_gross_wt'])) {
        this.esti['home_bill'][index]['gross_wt'] = this.retail.setAsNumber(this.esti['home_bill'][index]['stock_gross_wt']);
      }
      if (parseFloat(this.esti['home_bill'][index]['less_wt']) > parseFloat(this.esti['home_bill'][index]['stock_less_wt'])) {
        this.esti['home_bill'][index]['less_wt'] = this.retail.setAsNumber(this.esti['home_bill'][index]['stock_less_wt']);
      }
    }
    this.esti['home_bill'][index]['net_wt'] = parseFloat(this.esti['home_bill'][index]['gross_wt']) - this.retail.setAsNumber(this.esti['home_bill'][index]['less_wt']);
    let detail = { itemData: this.esti['home_bill'][index], metalRate: this.metalRate, tax_details: this.taxGroupItems, item_type: this.esti_type };
    this.esti['home_bill'][index] = this.retail.calculateSaleValue(detail);

  }

  calcEstiSummary() {
    console.log(this.esti);
    this.tot_sale_wgt = 0;
    this.tot_sale_rate = 0;
    this.tot_purch_wgt = 0;
    this.tot_purch_rate = 0;
    this.tot_charge = 0;
    this.tot_incen = 0;

    this.esti['tag'].forEach(tag => {
      this.tot_sale_wgt = Number(this.tot_sale_wgt) + Number(tag.net_wt);
      this.tot_charge = Number(this.tot_charge) + Number(tag.charge_value);

      this.tot_sale_rate = Number(this.tot_sale_rate) + Number(tag.sales_value);
    })

    this.esti['tag'].forEach(tag => {

      this.tot_incen = Number(this.tot_incen) + Number(tag.incentive);
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
    this.tot_gift_rate = 0;
    this.esti['chit_details'].forEach(gift => {
      this.tot_gift_rate = Number(this.tot_gift_rate) + Number(gift.slip_amt);
    })
    this.total_esti_value = Number(this.tot_sale_rate) - Number(this.tot_purch_rate) - Number(this.advance) - Number(this.tot_gift_rate);
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

  closeScanner() {
    this.scannerOn = false;
    // this.scanSub.unsubscribe();
    // this.qrScanner.hide().then();
    // this.qrScanner.destroy().then();
  }

  openQRScanner() {
    this.scannerOn = true;

    console.log("QR Scanner");
    this.barcodeScanner.scan().then((barcodeData) => {

      this.scannerOn = false;
      if (barcodeData['text'] != '') {

        let text1 = barcodeData['text'];

        let text2 =
          text1.replace(/ /g, "");
        console.log(text2);

        this.getTagByID(text2);
      }

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
    }, err => {
      this.scannerOn = false;

      console.log(err)
    });
  }

  getTagByID(tagData) {

    this.showr = false;
    if (tagData != '') {
      var istagId = (tagData.search("/") > 0 ? true : false);
      // var isTagCode = (tagData.search("-") > 0 ? true : false);
      var isTagCode = ((tagData.search("-") > 0 || tagData.search("-") < 0) ? true : false);
      if (istagId) {
        var tId = tagData.split("/");
        var searchTxt = (tId.length >= 2 ? tId[0] : "");
        var searchField = this.checkold == true ? "old_tag_id" : "tag_id";
      }
      else if (isTagCode) {
        var searchTxt = tagData;
        var searchField = this.checkold == true ? "old_tag_id" : "tag_code";
      }
      else if (this.checkold) {
        var searchTxt = tagData;
        var searchField = "old_tag_id";
      }
      // Search Tag
      let loader = this.load.create({
        content: 'Please Wait',
        spinner: 'bubbles',
      });
      loader.present();
      var postData = { "searchTxt": searchTxt, "searchField": searchField, "id_branch": this.esti['id_branch'] };
      this.retail.getTagData(postData).then(data => {
        if (data.status) {
          this.tagMsg = data.msg;
          this.tagErrorMsg = "";

          let toastMsg = this.toast.create({
            message: this.tagMsg,
            duration: this.common.toastTimeout,
            position: 'middle'
          });
          toastMsg.present();

          setTimeout(() => {
            this.tagMsg = "";
          }, this.common.msgTimeout);
          data.tagData['actual_gross_wt'] = data.tagData['gross_wt'];
          data.tagData['actual_net_wt'] = data.tagData['net_wt'];
          data.tagData['charge_value'] = data.tagData['charge_value'];
          data.tagData['charges'] = data.tagData['charges'];
          data.tagData['checkwas'] = data.tagData['retail_max_wastage_percent'];
          data.tagData['searchTxt'] = searchTxt; // krish - 31.08.23
          data.tagData['searchField'] = searchField; // krish - 31.08.23
          data.tagData['metalratec'] = data.tagData['calculation_based_on'] == 4 ? 'true' : 'false';
          // data.tagData['tot_mc'] =  data.tagData['mc_type'] == 1? data.tagData['mc_value'] : data.tagData['mc_value'] * data.tagData['gross_wt'];
          // console.log( data.tagData['tot_mc'],'total mc value');
          if (data.tagData['stone_details'] && data.tagData['stone_details'].length > 0) {
            // reset before summing
            data.tagData['less_wt'] = 0;
            data.tagData['stone_price'] = 0;


            data.tagData['stone_details'].forEach(element => {
              let wt = parseFloat(element['wt']) || 0; // ensure number

              if (element['is_apply_in_lwt'] == '1') {
                if (element['uom_id'] == '6') {
                  wt = wt / 5;
                  // element['wt'] = wt.toString(); // keep as string if needed
                }
                data.tagData['less_wt'] = parseFloat((data.tagData['less_wt'] + wt).toFixed(3)); // proper numeric addition
              }
              this.tag_stoneamount_calc(element);
              let amt = parseFloat(element['amount']) || 0; // ensure number

              data.tagData['stone_price'] = parseFloat((data.tagData['stone_price'] + amt).toFixed(3)); // proper numeric addition

            });
          }

            // Other Metal Calculation  : 

            data.tagData['other_metal_total_price'] = 0;
            if (data.tagData['othermetal_details'] && data.tagData['othermetal_details'].length > 0) {
              data.tagData['othermetal_details'].forEach(om => {
                // Convert safely
                const net_wt = parseFloat(om.tag_other_itm_grs_weight) || 0;
                const wastage_perc = parseFloat(om.tag_other_itm_wastage) || 0;
                const mc_type = parseInt(om.tag_other_itm_cal_type) || 0;
                const making_charge = parseFloat(om.tag_other_itm_mc) || 0;
                const rate_per_gram = parseFloat(om.tag_other_itm_rate) || 0;

                // Calculate wastage weight
                const wast_wt = (net_wt * wastage_perc) / 100;

                // MC value — if per gram → multiply, if per piece → take directly
                const mc_value = mc_type === 1 ? net_wt * making_charge :
                  mc_type === 2 ? making_charge : 0;

                // Total
                const total_amount = (rate_per_gram * (net_wt + wast_wt) + mc_value);

                data.tagData['other_metal_total_price'] += total_amount;
              });
            }

          console.log(data.tagData['less_wt'], 'less wt');
          console.log(data.tagData['stone_price'], 'stone price');


          data.tagData['actual_less_wt'] = data.tagData['less_wt'];
          console.log(data.tagData);
          
    
          let detail = { itemData: data.tagData, metalRate: this.metalRate, tax_details: this.taxGroupItems, item_type: "tag" };
          let tagItem = this.retail.calculateSaleValue(detail);
          let addItem = true;
          this.esti['tag'].forEach(item => {
            if (item.tag_id == tagItem.tag_id) {
              this.tagMsg = "";
              addItem = false;
              this.tagErrorMsg = "Tag Already exist..";

              let toastMsg = this.toast.create({
                message: this.tagErrorMsg,
                duration: this.common.toastTimeout,
                position: 'middle'
              });
              toastMsg.present();

              setTimeout(() => {
                this.tagErrorMsg = "";
              }, this.common.msgTimeout);
            }
          })
          if (addItem) {
            this.esti['is_tag'] = true;
            this.esti['tag'].push(tagItem);
            // ✅ Now recalc totals after adding item
            this.calculateTotals();
          }
          let y: any = Object.assign({}, this.esti['tag']);
          console.log('yyyyyyyyyyyy : ', y);
          localStorage.removeItem('actualTag');
          console.log('clear : ', JSON.parse(localStorage.getItem('actualTag')));

          localStorage.setItem('actualTag', JSON.stringify(y));
          console.log('clear 1 : ', JSON.parse(localStorage.getItem('actualTag')));
          this.esti['tag'].reverse();
          console.log(this.esti['tag']);
          this.tagData['tag_code'] = '';
          this.tagData['tag_code1'] = '';
          this.tagData['tag_code2'] = '';

        } else {

          this.tagMsg = "";
          this.tagErrorMsg = data.msg;

          let toastMsg = this.toast.create({
            message: this.tagErrorMsg,
            duration: this.common.toastTimeout,
            position: 'middle'
          });
          toastMsg.present();
          setTimeout(() => {
            this.tagErrorMsg = "";
          }, this.common.msgTimeout);
        }

        loader.dismiss();
      })
    }
  }

  calculateTotals() {

    // ✅ Reset fields
    this.totalPieces = 0;
    this.totalGwt = 0;
    this.totalNwt = 0;
    this.totalTaxable = 0;
    this.totalGST = 0;
    this.totalStoneWt = 0;
    this.totalStoneAmount = 0;
    this.totalDiaWt = 0;
    this.totalDiaAmount = 0;

    // ✅ Loop through each tag item
    this.esti['tag'].forEach(item => {

      this.totalPieces += Number(item.piece) || 0;
      this.totalGwt += Number(item.gross_wt) || 0;
      this.totalNwt += Number(item.net_wt) || 0;
      this.totalTaxable += Number(item.taxable) || 0;

      // ✅ Add GST
      this.totalGST += Number(item.tax_price) || 0;

      // ✅ Stone Details
      if (item.stone_details && item.stone_details.length > 0) {

        item.stone_details.forEach(st => {
          if (st.stone_type == 1) {
            this.totalDiaWt += Number(st.wt) || 0;
            this.totalDiaAmount += Number(st.amount) || 0;
          } else {
            // ✅ Stone Weight
            this.totalStoneWt += Number(st.wt) || 0;
            // ✅ Stone Amount
            this.totalStoneAmount += Number(st.amount) || 0;
          }


        });
      }
    });

    // ✅ Fix decimals
    this.totalGwt = Number(this.totalGwt.toFixed(3));
    this.totalNwt = Number(this.totalNwt.toFixed(3));
    this.totalTaxable = Number(this.totalTaxable.toFixed(2));
    this.totalGST = Number(this.totalGST.toFixed(2));

    this.totalStoneWt = Number(this.totalStoneWt.toFixed(3)); // ✅ NEW rounding
    this.totalStoneAmount = Number(this.totalStoneAmount.toFixed(2));

    // ✅ Invoice Value = taxable + gst
    this.invoiceValue = Number((this.totalTaxable + this.totalGST).toFixed(2));

    // ✅ Net Total = round(invoice value)
    this.netTotal = Math.round(this.invoiceValue);
  }




  tag_stoneamount_calc(data) {
    if (data["stone_cal_type"] == "2") {
      data["amount"] = (data["pieces"] * data["rate_per_gram"]).toFixed(3);
    } else if (data["stone_cal_type"] == "1") {
      data["amount"] = (data["wt"] * data["rate_per_gram"]).toFixed(3);
    }
  }



  getorderByID(tagData) {
    this.esti['tag'] = [];
    // if(tagData != ''){
    //  var istagId = (tagData.search("/") > 0 ? true : false);
    //  var isTagCode = (tagData.search("-") > 0 ? true : false);
    //  if(istagId){
    //    var tId   = tagData.split("/");
    //    var searchTxt = (tId.length >= 2 ? tId[0] : "");
    //    var searchField  = this.checkold == true ? "old_tag_id" : "tag_id";
    //  }
    //  else if(isTagCode){
    //    var searchTxt = tagData;
    //    var searchField  = this.checkold == true ? "old_tag_id" : "tag_code";
    //  }
    // Search Tag

    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();
    var postData = { 'ratetype': this.tagData['taged'], "fin_year": this.tagData['fin_year'], "searchTxt": tagData, "searchField": 'order_id', "id_branch": this.esti['id_branch'] };
    console.log(postData, 'post data');

    this.retail.getorderData(postData).then(data => {
      if (data.status) {


        this.tagData['taged'] = data.rate_type
        console.log(data['tagData'])
        data['tagData'].forEach((element, i) => {

          if (i == data['tagData'].length - 1) {

            this.tagMsg = data.msg;
            this.tagErrorMsg = "";

            let toastMsg = this.toast.create({
              message: this.tagMsg,
              duration: this.common.toastTimeout,
              position: 'middle'
            });
            toastMsg.present();

            setTimeout(() => {
              this.tagMsg = "";
            }, this.common.msgTimeout);
          }

          element['actual_gross_wt'] = element['gross_wt'];
          element['actual_less_wt'] = element['less_wt'];
          element['actual_net_wt'] = element['net_wt'];
          element['charge_value'] = element['charge_value'];
          element['charges'] = element['charges'];
          element['checkwas'] = element['retail_max_wastage_percent'];
          element['metalratec'] = this.tagData['taged'] == 1 ? 'true' : 'false';
          element['rate_per'] = element['order_rate'];

          if (element['stone_details'] && element['stone_details'].length > 0) {
            // reset before summing
            element['less_wt'] = 0;
            element['stone_price'] = 0;


            element['stone_details'].forEach(data => {
              let wt = parseFloat(data['wt']) || 0; // ensure number

              if (data['is_apply_in_lwt'] == '1') {
                if (data['uom_id'] == '6') {
                  wt = wt / 5;
                  // data['wt'] = wt.toString(); // keep as string if needed
                }

                element['less_wt'] = parseFloat((element['less_wt'] + wt).toFixed(3)); // proper numeric addition
              }
              this.tag_stoneamount_calc(data);
              let amt = parseFloat(data['amount']) || 0; // ensure number
              element['stone_price'] = parseFloat((element['stone_price'] + amt).toFixed(3)); // proper numeric addition


            });
          }

          console.log(element['less_wt'], 'less wt');
          console.log(element['stone_price'], 'stone price');

          this.esti['cus_id'] = element['id_customer'];
          this.esti['customer'] = element['cus_label'];
          this.esti['firstname'] = element['firstname'];


          let detail = { itemData: element, metalRate: this.metalRate, tax_details: this.taxGroupItems, item_type: "tag" };
          let tagItem = this.retail.calculateSaleValue(detail);
          let addItem = true;
          this.esti['tag'].forEach(item => {
            if (item.tag_id == tagItem.tag_id) {
              this.tagMsg = "";
              addItem = false;
              this.tagErrorMsg = "Tag Already exist..";

              let toastMsg = this.toast.create({
                message: this.tagErrorMsg,
                duration: this.common.toastTimeout,
                position: 'middle'
              });
              toastMsg.present();

              setTimeout(() => {
                this.tagErrorMsg = "";
              }, this.common.msgTimeout);
            }


          })


          if (addItem) {
            this.esti['is_tag'] = true;
            this.esti['tag'].push(tagItem);
          }
          let y: any = Object.assign({}, this.esti['tag']);
          console.log(y);

          // this.esti['tag'].forEach(item => {
          // item['tot_mc'] = item['mc_type'] == 1? item['mc_value']: item['mc_value'] * item['gross_wt'];
          //   console.log(item['tot_mc'],'value');
          // })
          this.esti['tag'].reverse();
          console.log(this.esti['tag']);

        });

        if (data.hasOwnProperty('advance_amount')) {
          this.advance = data['advance_amount'];
        }

        this.showr = true;

      } else {

        this.tagMsg = "";
        this.tagErrorMsg = data.msg;

        let toastMsg = this.toast.create({
          message: this.tagErrorMsg,
          duration: this.common.toastTimeout,
          position: 'middle'
        });
        toastMsg.present();
        setTimeout(() => {
          this.tagErrorMsg = "";
        }, this.common.msgTimeout);
      }

      loader.dismiss();

    })

    // }
  }

  deleteItem(item_type, idx) {
    console.log(this.esti[item_type])
    console.log(idx)

    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    if (item_type == 'tag') {
      this.esti[item_type].splice(idx, 1);
      this.calculateTotals();
      this.tagErrorMsg = "";
      this.tagMsg = "Tag removed from estimation..";

      let toastMsg = this.toast.create({
        message: this.tagMsg,
        duration: this.common.toastTimeout,
        position: 'middle'
      });
      toastMsg.present();

      setTimeout(() => {
        this.tagMsg = "";
      }, this.common.msgTimeout);
    }
    if (item_type == 'non_tag') {
      this.esti[item_type].splice(idx, 1);
      this.ntErrorMsg = "";
      this.ntMsg = "Non-Tag item removed from estimation..";
      setTimeout(() => {
        this.ntMsg = "";
      }, this.common.msgTimeout);
    }
    if (item_type == 'home_bill') {
      this.esti[item_type].splice(idx, 1);
      this.hbErrorMsg = "";
      this.hbMsg = "Home Bill item removed from estimation..";

      let toastMsg = this.toast.create({
        message: this.hbMsg,
        duration: this.common.toastTimeout,
        position: 'middle'
      });
      toastMsg.present();
      setTimeout(() => {
        this.hbMsg = "";
      }, this.common.msgTimeout);
    }
    if (item_type == 'old_metal') {
      this.esti[item_type].splice(idx, 1);
      this.omErrorMsg = "";
      this.ombMsg = "Old Metal item removed from estimation..";

      let toastMsg = this.toast.create({
        message: this.ombMsg,
        duration: this.common.toastTimeout,
        position: 'middle'
      });
      toastMsg.present();

      setTimeout(() => {
        this.ombMsg = "";
      }, this.common.msgTimeout);
    }
    this.calcEstiSummary();
    loader.dismiss();
  }


  chooseemp(i) {

    let modal = this.modal.create(EmpSearchPage, { "empData": this.employees })
    modal.present();
    modal.onDidDismiss(data => {
      if (data != null) {
        this.esti[this.esti_type][i]['emp_name'] = data.emp_name;
        this.esti[this.esti_type][i]['id_employee'] = data.id_employee;
        console.log(this.esti[this.esti_type][i]['id_employee'])
      }
    });
  }
  /*   createEsti() {
      if (this.esti['cus_id'] == '' || this.esti['id_employee'] == '' || this.esti['id_branch'] == '') {
  
        let modal = this.modal.create(CusSearchPage, { 'show': 'true', 'first': this.esti['firstname'] })
        modal.present();
        modal.onDidDismiss(mData => {
          console.log(mData)
          if (mData != null) {
  
            this.esti['cus_id'] = mData['id_customer'];
            this.esti['customer'] = mData['label'];
            this.esti['firstname'] = mData['firstname'];
  
            this.createEstisubmit();
  
          } else {
  
          }
        });
      }
      else {
        this.createEstisubmit();
  
      }
  
    } */


  createEsti() {
    let modal = this.modal.create(EmpSearchPage, { "empData": this.employees })
    modal.present();
    modal.onDidDismiss(data => {
      if (data != null) {
        this.esti['id_employee'] = data.id_employee;
        this.esti['emp_name'] = data.emp_name;
        if (this.esti['cus_id'] == '' || this.esti['id_employee'] == '' || this.esti['id_branch'] == '') {
          let modal = this.modal.create(CusSearchPage, { 'show': 'true', 'first': this.esti['firstname'] })
          modal.present();
          modal.onDidDismiss(mData => {
            console.log(mData)
            if (mData != null) {
              this.esti['cus_id'] = mData['id_customer'];
              this.esti['customer'] = mData['label'];
              this.esti['firstname'] = mData['firstname'];
              this.esti['esti_for'] = mData['cus_type'] == 2 ? 3 : mData['cus_type'];
              this.createEstisubmit();
            } else {
            }
          }
          );
        } else {
          this.createEstisubmit();
        }
      }
    }
    );
  }


  // createEstiprint() {
  //   if (this.esti['cus_id'] == '' || this.esti['id_employee'] == '' || this.esti['id_branch'] == '') {

  //     let modal = this.modal.create(CusSearchPage, { 'show': 'true', 'first': this.esti['firstname'] })
  //     modal.present();
  //     modal.onDidDismiss(mData => {
  //       console.log(mData)
  //       if (mData != null) {

  //         this.esti['cus_id'] = mData['id_customer'];
  //         this.esti['customer'] = mData['label'];
  //         this.esti['firstname'] = mData['firstname'];

  //         this.createEstisubmitprint();

  //       } else {

  //       }
  //     });
  //   }
  //   else {
  //     this.createEstisubmitprint();

  //   }
  // }

  createEstiprint() {
    let modal = this.modal.create(EmpSearchPage, { "empData": this.employees })
    modal.present(); modal.onDidDismiss(data => {
      if (data != null) {
        this.esti['id_employee'] = data.id_employee; this.esti['emp_name'] = data.emp_name; if (this.esti['cus_id'] == '' || this.esti['id_employee'] == '' || this.esti['id_branch'] == '') {
          let modal = this.modal.create(CusSearchPage, { 'show': 'true', 'first': this.esti['firstname'] })
          modal.present();
          modal.onDidDismiss(mData => {
            console.log(mData)
            if (mData != null) {
              this.esti['cus_id'] = mData['id_customer'];
              this.esti['customer'] = mData['label'];
              this.esti['firstname'] = mData['firstname'];
              this.createEstisubmitprint();
            } else {

            }
          });
        } else {
          this.createEstisubmitprint();
        }
      }
    });
  }

  createEstisubmitprint() {
    this.esti['is_tag'] = ((this.esti['tag']).length > 0 ? true : false);
    this.esti['is_non_tag'] = ((this.esti['non_tag']).length > 0 ? true : false);
    this.esti['is_home_bill'] = ((this.esti['home_bill']).length > 0 ? true : false);
    this.esti['is_old_metal'] = ((this.esti['old_metal']).length > 0 ? true : false);
    console.log(this.esti);
    // Validate Postdata
    if (this.esti['cus_id'] == '' || this.esti['id_employee'] == '' || this.esti['id_branch'] == '') {
      let toastMsg = this.toast.create({
        message: "Please fill required fields",
        duration: this.common.toastTimeout,
        position: 'middle'
      });
      toastMsg.present();
    }
    else if (this.esti['is_tag'] || this.esti['is_non_tag'] || this.esti['is_home_bill'] || this.esti['is_old_metal']) {
      if (this.esti['tag'] || this.esti['non_tag'] || this.esti['home_bill'] || this.esti['old_metal']) {
        let loader = this.load.create({
          content: 'Please Wait',
          spinner: 'bubbles',
        });
        loader.present();
        this.esti['type'] = 1;
        this.esti['total_cost'] = this.total_esti_value;
        this.retail.createEstimation(this.esti).then(data => {
          if (data.status) {
            data['cus_id'] = this.esti['cus_id'];
            data['id_employee'] = this.esti['id_employee'];
            data['id_branch'] = this.esti['id_branch'];

            let modal = this.modal.create(WriteReviewPage, { 'data': data }, {
              cssClass: "my-modal"
            })
            modal.present();
            modal.onDidDismiss(mData => {
              this.tot_sale_wgt = 0;
              this.tot_sale_rate = 0;
              this.tot_purch_wgt = 0;
              this.tot_purch_rate = 0;
              this.total_esti_value = 0;
              this.tot_charge = 0;

              this.selectedCusData = [];
              this.esti = { 'choose': '', "cus_id": this.esti['cus_id'], "customer": this.esti['customer'], "id_branch": this.esti['id_branch'], "id_employee": this.esti['id_employee'], "emp_name": this.esti['emp_name'], "is_tag": false, "is_non_tag": false, "is_home_bill": false, "is_old_metal": false, "tag": [], "non_tag": [], "home_bill": [], "old_metal": [], "chit_details": [{ 'slip_no': '', 'slip_amt': '' }] };
              // if(data.printURL != ''){
              //   console.log(data.printURL);
              //   this.downloadfile(data.printURL,data.esti_name);
              // }
              this.nav.setPages([{ page: HomePage }, { page: BluetoothPage, params: { 'file': data } }]);
            });
          }
          loader.dismiss();
          let toastMsg = this.toast.create({
            message: data.msg,
            duration: this.common.toastTimeout,
            position: 'middle'
          });
          toastMsg.present();
          // this.navCtrl.setRoot(HomePage);
        })
      }
      else {
        let toastMsg = this.toast.create({
          message: "Minimum 1 estimation item is required",
          duration: this.common.toastTimeout,
          position: 'middle'
        });
        toastMsg.present();
      }
    }
    else {
      let toastMsg = this.toast.create({
        message: "Invalid Estimation",
        duration: this.common.toastTimeout,
        position: 'middle'
      });
      toastMsg.present();
    }

  }

  createEstisubmit() {

    //     let temp =['home_bill','non_tag','old_metal','tag'];
    //     console.log(temp)
    //     console.log(this.esti)

    //     for (let i = 0; i < temp.length; i++) {

    //       for (let index = 0; index < this.esti[temp[i]].length; index++) {
    //         if(this.esti[temp[i]][index]['id_employee'] == '' ){
    //         this.ferror = false;
    //         break;
    //       }
    //       else{
    //         this.ferror = null;
    //       }
    //     }
    //     if( this.ferror == false){
    //       break;

    //     }
    //     };
    // console.log(this.ferror)


    //     if( this.ferror != false){

    /* krishna */

    this.esti['is_tag'] = ((this.esti['tag']).length > 0 ? true : false);
    this.esti['is_non_tag'] = ((this.esti['non_tag']).length > 0 ? true : false);
    this.esti['is_home_bill'] = ((this.esti['home_bill']).length > 0 ? true : false);
    this.esti['is_old_metal'] = ((this.esti['old_metal']).length > 0 ? true : false);
    this.esti['goldrate_22ct'] = this.metalRate['goldrate_22ct'];
    this.esti['silverrate_1gm'] = this.metalRate['silverrate_1gm'];

    console.log(this.esti);
    // Validate Postdata
    // || this.esti['id_employee'] == ''
    if (this.esti['cus_id'] == '' || this.esti['id_branch'] == '') {
      let toastMsg = this.toast.create({
        message: "Please fill required fields",
        duration: this.common.toastTimeout,
        position: 'middle'
      });
      toastMsg.present();
    }
    else if (this.esti['is_tag'] || this.esti['is_non_tag'] || this.esti['is_home_bill'] || this.esti['is_old_metal']) {
      if (this.esti['tag'] || this.esti['non_tag'] || this.esti['home_bill'] || this.esti['old_metal']) {
        let loader = this.load.create({
          content: 'Please Wait',
          spinner: 'bubbles',
        });
        loader.present();
        this.esti['type'] = 1;
        this.esti['total_cost'] = this.total_esti_value;
        console.log(this.esti);

        this.retail.createEstimation(this.esti).then(data => {

          //   {
          //     cssClass: "my-modal"
          // }
          data['cus_id'] = this.esti['cus_id'];
          data['id_employee'] = this.esti['id_employee'];
          data['id_branch'] = this.esti['id_branch'];

          let modal = this.modal.create(WriteReviewPage, { 'data': data }, {
            cssClass: "my-modal"
          })
          modal.present();
          modal.onDidDismiss(mData => {

            if (data.status) {
              this.tot_sale_wgt = 0;
              this.tot_sale_rate = 0;
              this.tot_purch_wgt = 0;
              this.tot_purch_rate = 0;
              this.total_esti_value = 0;
              this.tot_charge = 0;

              this.selectedCusData = [];
              this.esti = { 'choose': '', "cus_id": this.esti['cus_id'], "customer": this.esti['customer'], "id_branch": this.esti['id_branch'], "id_employee": this.esti['id_employee'], "emp_name": this.esti['emp_name'], "is_tag": false, "is_non_tag": false, "is_home_bill": false, "is_old_metal": false, "tag": [], "non_tag": [], "home_bill": [], "old_metal": [], "chit_details": [{ 'slip_no': '', 'slip_amt': '' }] };
              if (data.printURL != '') {
                console.log(data.printURL);
                this.downloadfile(data.printURL, data.esti_name);
              }
            }
            loader.dismiss();
            let toastMsg = this.toast.create({
              message: data.msg,
              duration: this.common.toastTimeout,
              position: 'middle'
            });
            toastMsg.present();
            this.navCtrl.setRoot(HomePage);
          });
        })
      }
      else {
        let toastMsg = this.toast.create({
          message: "Minimum 1 estimation item is required",
          duration: this.common.toastTimeout,
          position: 'middle'
        });
        toastMsg.present();
      }
    }
    else {
      let toastMsg = this.toast.create({
        message: "Invalid Estimation",
        duration: this.common.toastTimeout,
        position: 'middle'
      });
      toastMsg.present();
    }
    // }
    // else{
    //   let toastMsg = this.toast.create({
    //     message: "Please choose employee",
    //     duration: this.common.toastTimeout,
    //     position: 'middle'
    //   });
    //   toastMsg.present();
    // }
  }

  getEstiByEstiNo(no) {

    if (no != '') {
      this.estiDetail['esti_no'] = no;
    }
    if (this.estiDetail['esti_no'] != '') {
      let loader = this.load.create({
        content: 'Please Wait',
        spinner: 'bubbles',
      });
      loader.present();
      this.estiDetail['id_branch'] = this.loggedInBranch;
      this.retail.getEstiPrintURL(this.estiDetail).then(data => {
        if (data.status) {
          if (data.printURL != '') {
            console.log(data.printURL);
            this.downloadfile(data.printURL, data.esti_name);
          }
        }
        loader.dismiss();
        let toastMsg = this.toast.create({
          message: data.msg,
          duration: this.common.toastTimeout,
          position: 'middle'
        });
        toastMsg.present();
      })
    } else {
      let toastMsg = this.toast.create({
        message: "Enter valid estimation number",
        duration: this.common.toastTimeout,
        position: 'middle'
      });
      toastMsg.present();
    }
  }

  downloadfile(url, name) {
    console.log(url)
    var date = new Date();
    date.setDate(date.getDate());
    console.log(date.toISOString().split('T')[0])
    this.platform.ready().then(() => {
      console.log("Platform ready");
      if (this.platform.is('android')) {
        console.log("Platform Android");
        this.file.checkDir(this.file.externalDataDirectory, this.common.cmpShortName).then((data) => {
          console.log("Check directory IDO");
          this.file.checkDir(this.file.externalDataDirectory + '' + this.common.cmpShortName + '/', date.toISOString().split('T')[0]).then(_ => {
            console.log("Check directory IDO " + date.toISOString().split('T')[0]);
            this.viewFile(url, name);
          }).catch(er => {
            this.file.createDir(this.file.externalDataDirectory + '' + this.common.cmpShortName + '/', date.toISOString().split('T')[0], false).then(_ => {
              console.log("Create directory IDO " + date.toISOString().split('T')[0]);
              this.viewFile(url, name);
            }).catch(err => {
              console.log(err);
              console.log('Couldn\'t create directory')
            });
          });
        }).catch(err => {
          this.file.createDir(this.file.externalDataDirectory, this.common.cmpShortName, false).then(_ => {
            console.log('Create directory IDO')
            this.file.createDir(this.file.externalDataDirectory + '' + this.common.cmpShortName + '/', date.toISOString().split('T')[0], false).then(_ => {
              console.log('Create directory IDO / ' + date.toISOString().split('T')[0]);
              this.viewFile(url, name);
            }).catch(err1 => {
              console.log(err1);
              console.log('Couldn\'t create directory')
            });
          }).catch(err2 => {
            console.log(err2);
            console.log('Couldn\'t create directory')
          });
        });
      }
    });
  }

  viewFile(url, name) {
    var date = new Date();
    date.setDate(date.getDate());
    console.log(date);
    console.log(date.toISOString().split('T')[0])
    this.platform.ready().then(() => {
      console.log('platform ready viewFile')
      this.file.resolveDirectoryUrl(this.file.externalDataDirectory + '' + this.common.cmpShortName + '/' + date.toISOString().split('T')[0]).then((resolvedDirectory) => {
        console.log(resolvedDirectory);
        console.log("resolved  directory: " + resolvedDirectory.nativeURL);
        this.file.checkFile(resolvedDirectory.nativeURL, name).then((data) => {
          console.log(data)
          console.log(resolvedDirectory.nativeURL + name)
          this.fileOpener.open(resolvedDirectory.nativeURL + name, 'application/pdf')
            .then(() => console.log('File is opened'))
            .catch(e => console.log('Error opening file', e));
          // this.printEsti(resolvedDirectory.nativeURL+name,name);

        }, err => {
          console.log(err)
          let loader = this.load.create({
            content: 'Please Wait',
            spinner: 'bubbles',
          });
          loader.present();

          var targetPath = this.file.externalDataDirectory + '' + this.common.cmpShortName + '/' + date.toISOString().split('T')[0] + '/' + name;
          this.fileTransfer.download(url, targetPath, true).then((entry) => {
            console.log('download complete: ' + entry.toURL());
            loader.dismiss();
            this.fileOpener.open(entry.toURL(), 'application/pdf')
              .then(() => console.log('File is opened'))
              .catch(e => console.log('Error opening file', e));
            // this.printEsti(entry.toURL(),name);
          }, (error) => {
            loader.dismiss();
            console.log(error);
          });
        });
      }, err => {
        console.log(err)
      });
    });
  }

  printEsti(content, ename) {
    console.log(content);
    console.log(ename);


    this.printer.isAvailable().then(onSuccess => {
      console.log("isAvailable - Success");
    },
      onError => {
        console.log(onError);
        console.log("isAvailable - Error");
      });

    let options: PrintOptions = {
      name: ename,
      //printerId: 'printer007',
      //duplex: true,
      //landscape: true,
      grayscale: true
    };

    this.printer.print(content, options).then(onSuccess => {
      console.log("print - Success");
    },
      onError => {
        console.log("print - Error");
      });

  }

append(event) {
  // Uppercase the entered code
  this.tagData['tag_code'] = (this.tagData['tag_code'] || '').toUpperCase();

  // On Enter key, fetch tag details
  if (event.keyCode === 13) {
    this.getTagByID(this.tagData['tag_code']);
  }
}


  goto() {

    this.navCtrl.setRoot(HomePage);
  }
  tog(type) {

    if (type == 'tag') {

      if (this.togtype == '' || this.togtype == 'home_bill' || this.togtype == 'old_metal' || this.togtype == 'non_tag') {
        this.togtype = type;

        console.log(this.togtype)
      }
      else {
        this.togtype = '';

      }
    }

    else if (type == 'home_bill') {

      if (this.togtype == '' || this.togtype == 'tag' || this.togtype == 'old_metal' || this.togtype == 'non_tag') {
        this.togtype = type;

        console.log(this.togtype)
      }
      else {
        this.togtype = '';

      }
    }

    else if (type == 'old_metal') {

      if (this.togtype == '' || this.togtype == 'tag' || this.togtype == 'home_bill' || this.togtype == 'non_tag') {
        this.togtype = type;

        console.log(this.togtype)
      }
      else {
        this.togtype = '';

      }
    }
    else if (type == 'non_tag') {

      if (this.togtype == '' || this.togtype == 'tag' || this.togtype == 'home_bill' || this.togtype == 'old_metal') {
        this.togtype = type;

        console.log(this.togtype)
      }
      else {
        this.togtype = '';

      }
    }
  }
  print(data) {
    this.nav.push(BluetoothPage, { 'file': data });

  }
  opengift() {

    this.navCtrl.push(GiftPage, { 'chit': this.esti['chit_details'], 'id_customer': this.esti['cus_id'], 'esti': this.esti, 'rate': this.metalRate['goldrate_22ct'], 'settings': this.ret_settings })

  }
  checking(index) {

    console.log(parseInt(this.esti['tag'][index]['less_wt']) > parseInt(this.esti['tag'][index]['net_wt']))
    if (parseInt(this.esti['tag'][index]['less_wt']) > parseInt(this.esti['tag'][index]['net_wt'])) {

      this.cd.detectChanges();
      this.esti['tag'][index]['less_wt'] = '';
      this.cd.detectChanges();
      this.content.resize();
      this.calcSaleValue(index);
    }
    else {
      this.calcSaleValue(index);

    }
  }
  currencysettings() {

    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();

    this.common.getCurrencyAndSettings({ "id_metalrates": this.esti['choose'], "id_branch": this.esti['id_branch'] }).then(data => {
      this.metalRate = data.metal_rates;
      this.settings = data.settings;
      this.ret_settings = data.ret_settings;
      this.events.publish('settings:loaded', true);
      this.events.publish('ret_settings:loaded', true);
      this.dataCheckList['settings'] = true;
      loader.dismiss();
      if (this.navParams.get('ecat') != undefined) {

        this.tagData['tag_code'] = this.navParams.get('ecat');
        this.esti['id_branch'] = this.navParams.get('bcode');
        this.esti['tag'] = [];
        this.getTagByID(this.tagData['tag_code']);

      }
    })
  }
  showreward() {

    this.tot_incen = 0;


    this.esti['tag'].forEach(tag => {

      this.tot_incen = Number(this.tot_incen) + Number(tag.incentive);
    })

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Congratulations Your Total Incentive',
      buttons: [
        {
          text: '₹' + this.tot_incen.toString(),
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();

  }


  texto(event) {
    if (event.keyCode == 13) {
      this.getorderByID(this.tagData['order_id']);
    }
    console.log(event)
  }
  texto1(event) {
    if (event.keyCode == 13) {
      this.getEstiByEstiNo('');
    }
    console.log(event)
  }
  checkesti() {

  }

  from(type, item1, action) {

    this.esti['estimation'] = this.es;

    console.log(type)
    console.log(this.esti)

    console.log(item1)
    console.log(action)
    let idx = -1;
    let estiData = [];
    if (action == 'edit') {
      estiData = item1;
      idx = this.esti[type].indexOf(item1);
      console.log(idx)
      console.log(item1)
      console.log(this.esti);
      console.log(this.esti[type][idx]);
    }
    let data: any = { type: type, action: action, ret_settings: this.ret_settings, esti: estiData, id_branch: this.esti['id_branch'], metal_rates: this.metalRate, taxGroupItems: this.taxGroupItems, nonTagStock: this.nonTagStock, homeBillStock: this.homeBillStock, purities: this.purities, collections: this.collections, oldMetalCat: this.oldMetalCat, stoneMasData: this.stoneMasData, oldMetalTypes: this.oldMetalTypes };
    console.log(data);
    // let modal = this.modal.create(AddEstiItemPage,data,{enableBackdropDismiss: false})
    // modal.present();
    // modal.onDidDismiss(data => {
    if (item1 != null) {
      console.log(1)
      if (item1.item_data != null) {
        // ADD
        console.log(2)
        if (action == 'add') {
          let addItem = true;
          console.log(3)
          if (type == "tag") { // Tag Item
            this.esti[type].forEach(item => {
              if (item.tag_id == item1.item_data.tag_id) {
                addItem = false;
                this.tagMsg = "";
                this.tagErrorMsg = "Tag Already exist..";

                let toastMsg = this.toast.create({
                  message: this.tagErrorMsg,
                  duration: this.common.toastTimeout,
                  position: 'middle'
                });
                toastMsg.present();

                setTimeout(() => {
                  this.tagErrorMsg = "";
                }, this.common.msgTimeout);
              }
            })
          }
          if (addItem) {
            this.esti[type].push(item1.item_data);
          }
        }
        // UPDATE
        if (action == 'edit' && idx >= 0) {
          // console.log(idx)
          // console.log(this.esti[type][idx]);
          // console.log(data.item_data);

          this.esti[type][idx] = item1.item_data;
        }

      }
      this.calcEstiSummary();
      if (data.submitType == 'SN') { // Save and New
        this.openItemAddModal(type, '', 'add');
      }
    }
    else if (action == 'edit' && idx >= 0) {
      console.log(estiData);
      this.esti[type][idx] = estiData;
    }
    let y: any = Object.assign({}, this.esti[type]);
    console.log(y);
    if (action != 'edit') {

      this.esti[type].reverse();
    }
    console.log(this.esti[type]);
    // });

  }
  edittag(data) {
    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();
    console.log(data['estimation_id'])
    this.commonservice.getedit(data['estimation_id']).then(res => {

      let tag = res.hasOwnProperty('tag_details') ? res['tag_details'] : [];
      let non_tag = res.hasOwnProperty('non_tag_details') ? res['non_tag_details'] : [];
      let home_bill = res.hasOwnProperty('est_home_bill') ? res['est_home_bill'] : [];
      let old_metal = res.hasOwnProperty('old_metal') ? res['old_metal'] : [];


      console.log(tag)
      loader.dismiss();
      // this.navCtrl.push(EstiPage,{'tag':temp});
      this.nav.push(EstiPage, { 'estimation': res['estimation'], 'old_metal': old_metal, 'home_bill': home_bill, 'non_tag': non_tag, 'tag': tag, "page_type": 'create', 'empname': this.empData['username'], 'empid': this.empData['uid'], 'bname': '', 'bid': this.empData['id_branch'] });

    }, err => {
      loader.dismiss();
    });
  }



  validateKey(event: KeyboardEvent) {
    const charCode = event.charCode;
    if (charCode != 0 && (charCode < 49 || charCode > 57)) {
      event.preventDefault(); // block 0-characters and non-numbers
    }
  }

}
