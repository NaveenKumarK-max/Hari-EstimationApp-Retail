import { Toast } from 'ionic-native';
import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { IonicPage, NavParams, ViewController, LoadingController, Events, ModalController, ToastController } from 'ionic-angular';
import { CommonProvider } from '../../../providers/common';
import { RetailProvider } from '../../../providers/retail';
import { MasSearchPage } from '../../modal/mas-search/mas-search';
import { AddStoneDetailPage } from '../../modal/add-stone-detail/add-stone-detail';
import { OtherPage } from '../../other/other';
import { Content } from 'ionic-angular';
import { Mass2Page } from '../../mass2/mass2';
import { ChargesPage } from '../../charges/charges';
import { Mass3Page } from '../../mass3/mass3';
import { E } from '@angular/core/src/render3';

declare var window: any;
/**
 * Generated class for the CusSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-add-esti-item',
  templateUrl: 'add-esti-item.html',
  providers: [CommonProvider, RetailProvider]

})
export class AddEstiItemPage {

  @ViewChild(Content) content: Content;

  action: any;
  item_type: any;
  id_branch: any;
  msg: any;
  errorMsg: any;
  terrorMsg: any = '';
  metal_error_msg: any = '';
  remark: any;
  stnErrMsg: any;
  metalRate: any;
  tax_details: any;
  stoneMasData = [];
  uom = [];
  stone_details = [];
  esti = [];
  tagData = { "tag_code": "", "tag_code1": "", "tag_code2": "", "is_partial": 0, "stone_details": [] };
  // NonTag
  ntData = { 'mc_type': '2', "stone_details": [] };
  nonTagStock: any;
  nonTagStock1: any;

  products = [];
  designs = [];
  selectedNTStock = [];
  section = []

  // Home Bill
  hbData = { 'charge_value': 0, 'mc_type': '2', 'id_charge': '', 'chargecode': '', "tag_code": "", "tag_code1": "", "tag_code2": "", "is_partly_sold": 0, "stone_details": [], 'allcharges': [], 'charges': [] };
  homeBillStock: any;
  purities = [];
  collections = [];
  hbProducts = [];
  hbDesigns = [];
  hbPurities = [];
  hbsubDesigns = [];

  ntPurities = [];

  // Old metal
  omData = { "stone_details": [], 'touch': '100' };  /* krishna */
  oldMetalCat = [];
  oldMetalTypes = [];
  metalCatTypes = [];
  ret_settings = [];

  oldrates = [];
  oldcategory = [];

  oldfullrates = [];
  oldfullcategory = [];
  oldamount = 0;

  homeback = false;
  nonback = false;

  oldback = false;
  other = [];
  charges: any = [];
  mr = false;

  nontag_sections = [];
  homebill_sections = [];
  sections = [];
  id_section: any
  section_name: any
  old_stone_settings: any;
  checkold = false;  //naveen 31-08-23

  empData = JSON.parse(localStorage.getItem('empDetail'));
  show_home: boolean = false
  show_mc: boolean = false
  nontag_products: any
  sub_designs: any = []
  stoneMasTypes: any = []
  initial = false
  purity_show: any = false;
  pro_metal_type:any;

  constructor(public cd: ChangeDetectorRef, public events: Events, public load: LoadingController, public retail: RetailProvider, public common: CommonProvider, public viewCtrl: ViewController, public navParams: NavParams, public modal: ModalController, private toast: ToastController,) {
    console.log(this.ntData, '99999999999');



    this.item_type = this.navParams.get('type');
    console.log(this.item_type, 'tyep');

    this.ret_settings = this.navParams.get('ret_settings');
    this.id_branch = this.navParams.get('id_branch');
    this.metalRate = this.navParams.get('metal_rates');
    console.log(this.metalRate, 'metal rates');

    this.tax_details = this.navParams.get('taxGroupItems');
    this.nonTagStock = this.navParams.get('nonTagStock');
    localStorage.setItem('st', JSON.stringify(this.navParams.get('nonTagStock')));
    this.nonTagStock1 = JSON.parse(localStorage.getItem('st'));
    this.products = this.nonTagStock.products;
    // this.section = this.nonTagStock.section;
    if (this.nonTagStock.sections != undefined) {
      if (this.item_type == 'home_bill') {
        console.log(
          this.nonTagStock.sections, '9999999999999'
        );

        this.homebill_sections = this.nonTagStock.sections.filter(data => (data['is_home_bill_counter'] == 1));
        console.log(this.homebill_sections)
      } else if (this.item_type == 'non_tag') {
        this.nontag_sections = this.nonTagStock.sections.filter(data => (data['is_home_bill_counter'] == 0));
        console.log(this.nontag_sections)

      }
    }


    this.homeBillStock = this.navParams.get('homeBillStock');
    this.purities = this.navParams.get('purities');
    this.collections = this.navParams.get('collections');
    this.oldMetalCat = this.navParams.get('oldMetalCat');
    console.log(this.oldMetalCat)
    console.log(this.nonTagStock)
    console.log(this.nonTagStock1)



    this.stoneMasData = this.navParams.get('stoneMasData');
    this.stoneMasTypes = this.navParams.get('stoneMasTypes')
    console.log(this.stoneMasTypes, 'ppppppppppp');

    this.action = this.navParams.get('action');
    console.log(this.action, '0000000000');

    this.oldMetalTypes = this.navParams.get('oldMetalTypes');
    if (this.item_type == 'tag' && this.action == 'edit') {
      //  localStorage.setItem('actualTag', JSON.stringify(this.navParams.get('esti')));

      localStorage.removeItem('actualTag');
      console.log('clear : ', JSON.parse(localStorage.getItem('actualTag')));

      localStorage.setItem('actualTag', JSON.stringify(this.navParams.get('esti')));
      console.log('clear 1 : ', JSON.parse(localStorage.getItem('actualTag')));

      var tempesti = this.navParams.get('esti');
      console.log('tempesti : ', tempesti);

      this.tagData = Object.assign({}, tempesti);
      localStorage.setItem('tag_data', JSON.stringify(this.tagData));

      console.log(this.navParams.get('esti'))
      console.log(Object.assign({}, this.navParams.get('esti')))
      this.other = this.tagData.hasOwnProperty('othermetal_details') ? this.tagData['othermetal_details'] : [];
      // this.stone_details = this.tagData['stone_details'] ;
      this.stone_details = this.tagData.hasOwnProperty('stone_details') ? this.tagData['stone_details'] : [];

      this.common.getset({
        "id_product": this.tagData['product_id'],
        "id_design": this.tagData['design_id'],
        "id_sub_design": this.tagData['id_sub_design'],
        "gross_wt": this.tagData['gross_wt'],
        "type": 1,
        "lot_no": this.tagData['lot_no'],
        "id_branch": this.id_branch
      }).then(data => {

        this.tagData['checkwas'] = data['data']['wastag_min'];
        this.tagData['mc_min'] = data['data']['mc_min'];


      });

      this.calcSaleValue('');

    }
    else if (this.item_type == 'non_tag' && this.action == 'edit') {
      this.ntData = Object.assign({}, this.navParams.get('esti'));
      this.productSelected(this.ntData['pro_id']);
      this.selectedNTStock['AVgross_wt'] = this.ntData['AVgross_wt'];
      this.selectedNTStock['AVpiece'] = this.ntData['AVpiece'];
      this.stone_details = this.ntData['stone_details'];

      // this.setNTitemData(this.ntData['design'])
      console.log(this.ntData)
      this.common.getset({
        "id_product": this.ntData['pro_id'],
        "id_design": this.ntData['design'],
        "id_sub_design": this.ntData['id_sub_design'],
        "gross_wt": this.ntData['gross_wt'],
        "type": 2,
        "lot_no": "",
        "id_branch": this.id_branch

      }).then(data => {

        this.ntData['checkwas'] = data['data']['wastag_min'];
      });

    }
    else if (this.item_type == 'home_bill' && this.action == 'edit') {
      this.hbData = Object.assign({}, this.navParams.get('esti'));
      this.stone_details = this.hbData['stone_details'];
      this.charges = this.hbData['charges'];

      console.log(this.stone_details)
      this.common.getset({
        "id_product": this.hbData['pro_id'],
        "id_design": this.hbData['design_no'],
        "id_sub_design": this.hbData['sub_design_no'],
        "gross_wt": this.hbData['gross_wt'],
        "type": 3,
        "lot_no": this.hbData['lot_no'],
        "id_branch": this.id_branch
      }).then(data => {

        this.hbData['checkwas'] = data['data']['wastag_min'];
      });

    }
    else if (this.item_type == 'old_metal' && this.action == 'edit') {
      this.omData = Object.assign({}, this.navParams.get('esti'));
      this.stone_details = this.omData['stone_details'];

      // this.calcOldmetalValue('id_old_metal_cat_type');
      let metaltype = this.oldMetalTypes.filter((i: any) => i.id_metal == this.omData['id_category']);
      this.metalCatTypes = metaltype;
    }


    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();


    this.common.getdivision().then(data => {

      this.hbData['allcharges'] = data['charges'];
      // loader.dismiss();
    });

    this.common.getSections(this.id_branch).then(data => {

      if (this.item_type == 'home_bill') {
        this.sections = data.filter(data => (data['is_home_bill_counter'] == 1));
      } else if (this.item_type == 'non_tag') {
        this.sections = data.filter(data => (data['is_home_bill_counter'] == 0));
      }


      console.log(this.sections);
      // loader.dismiss();
    });


    // let loader = this.load.create({
    //   content: 'Please Wait',
    //   spinner: 'bubbles',
    // });
    // loader.present();


    this.common.getoldrates().then(data => {

      this.oldrates = data;
      this.oldfullrates = data;

      this.common.getoldcategory().then(data => {

        this.oldcategory = data;
        this.oldfullcategory = data;

        loader.dismiss();

        console.log(this.omData['id_category'])
        console.log(this.omData['id_old_metal_type'])
        console.log(this.omData['id_old_metal_cat_type'])
        console.log(this.omData['id_purpose'])
        console.log(this.omData['gross_wt'])

        if (this.item_type == 'old_metal' && this.action != 'edit') {


          this.omData['id_category'] = this.oldMetalCat.length > 0 ? this.oldMetalCat[0]['id_category'] : '';
          this.calcOldmetalValue('id_category');
          console.log(this.oldMetalTypes)
          console.log(this.oldcategory)

          let metaltype = this.oldMetalTypes.filter((i: any) => i.id_metal == this.omData['id_category']);
          this.metalCatTypes = metaltype;
          console.log(this.metalCatTypes, 'cat types')
          this.omData['id_old_metal_type'] = this.metalCatTypes.length > 0 ? this.metalCatTypes[0]['id_metal_type'] : '';
          this.calcOldmetalValue('id_old_metal_type');
          console.log(this.omData['id_old_metal_type'], 'metal type');


          metaltype = this.oldfullcategory.filter((i: any) => i.id_old_metal_type == this.omData['id_old_metal_type']);
          this.oldcategory = metaltype;
          console.log(this.oldcategory, 'category');

          this.omData['id_old_metal_cat_type'] = this.oldcategory.length > 0 ? this.oldcategory[0]['id_old_metal_cat'] : '';
          console.log(this.omData['id_old_metal_cat_type'])
          this.calcOldmetalValue('id_old_metal_cat_type');


          this.omData['old_pcs'] = 1;
          this.omData['id_purpose'] = "2"
          this.omData['remark'] = ''
          // this.omData['purity'] = '';
          this.calcOldmetalValue('id_purpose');
        }
        // if(this.item_type == 'non_tag' && this.action != 'edit'){

        // this.ntData['mc_type'] = "2";
        // }

      }, err => {
        loader.dismiss();
      });
    }, err => {
      loader.dismiss();
    });
    console.log(this.ntData)
    console.log('tag data', this.tagData)

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  updateItem(submitType) {
    let data = [];
    data['submitType'] = submitType;
    if (this.item_type == 'tag') {  // Tag
      console.log(this.tagData['is_partial']);
      if(this.tagData['is_partial'] == 0){
      if (this.tagData['actual_gross_wt'] < this.tagData['gross_wt'] || this.tagData['actual_net_wt'] < this.tagData['net_wt'] || this.tagData['net_wt'] < 0.001) {
        this.msg = "";
        this.errorMsg = "Invalid Tag weight..";
      }else {
        console.log(this.tagData['is_partial']);
        console.log(this.tagData['gross_wt']);
        console.log(this.tagData['actual_gross_wt']);
        data['item_data'] = this.tagData;
        this.viewCtrl.dismiss(data);
      }
      }
     else if (this.tagData['is_partial'] == 1) {
        console.log(this.tagData['gross_wt']);
        console.log(this.tagData['actual_gross_wt']);

        if (this.tagData['gross_wt'] == this.tagData['actual_gross_wt'] || this.tagData['less_wt'] > this.tagData['gross_wt'] || parseFloat(this.tagData['net_wt']) < 0.001) {
          let toastMsg = this.toast.create({
            message: 'Weight must be Lessthan the actual weight for Partly Sale',
            duration: this.common.toastTimeout,
            position: 'middle'
          });
          toastMsg.present();
        }
        else {
          data['item_data'] = this.tagData;
          this.viewCtrl.dismiss(data);
        }

      } 
    }
    else if (this.item_type == 'non_tag') {  // Non Tag
      if (this.ntData['id_nontag_item'] == '' || this.ntData['id_nontag_item'] == null || this.ntData['gross_wt'] <= 0) {
        this.msg = "";
        this.errorMsg = "Invalid Non-Tag details..";
      } else {
        data['item_data'] = this.ntData;
        this.viewCtrl.dismiss(data);
      }
    }
    else if (this.item_type == 'home_bill') {  // Home Bill
      if (((this.hbData['tag_id'] > 0 || this.hbData['gross_wt'] > 0) && this.hbData['piece'] != '' && this.hbData['purname'] != '') || this.hbData['calculation_based_on'] == 3) {
        data['item_data'] = this.hbData;
        this.viewCtrl.dismiss(data);
      } else {
        this.msg = "";
        this.errorMsg = "Invalid Home Bill details..";
      }
    }
    else if (this.item_type == 'old_metal') {  // Old metal
      if (this.omData['amount'] > 0 && this.omData['id_purpose'] > 0 && this.omData['id_category'] > 0 && this.omData['id_old_metal_type'] > 0 && this.omData['id_old_metal_cat_type'] > 0 && this.omData['purity'] > 0 && (this.omData['id_purpose'] == '1' && this.omData['amount'] <= parseInt(this.ret_settings['max_cash_allowed']) || this.omData['id_purpose'] == '2' && this.omData['amount'] != 0) && ((this.omData['id_category'] == '1' && this.omData['rate'] <= parseInt(this.ret_settings['max_old_gold_rate']) && this.omData['rate'] >= parseInt(this.ret_settings['min_old_gold_rate']) || this.omData['id_category'] == '2' && this.omData['rate'] <= parseInt(this.ret_settings['max_old_silver_rate']) && this.omData['rate'] >= parseInt(this.ret_settings['min_old_silver_rate'])))) {
        // if(this.omData['amount'] > 0 && this.omData['id_purpose'] > 0 && this.omData['id_category'] > 0 && this.omData['id_old_metal_type'] > 0 && this.omData['id_old_metal_cat_type'] > 0 && this.omData['purity'] > 0 && (this.omData['id_category'] == '1' && this.omData['rate'] <= parseInt(this.ret_settings['max_old_gold_rate']) && this.omData['rate'] >= parseInt(this.ret_settings['min_old_gold_rate'])  ||  this.omData['id_category'] == '2' && this.omData['rate'] <= parseInt(this.ret_settings['max_old_silver_rate']) && this.omData['rate'] >= parseInt(this.ret_settings['min_old_silver_rate']))){
        data['item_data'] = this.omData;
        data['old_stone_settings'] = this.old_stone_settings;
        console.log(this.old_stone_settings)

        this.viewCtrl.dismiss(data);
      } else {
        this.msg = "";

        if (this.omData['id_purpose'] == '1' && this.omData['amount'] > parseInt(this.ret_settings['max_cash_allowed'])) {
          this.errorMsg = "Cash Return should be in below Rs." + parseInt(this.ret_settings['max_cash_allowed']);

        }
        else {
          this.errorMsg = "Invalid Old metal details..";

        }

        let toast = this.toast.create({
          message: "please enter valid Metal Rate",
          duration: 2000,
          position: "bottom"
        });
        toast.present();
      }
    }
    // Alert Message Timeout
    setTimeout(() => {
      this.errorMsg = "";
    }, this.common.msgTimeout);
  }

  addItem(submitType) {
    let data = [];
    data['submitType'] = submitType;
    console.log(data['submitType'], 'jjjjjjjjjj');

    if (this.item_type == 'tag') {  // Tag
      if (this.tagData['tag_id'] == '' || this.tagData['tag_id'] == null || this.ntData['gross_wt'] <= 0) {
        this.msg = "";
        this.errorMsg = "Invalid Tag details..";
      } else {
        data['item_data'] = this.tagData;
        this.viewCtrl.dismiss(data);
      }
    }
    else if (this.item_type == 'non_tag') {  // Non Tag
      console.log('11111111111');
      console.log(this.ntData, '22222222222222');

      if (this.ntData['id_nontag_item'] == '' || this.ntData['id_nontag_item'] == null || this.ntData['gross_wt'] <= 0) {
        this.msg = "";
        this.errorMsg = "Invalid Non-Tag details..";
      } else {

        // data['item_data'] = this.ntData;
        // this.ntData['sections'] = this.sections;
        data['item_data'] = this.ntData;
        console.log(data['item_data']);
        
        this.viewCtrl.dismiss(data);
      }
    }
    else if (this.item_type == 'home_bill') {  // Home Bill
      // if(this.hbData['tag_id'] > 0 || this.hbData['gross_wt'] > 0){
      if (((this.hbData['tag_id'] > 0 || this.hbData['gross_wt'] > 0) && this.hbData['piece'] != '' && this.hbData['purname'] != '' && this.hbData['taxable'] > 0) || this.hbData['calculation_based_on'] == 3) {
        // data['item_data'] = this.hbData;
        // this.hbData['sections'] = this.sections;
        // this.viewCtrl.dismiss(data);
        data['item_data'] = this.hbData;
        this.viewCtrl.dismiss(data);
      } else  {
        this.msg = "";
        this.errorMsg = "Invalid Home Bill details..";
      }
    }
    else if (this.item_type == 'old_metal') {  // Old metal
      console.log(this.omData, '88888888888');

      if (this.omData['amount'] > 0 && this.omData['id_purpose'] > 0 && this.omData['id_category'] > 0 && this.omData['id_old_metal_type'] > 0 && this.omData['id_old_metal_cat_type'] > 0 && this.omData['purity'] > 0 &&
        (this.omData['id_purpose'] == '1' && this.omData['amount'] <= parseInt(this.ret_settings['max_cash_allowed']) || this.omData['id_purpose'] == '2' && this.omData['amount'] != 0) &&
        ((this.omData['id_category'] == '1' && this.omData['rate'] <= parseInt(this.ret_settings['max_old_gold_rate']) && this.omData['rate'] >= parseInt(this.ret_settings['min_old_gold_rate']) || this.omData['id_category'] == '2' && this.omData['rate'] <= parseInt(this.ret_settings['max_old_silver_rate']) && this.omData['rate'] >= parseInt(this.ret_settings['min_old_silver_rate'])))) {

        // if(this.omData['amount'] > 0 && this.omData['id_purpose'] > 0 && this.omData['id_category'] > 0 && this.omData['id_old_metal_type'] > 0 && this.omData['id_old_metal_cat_type'] > 0 && this.omData['purity'] > 0 && (this.omData['id_category'] == '1' && this.omData['rate'] <= parseInt(this.ret_settings['max_old_gold_rate']) && this.omData['rate'] >= parseInt(this.ret_settings['min_old_gold_rate'])  ||  this.omData['id_category'] == '2' && this.omData['rate'] <= parseInt(this.ret_settings['max_old_silver_rate']) && this.omData['rate'] >= parseInt(this.ret_settings['min_old_silver_rate']))){

        data['item_data'] = this.omData;
        data['item_data']['old_stone_settings'] = this.old_stone_settings;
        console.log(data['item_data']);
        console.log(this.omData);
        console.log(this.old_stone_settings)

        this.viewCtrl.dismiss(data);
      } else {
        this.msg = "";
        if (this.omData['id_purpose'] == '1' && this.omData['amount'] > parseInt(this.ret_settings['max_cash_allowed'])) {
          this.errorMsg = "Cash Return should be in below Rs." + parseInt(this.ret_settings['max_cash_allowed']);

        }
        else {
          this.errorMsg = "Invalid Old metal details..";

        }
        let toast = this.toast.create({
          message: "please enter valid Metal Rate",
          duration: 2000,
          position: "bottom"
        });
        toast.present();
      }
    }
    // Alert Message Timeout
    setTimeout(() => {
      this.errorMsg = "";
    }, this.common.msgTimeout);
  }

  // calcStoneDetail(){
  //   let data = {"stone_wt" : 0, "stone_price" : 0};
  //   this.stone_details.forEach( i => {
  //     data['stone_wt']   = data['stone_wt'] + Number(i['stone_wt']);
  //     data['stone_price'] = data['stone_price'] + Number(i['stone_price']);
  //   })
  //   return data;
  // }
  calcStoneDetail() {
    if (this.item_type == 'tag') {

      let data = { "wt": 0, "amount": 0 };
      console.log('details', this.stone_details);

      this.stone_details.forEach((i, index) => {

        if (this.stone_details[index]['lwt'] && this.stone_details[index]['lwt'] != 0) {
          this.stone_details[index]['is_apply_in_lwt'] = 1;
          // data['wt']   = data['wt'] + Number(i['wt']);
          data['wt'] = data['wt'] + (i['uom_id'] == '6' ? Number(i['wt']) / 5 : Number(i['wt']));

        } else {
          this.stone_details[index]['is_apply_in_lwt'] = 0;
        }
        data['amount'] = data['amount'] + Number(i['amount']);
      })
      return data;
    }
    else {
      let data = { "stone_wt": 0, "stone_price": 0 };
      this.stone_details.forEach((i, index) => {
        if (this.stone_details[index]['lwt']) {
          this.stone_details[index]['is_apply_in_lwt'] = 1;

          // data['stone_wt']   = data['stone_wt'] + Number(i['stone_wt']);
          data['stone_wt'] = data['stone_wt'] + (i['uom_id'] == '6' ? Number(i['stone_wt']) / 5 : Number(i['stone_wt']));

        }
        else {
          this.stone_details[index]['is_apply_in_lwt'] = 0;
        }
        data['stone_price'] = data['stone_price'] + Number(i['stone_price']);
      })
      return data;
    }
  }

  calcSaleValuemc() {

    if (this.item_type == 'tag') {

      console.log(this.tagData['checkwas']);
      console.log((this.tagData['checkwas'] >= 10 && this.tagData['retail_max_wastage_percent'] >= 10) || (this.tagData['checkwas'] < 10 && this.tagData['retail_max_wastage_percent'] < 10));



      if ((this.tagData['checkwas'] >= 10 && this.tagData['retail_max_wastage_percent'] >= 10) || (this.tagData['checkwas'] < 10 && this.tagData['retail_max_wastage_percent'] < 10)) {

        this.terrorMsg = "";

        console.log('11111111111111111')
        if (parseFloat(this.tagData['gross_wt']) <= parseFloat(this.tagData['actual_gross_wt']) && parseFloat(this.tagData['net_wt']) <= parseFloat(this.tagData['actual_net_wt'])) {
          this.tagData['net_wt'] = this.tagData['gross_wt'] - this.tagData['less_wt'];
          let detail = { itemData: this.tagData, metalRate: this.metalRate, tax_details: this.tax_details, item_type: this.item_type };
          this.tagData = this.retail.calculateSaleValueBasedMc(detail);
        } else {
          this.errorMsg = "Entered weight greater than tag weight";
          // this.tagData['gross_wt']  = this.tagData['actual_gross_wt'] ;
          // this.tagData['less_wt']   = this.tagData['actual_less_wt'];
          // this.tagData['net_wt']    = this.tagData['actual_net_wt'];
          // Alert Message Timeout
          console.log(parseFloat(this.tagData['gross_wt']) > parseFloat(this.tagData['actual_gross_wt']))
          console.log(parseFloat(this.tagData['less_wt']) > parseFloat(this.tagData['actual_less_wt']))

          if (parseFloat(this.tagData['gross_wt']) > parseFloat(this.tagData['actual_gross_wt'])) {
            this.tagData['gross_wt'] = this.tagData['actual_gross_wt'];

          }
          else if (parseFloat(this.tagData['less_wt']) > parseFloat(this.tagData['actual_less_wt'])) {
            this.tagData['less_wt'] = this.tagData['actual_less_wt'];
          }
          setTimeout(() => {
            this.errorMsg = "";
          }, this.common.msgTimeout);
        }
      }
      else {
        console.log('11111111111111111')
        this.errorMsg = "Please Enter required wastage";
        this.terrorMsg = "Please Enter required wastage";

      }
    }
  }


  calcSaleValue(changedInput) {
    console.log(this.tagData)
    console.log(this.item_type);
    console.log(this.hbData['taxable'], 'taxbleeeee');
    console.log('changedInputttttttt : ',changedInput);
    

    if (this.item_type == 'tag') {

      // this.checkingtag();
      console.log('details', this.stone_details);
      let stData = this.calcStoneDetail();
      this.tagData['stone_wt'] = stData['wt'];
      this.tagData['stone_price'] = stData['amount'];
      this.tagData['stone_details'] = this.stone_details;

      console.log('****', this.stone_details)
      console.log('****', stData['wt'])
      if (this.stone_details.length != 0) {

        this.stone_details.forEach((element, index) => {
          if (this.stone_details[index]["lwt"] == 1) {
            console.log('1 => ', this.stone_details[index]["lwt"]);

            this.tagData['less_wt'] = this.retail.setAsNumber(stData['wt']);
            this.tagData['net_wt'] = this.tagData['gross_wt'] - this.tagData['less_wt'];

            if (this.tagData['net_wt'] < 0) {
              // Add the extra difference into less_wt
              this.tagData['gross_wt'] = this.tagData['less_wt'];
              this.tagData['net_wt'] = 0;
            } else {
              this.tagData['net_wt'] = this.tagData['net_wt'];
            }
            this.tagData['net_wt'] = this.retail.setAsNumber(this.tagData['net_wt']).toFixed(3);
            this.tagData['actual_net_wt'] = this.tagData['net_wt'];
            console.log('2 => ', this.tagData['less_wt']);
            console.log('3 => ', this.tagData['net_wt']);
            console.log('4 => ', this.tagData['actual_net_wt']);

          }
        });
      } else {
        this.tagData['less_wt'] = 0;
      }


      // this.tagData['mc_value'] =  this.tagData['making_charge'];
      console.log(this.tagData['retail_max_wastage_percent'] >= parseInt(this.tagData['checkwas']));
      // if (parseInt(this.tagData['mc_value']) <= parseInt(this.tagData['mc_min'])) {

      //   this.tagData['mc_value'] = this.tagData['mc_min']

      // }
      console.log('11111111111');
      console.log(this.tagData['retail_max_wastage_percent']);
      console.log(this.tagData['checkwas']);
      const mcMin = parseFloat(this.tagData['mc_min']) || 0;
      const val = parseFloat(this.tagData['mc_value']) || 0;


      if ((this.tagData['retail_max_wastage_percent'] >= parseInt(this.tagData['checkwas'])) && (val >= mcMin)) {
        console.log('22222222222');


        this.terrorMsg = "";
        if (parseFloat(this.tagData['gross_wt']) <= parseFloat(this.tagData['actual_gross_wt']) && parseFloat(this.tagData['net_wt']) <= parseFloat(this.tagData['actual_net_wt'])) {
          console.log('3333333333333');

          if (this.stone_details.length == 0) {

            this.tagData['net_wt'] = this.tagData['gross_wt'] - this.tagData['less_wt'];

          }
          // if(this.tagData['calculation_based_on'] == 3){

          //   this.tagData['sales_value'] = this.tagData['taxable'];

          // }

          // if(changedInput == 'wastage_wt'){

          //   let wast_percent= parseFloat((((this.retail.setAsNumber(this.tagData['wast_wgt']))*100)/this.retail.setAsNumber(this.tagData['net_wt'])).toFixed(3));
          //   this.tagData['retail_max_wastage_percent']  = wast_percent;

          // }
          // else if(changedInput == 'wast'){
          //   let wast_wgt    = parseFloat( (this.tagData['net_wt'] * (this.retail.setAsNumber(this.tagData['retail_max_wastage_percent']) / 100)).toFixed(3));
          //   this.tagData['wast_wgt']  = wast_wgt;
          // }
          let detail = { itemData: this.tagData, metalRate: this.metalRate, tax_details: this.tax_details, item_type: this.item_type };

          console.log('*******', this.tagData['taxable'])
          this.tagData = this.retail.calculateSaleValue(detail);
        } else {
          this.errorMsg = "Entered weight greater than tag weight";

          console.log(parseFloat(this.tagData['gross_wt']) > parseFloat(this.tagData['actual_gross_wt']))
          console.log(parseFloat(this.tagData['less_wt']) > parseFloat(this.tagData['actual_less_wt']))

          if (parseFloat(this.tagData['gross_wt']) > parseFloat(this.tagData['actual_gross_wt'])) {
            this.tagData['gross_wt'] = this.tagData['actual_gross_wt'];

          }
          else if (parseFloat(this.tagData['less_wt']) > parseFloat(this.tagData['actual_less_wt'])) {
            this.tagData['less_wt'] = this.tagData['actual_less_wt'];
          }
          else if (parseFloat(this.tagData['less_wt']) > parseFloat(this.tagData['gross_wt'])) {
            this.tagData['gross_wt'] = this.tagData['less_wt'];
          }
          // Alert Message Timeout
          setTimeout(() => {
            this.errorMsg = "";
          }, this.common.msgTimeout);
        }
      }
      else {
        console.log('11111111111111111')
        this.errorMsg = "Please Enter required wastage";
        this.terrorMsg = "Please Enter required wastage";
        // Alert Message Timeout
        setTimeout(() => {
          this.errorMsg = "";
        }, this.common.msgTimeout);

      }
      console.log('Final =======> ', this.tagData['stone_details']);


    }
    else if (this.item_type == 'non_tag') {
      // this.checkingnon();
      this.ntData['gross_wt'] = this.ntData['gross_wt'] < 0 ? 0 : this.ntData['gross_wt'];
      this.ntData['rate_per'] = this.ntData['rate_per'] < 0 ? 0 : this.ntData['rate_per'];
      this.ntData['mc_value'] = this.ntData['mc_value'] < 0 ? 0 : this.ntData['mc_value'];
      this.ntData['taxable'] = this.ntData['taxable'] < 0 ? 0 : this.ntData['taxable'];

      this.ntData["less_wt"] = this.ntData["less_wt"] != isNaN ? 0 : this.ntData["less_wt"];

      console.log(this.ntData['mc_type'])
      console.log(this.ntData.hasOwnProperty('mc_type'))
      if (!this.ntData.hasOwnProperty('mc_type')) {

        this.ntData['mc_type'] = "2";
      }


      let stData = this.calcStoneDetail();
      this.ntData['stone_wt'] = stData['stone_wt'];
      this.ntData['stone_price'] = stData['stone_price'];
      this.ntData['stone_details'] = this.stone_details;
      console.log(this.ntData['stone_details'])

      if (this.stone_details.length != 0) {
        this.ntData['less_wt'] = this.retail.setAsNumber(stData['stone_wt']);

      }


      this.ntData['net_wt'] = parseFloat(this.ntData['gross_wt']) - this.retail.setAsNumber(this.ntData['less_wt']);
      this.selectedNTStock['AVgross_wt'] = parseFloat((this.selectedNTStock['gross_wt'] - this.ntData['gross_wt']).toFixed(3));
      console.log('available g wt : ',this.selectedNTStock['AVgross_wt']);
      this.ntData['AVgross_wt'] = this.selectedNTStock['AVgross_wt']
     // this.ntData['AVgross_wt'] = this.selectedNTStock['AVgross_wt'];

      if (parseFloat(this.ntData['gross_wt']) > parseFloat(this.selectedNTStock['gross_wt'])) {
        this.ntData['gross_wt'] = this.selectedNTStock['gross_wt'];

      }
      if (parseFloat(this.ntData['less_wt']) > parseFloat(this.selectedNTStock['less_wt'])) {
        this.ntData['less_wt'] = this.retail.setAsNumber(this.selectedNTStock['less_wt']);
      }
      if (parseFloat(this.ntData['piece']) > parseFloat(this.selectedNTStock['piece'])) {
        this.ntData['piece'] = this.selectedNTStock['piece'];
      }


      if (parseInt(this.ntData['mc_value']) <= parseInt(this.ntData['mc_min'])) {
        this.ntData['mc_value'] = this.ntData['mc_min']
      }
      this.ntData['net_wt'] = parseFloat(this.ntData['gross_wt']) - this.retail.setAsNumber(this.ntData['less_wt']);

      if (changedInput == 'wastage_wt') {

        let wast_percent = parseFloat((((this.retail.setAsNumber(this.ntData['wast_wgt'])) * 100) / this.retail.setAsNumber(this.ntData['net_wt'])).toFixed(3));
        this.ntData['retail_max_wastage_percent'] = wast_percent;

      }
      else if (changedInput == 'wast') {
        if (parseInt(this.ntData['retail_max_wastage_percent']) <= parseInt(this.ntData['checkwas'])) {
          this.ntData['retail_max_wastage_percent'] = this.ntData['checkwas']
        }
        let wast_wgt = parseFloat((this.ntData['net_wt'] * (this.retail.setAsNumber(this.ntData['retail_max_wastage_percent']) / 100)).toFixed(3));
        this.ntData['wast_wgt'] = wast_wgt;
      }
      console.log(this.ntData)
      console.log(this.ntData['retail_max_wastage_percent'] >= parseInt(this.ntData['checkwas']));

      if (this.ntData['retail_max_wastage_percent'] >= parseInt(this.ntData['checkwas']) || changedInput == 'gross') {
        let detail = { itemData: this.ntData, metalRate: this.metalRate, tax_details: this.tax_details, item_type: this.item_type };
        if (this.ntData['calculation_based_on'] == 3) {

          this.ntData['sales_value'] = this.ntData['taxable'];
        }
        this.ntData = this.retail.calculateSaleValue(detail);
        console.log(this.ntData)
      }
      else {
        console.log('11111111111111111')
        this.errorMsg = "Please Enter required wastage";
        this.terrorMsg = "Please Enter required wastage";
        // Alert Message Timeout
        setTimeout(() => {
          this.errorMsg = "";
        }, this.common.msgTimeout);
      }
    }
    else if (this.item_type == 'home_bill') {
      console.log(this.hbData);

      this.hbData['gross_wt'] = this.hbData['gross_wt'] < 0  ? 0 : this.hbData['gross_wt'];
      this.hbData['retail_max_wastage_percent'] = this.hbData['retail_max_wastage_percent'] < 0 ? 0 : this.hbData['retail_max_wastage_percent'];
      this.hbData['wast_wgt'] = this.hbData['wast_wgt'] < 0 ? 0 : this.hbData['wast_wgt'];
      this.hbData['rate_per'] = this.hbData['rate_per'] < 0 ? 0 : this.hbData['rate_per'];
      this.hbData['mc_value'] = this.hbData['mc_value'] < 0 ? 0 : this.hbData['mc_value'];
      this.hbData['taxable'] = this.hbData['taxable'] < 0 ? 0 : this.hbData['taxable'];
      console.log(this.hbData);
      this.hbData["less_wt"] = this.hbData["less_wt"] != isNaN ? 0 : this.hbData["less_wt"];
      console.log(this.hbData["less_wt"]);
      console.log(this.hbData['stone_details'])
      this.checkinghome();

      let stData = this.calcStoneDetail();
      console.log(stData, 'st data');

      this.hbData['stone_wt'] = stData['stone_wt'];
      this.hbData['stone_price'] = stData['stone_price'];
      this.hbData['stone_details'] = this.stone_details;
      console.log(this.hbData['stone_details'])

      if(this.hbData['calculation_based_on'] != 3){
     if (this.hbData['is_partly_sold'] == 1) {
        if (parseFloat(this.hbData['gross_wt']) > parseFloat(this.hbData['stock_gross_wt'])) {
          this.hbData['gross_wt'] = this.retail.setAsNumber(this.hbData['stock_gross_wt']);
        }
        if (parseFloat(this.hbData['less_wt']) > parseFloat(this.hbData['stock_less_wt'])) {
          this.hbData['less_wt'] = this.retail.setAsNumber(this.hbData['stock_less_wt']);
        }
      }

      if (this.stone_details.length != 0) {
        this.hbData['less_wt'] = this.retail.setAsNumber(stData['stone_wt']);

      }

    

      //  if (this.stone_details.length != 0) {

      //     this.stone_details.forEach((element, index) => {
      //       if (this.stone_details[index]["lwt"] == 1) {
      //         console.log('1 => ', this.stone_details[index]["lwt"]);

      //           this.hbData['less_wt'] = this.retail.setAsNumber(stData['wt']);
      //           this.hbData['net_wt'] = this.hbData['gross_wt'] - this.hbData['less_wt'];

      //           if (this.hbData['net_wt'] < 0) {
      //             // Add the extra difference into less_wt
      //             this.hbData['gross_wt'] = this.hbData['less_wt'];
      //             this.hbData['net_wt'] = 0;
      //           } else {
      //             this.hbData['net_wt'] = this.hbData['net_wt'];
      //           }
      //           this.hbData['net_wt'] = this.retail.setAsNumber(this.hbData['net_wt']).toFixed(3);
      //           this.hbData['actual_net_wt'] = this.hbData['net_wt'];
      //           console.log('2 => ', this.hbData['less_wt']);
      //           console.log('3 => ', this.hbData['net_wt']);
      //           console.log('4 => ', this.hbData['actual_net_wt']);

      //       }
      //     });
      //         }else{
      //             this.hbData['less_wt'] = 0;
      //         }


      if (parseInt(this.hbData['mc_value']) <= parseInt(this.hbData['mc_min'])) {
        this.hbData['mc_value'] = this.hbData['mc_min']
      }

      this.hbData['net_wt'] = parseFloat(this.hbData['gross_wt']) - this.retail.setAsNumber(this.hbData['less_wt']);
      if (changedInput == 'wastage_wt') {

        let wast_percent = parseFloat((((this.retail.setAsNumber(this.hbData['wast_wgt'])) * 100) / this.retail.setAsNumber(this.hbData['net_wt'])).toFixed(3));
        this.hbData['retail_max_wastage_percent'] = wast_percent;

      }
      else if (changedInput == 'wast') {

        if (parseInt(this.hbData['retail_max_wastage_percent']) <= parseInt(this.hbData['checkwas'])) {
          this.hbData['retail_max_wastage_percent'] = this.hbData['checkwas']
        }

        let wast_wgt = parseFloat((this.hbData['net_wt'] * (this.retail.setAsNumber(this.hbData['retail_max_wastage_percent']) / 100)).toFixed(3));
        this.hbData['wast_wgt'] = wast_wgt;
      }
      console.log(this.hbData['checkwas'])
      console.log(this.hbData);

      if (this.hbData['retail_max_wastage_percent'] >= parseInt(this.hbData['checkwas']) || changedInput == 'hbgross') {
        let detail = { itemData: this.hbData, metalRate: this.metalRate, tax_details: this.tax_details, item_type: this.item_type };
        console.log(detail)
        if (this.hbData['calculation_based_on'] == 3) {
          this.hbData['sales_value'] = this.hbData['taxable'];
          this.hbData['gross_wt'] = 0.000
        }
        console.log('taxable amount : ', this.hbData['taxable']);
        console.log('sales val : ',this.hbData['sales_value']);
        
       this.hbData = this.retail.calculateSaleValue(detail);
      }
      else {
            let detail = { itemData: this.hbData, metalRate: this.metalRate, tax_details: this.tax_details, item_type: this.item_type };
        console.log(detail)
        this.hbData = this.retail.calculateSaleValue(detail);

        // console.log('11111111111111111')
        // this.errorMsg = "Please Enter required wastage";
        // this.terrorMsg = "Please Enter required wastage";
        // Alert Message Timeout
        setTimeout(() => {
          this.errorMsg = "";
        }, this.common.msgTimeout);
      }

      console.log(this.hbData['is_partly_sold'], 'partial');

      if (this.hbData['is_partly_sold'] == 1) {
        let detail = { itemData: this.hbData, metalRate: this.metalRate, tax_details: this.tax_details, item_type: this.item_type };
        console.log(detail)
        this.hbData = this.retail.calculateSaleValue(detail);
      }
      }else if (this.hbData['calculation_based_on'] == 3) {

        console.log(this.hbData['taxable'], 'taxable amount');
        console.log(this.hbData, 'hbdata');

      this.hbData['size'] = '0';
      this.hbData['gross_wt'] = '0.000';
      this.hbData['less_wt'] = '0.000';
      this.hbData['net_wt'] = '0.000';
      this.hbData['wast_wgt'] = '0.000';
      this.hbData['mc_type'] = '2';
      this.hbData['mc_value'] = '0';
      this.hbData['making_charge'] = '0';
this.hbData['rate_per'] = 0

        let detail = { itemData: this.hbData, metalRate: this.metalRate, tax_details: this.tax_details, item_type: this.item_type };
        console.log(detail)
        this.calc_taxable_amount(detail);
        // this.hbData = this.retail.calculateSaleValue(detail);
      }
    }
  }

  // Tag Item
  getTagData(tag_code) {
    if (tag_code.length > 0) {
      let loader = this.load.create({
        content: 'Please Wait',
        spinner: 'bubbles',
      });
      loader.present();
      var postData = { "type": 'EstiTag', "searchTxt": tag_code, "searchField": "tag_code", "id_branch": this.id_branch };
      this.retail.getTagData(postData).then(data => {
        if (data.status) {
          this.msg = data.msg;
          this.errorMsg = "";
          setTimeout(() => {
            this.msg = "";
          }, this.common.msgTimeout);
          data.tagData['actual_gross_wt'] = data.tagData['gross_wt'];
          data.tagData['charge_value'] = data.tagData['charge_value'];
          data.tagData['charges'] = data.tagData['charges'];

          data.tagData['actual_less_wt'] = data.tagData['less_wt'];
          data.tagData['actual_net_wt'] = data.tagData['net_wt'];
          data.tagData['checkwas'] = data.tagData['retail_max_wastage_percent'];
          this.stone_details = data.tagData['stone_details'];

          data.tagData['product_name'] = (data.tagData['parent_prods_name'] != null ? (data.tagData['parent_prods_name'] + ',' + data.tagData['product_name']) : data.tagData['product_name']);
          let detail = { itemData: data.tagData, metalRate: this.metalRate, tax_details: this.tax_details, item_type: this.item_type };
          this.tagData = this.retail.calculateSaleValue(detail);
        } else {
          this.tagData = { "tag_code": "", "tag_code1": "", "tag_code2": "", "is_partial": 0, "stone_details": [] };
          this.msg = "";
          this.errorMsg = data.msg;
          setTimeout(() => {
            this.errorMsg = "";
          }, this.common.msgTimeout);
        }

        loader.dismiss();
      })
    } else {
      console.log(tag_code);
      this.errorMsg = "Enter Tag Code";
      setTimeout(() => {
        this.errorMsg = "";
      }, this.common.msgTimeout);
    }
  }

  partlySale() {
    console.log('1111', this.tagData['is_partial']);
    console.log('details', this.stone_details);

    this.tagData['is_partial'] = this.tagData['is_partial'] ? 1 : 0;
    if (this.tagData['is_partial'] == 0) {
      this.tagData['gross_wt'] = this.tagData['actual_gross_wt'];
      this.tagData['less_wt'] = this.tagData['actual_less_wt'];
      this.tagData['net_wt'] = this.tagData['actual_net_wt'];
    }
  }
  // ./Tag Item

  // Non Tag
  collectionSelected(id_collection) {
    this.products = [];
    this.nonTagStock['products'].forEach(prod => {
      if (prod.id_collection == id_collection) {
        this.products.push(prod);
      }
    })
  }

  isFormInvalid(): boolean {
  return (
    this.hbData['gross_wt'] === '' || this.hbData['gross_wt'] == null ||
    this.hbData['net_wt'] === ''   || this.hbData['net_wt'] == null ||
    this.hbData['purname'] === '' || this.hbData['purname'] == null
  );
}


  sectionSelected(id_section) {
    this.sections = [];
    console.log(id_section)

    this.nontag_sections.forEach(element => {
      // console.log(element)
      // console.log(element.id_section)
      if (element.id_section == id_section) {
        this.sections.push(element);
        this.id_section = element.id_section
        this.section_name = element.section_name
        console.log('id_section : ', this.id_section);
      }


    })

    // this.designs = [];
    // this.ntData['pro_id'] = ''
    // this.ntData['product_name'] = ''
    // this.ntData['design'] = ''
    // this.ntData['sub_design'] = ''
    // this.ntData['sub_design_name'] = ''

    // this.nontag_products = this.products.filter(data => data['id_section'] ==  this.id_section);
    console.log(this.nontag_products);
  }

  /* Home Bill Sections */

  HbSelected(id_section) {
    this.sections = [];
    console.log(id_section)

    this.homebill_sections.forEach(element => {
      console.log(element)
      console.log(element.id_section)
      if (element.id_section == id_section) {
        this.id_section = element.id_section
        this.section_name = element.section_name
      }
    })

    this.nontag_products = this.products.filter(data => data['id_section'] == this.id_section);
    console.log(this.nontag_products);

  }



  append() {

    if (this.item_type == 'tag') {  // Tag


      var one: any = (<HTMLInputElement>document.getElementById('one1')).value;
      var two: any = (<HTMLInputElement>document.getElementById('two1')).value;

      console.log(one);
      console.log(two);

      this.tagData['tag_code'] = one + '-' + two;

      let test: any = new String(two);
      console.log(test.length)
      if (test.length == 5 && one != '') {
        this.getTagData(this.tagData['tag_code']);

      }
    }
    else if (this.item_type == 'home_bill') {  // Tag

      var one: any = (<HTMLInputElement>document.getElementById('one2')).value.toUpperCase();
      var two: any = (<HTMLInputElement>document.getElementById('two2')).value.toUpperCase();

      this.hbData['tag_code1'] = this.hbData['tag_code1'].toUpperCase();
      this.hbData['tag_code2'] = this.hbData['tag_code2'].toUpperCase();

      console.log(one);
      console.log(two);

      var tagCode = one + '-' + two;

      if (typeof tagCode === 'string' && tagCode.startsWith('-')) {
        tagCode = tagCode.substring(1);
      }

      this.hbData['tag_code'] = tagCode;

      // let test:any = new String(two);
      // console.log(test.length)
      // if(test.length == 5 && one != ''){
      //   this.getHomeStockByTag();

      // }

    }
  }

  productSelected(id_product) {
    // naveen
    // this.designs = [];
    // this.ntData['design'] = ''
    // this.ntData['sub_design'] = ''
    // this.ntData['sub_design_name'] = ''
    // this.selectedNTStock['AVgross_wt'] = ''
    // this.ntData['purname'] = ''
    console.log('product : ', this.nonTagStock['designs']);
    console.log('id_product', id_product);

    if (this.id_section != undefined && this.id_section != '') {
      this.nonTagStock['designs'].forEach(design => {
        if (design.pro_id == id_product) {
          this.designs.push(design);
          console.log('designs : ', this.designs);
        }
      })
      this.retail.getAllPurities(id_product).then(data => {
        this.ntPurities = data;
      });

    } else {
      // this.designs = [];
      // this.ntData['pro_id'] = ''
      // this.ntData['product_name'] = ''
      // this.ntData['design'] = ''
      // this.ntData['sub_design'] = ''
      // this.ntData['sub_design_name'] = ''
      let toastMsg = this.toast.create({
        message: 'You must  Select Sections..',
        duration: this.common.toastTimeout,
        position: 'middle'
      });
      toastMsg.present();
    }

  }
  clear() {

    if (this.item_type == 'old_metal') {
      this.omData['id_category'] = '';
      this.omData['id_old_metal_type'] = '';
      this.omData['id_old_metal_cat_type'] = '';
      this.omData['id_purpose'] = '';
      this.omData['gross_wt'] = '';
      this.omData['dust_wt'] = '';
      this.omData['stone_wt'] = '';
      this.omData['wastage'] = '';
      this.omData['wastage_wt'] = '';
      this.omData['net_wt'] = '';
      this.omData['rate'] = '';
      this.omData['amount'] = '';
      this.omData['purity'] = '';
      this.omData['sub_design_name'] = '';

      this.omData['old_pcs'] = '';

    }
    else if (this.item_type == 'home_bill') {  // Home Bill
      this.hbData['is_partly_sold'] = 0;
      this.hbData['tag_code'] = '';
      this.hbData['tag_code1'] = '';
      this.hbData['tag_code2'] = '';
      this.hbData['sub_design_name'] = '';

      this.hbData['collection'] = '';
      this.hbData['product_name'] = '';
      this.hbData['design_name'] = '';
      this.hbData['purname'] = '';
      this.hbData['size'] = '';
      this.hbData['piece'] = 1;
      this.hbData['gross_wt'] = '';
      this.hbData['less_wt'] = '';
      this.hbData['net_wt'] = '';
      this.hbData['retail_max_wastage_percent'] = '';
      this.hbData['wast_wgt'] = '';
      this.hbData['mc_type'] = '2';
      this.hbData['mc_value'] = '';
      this.hbData['making_charge'] = '';
      this.hbData['taxable'] = 0;
      this.hbData['tax_price'] = '';
      this.hbData['sales_value'] = '';

      this.hbPurities = [];
    }
    else if (this.item_type == 'non_tag') {  // Non Tag

    }
  }


  setNTitemData(id_design) {
    console.log(id_design, '000000000000000');
    this.sub_designs = []
    this.ntData['sub_design'] = ''
    this.ntData['sub_design_name'] = ''
    this.selectedNTStock['AVgross_wt'] = ''
    this.nonTagStock['sub_designs'].forEach(sub_design => {
      if (sub_design.pro_id == id_design.pro_id && sub_design.design_no == id_design.design_no) {
        this.sub_designs.push(sub_design);
        console.log('sub designs : ', this.sub_designs);

      }
    })
    console.log(this.ntData);


  }
  // ./Non Tag



  // Home Bill
  getHomeStockByTag() {
    console.log('clicked')
    var tag_code = this.hbData['tag_code'];
    console.log(tag_code)
    console.log(tag_code && tag_code.trim() != '' && tag_code.length > 0)


    if (tag_code && tag_code.trim() != '' && tag_code.length > 0) {
      let loader = this.load.create({
        content: 'Please Wait',
        spinner: 'bubbles',
      });
      loader.present();
      if (this.checkold == true) {
        var postData = { "type": "byTag", "searchTxt": tag_code, "searchField": "old_tag_id", "id_branch": this.id_branch };

      } else if (this.checkold == false) {
        var postData = { "type": "byTag", "searchTxt": tag_code, "searchField": "tag_code", "id_branch": this.id_branch };
      }
      this.retail.getHomeStock(postData).then(data => {
        if (data.status) {
          this.msg = data.msg;
          this.errorMsg = "";
          setTimeout(() => {
            this.msg = "";
          }, this.common.msgTimeout);
          data.homeStock['stock_gross_wt'] = data.homeStock['gross_wt'];
          data.homeStock['stock_less_wt'] = data.homeStock['less_wt'];
          data.homeStock['stock_net_wt'] = data.homeStock['net_wt'];
          if (data.homeStock['stone_details'] && data.homeStock['stone_details'].length > 0) {
            // reset before summing
            data.homeStock['less_wt'] = 0;
            data.homeStock['stone_price'] = 0;


            data.homeStock['stone_details'].forEach(element => {
              let wt = parseFloat(element['stone_wt']) || 0; // ensure number

              if (element['is_apply_in_lwt'] == '1') {
                if (element['uom_id'] == '6') {
                  wt = wt / 5;
                  // element['wt'] = wt.toString(); // keep as string if needed
                }
                data.homeStock['less_wt'] = parseFloat((data.homeStock['less_wt'] + wt).toFixed(3)); // proper numeric additio

              }
              this.tag_stoneamount_calc(element);
              let amt = parseFloat(element['stone_price']) || 0; // ensure number
              data.homeStock['stone_price'] = parseFloat((data.homeStock['stone_price'] + amt).toFixed(3)); // proper numeric addition

            });
          }
          this.stone_details = data.homeStock['stone_details'];
          let detail = { itemData: data.homeStock, metalRate: this.metalRate, tax_details: this.tax_details, item_type: this.item_type };
          this.hbData = this.retail.calculateSaleValue(detail);
          this.hbData['is_partly_sold'] = 1;
        } else {
          this.hbData = { 'charge_value': 0, 'mc_type': '1', 'id_charge': '', 'chargecode': '', "tag_code": "", "tag_code1": "", "tag_code2": "", "is_partly_sold": 0, "stone_details": [], 'allcharges': [], 'charges': [] };
          this.msg = "";
          this.errorMsg = data.msg;
          setTimeout(() => {
            this.errorMsg = "";
          }, this.common.msgTimeout);
        }
        loader.dismiss();
      })
    }
  }

  tag_stoneamount_calc(data) {
    if (data["stone_cal_type"] == "2") {
      data["amount"] =
        (data["pieces"] * data["rate_per_gram"]).toFixed(3);
    } else if (data["stone_cal_type"] == "1") {
      data["amount"] =
        (data["wt"] * data["rate_per_gram"]).toFixed(3);
    }
  }

  hbIsPartlySold(is_partly_sold) {
    //alert(is_partly_sold);
    this.hbData['is_partly_sold'] = is_partly_sold ? 1 : 0;
    console.log(this.hbData['is_partly_sold']);

  }

  checkcode() {

    let temp: any[] = this.hbData['allcharges'].filter(data => data['id_charge'] == this.hbData['id_charge']);
    this.hbData['chargecode'] = temp[0]['code_charge'];
    this.hbData['charge_value'] = temp[0]['value_charge'];
    this.calcSaleValue('');
  }
  hbProdSelected() {
    // if(this.hbDesigns.length == 0) {
    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();
    this.retail.getDesigns({ "type": "active", "id_product": this.hbData['pro_id'], "last_id": -1 }).then(data => {
      this.hbDesigns = data;

      if (this.hbDesigns.length == 1) {

        this.hbData['design_no'] = this.hbDesigns[0].id_design;
        this.hbData['design_name'] = this.hbDesigns[0].label;
        this.hbdesignSelected();

      }
      else {
        this.hbData['design_name'] = '';
        this.hbData['design_no'] = '';

      }
      loader.dismiss();
    })
    // }
    // if(this.hbPurities.length == 0) {
    // let loader = this.load.create({
    //   content: 'Please Wait',
    //   spinner: 'bubbles',
    // });
    // loader.present();
    this.retail.getAllPurities(this.hbData['pro_id']).then(data => {
      this.hbPurities = data;

      if (this.hbPurities.length == 1) {

        this.hbData['purity'] = this.hbPurities[0].id_purity;
        this.hbData['purname'] = this.hbPurities[0].label;
        this.hbData['metal_type'] = this.hbPurities[0].rate_field;
        this.hbData['market_metal_type'] = this.hbPurities[0].market_rate_field;


        // this.hbProdSelected();
        this.calcSaleValue('');

      }
      else {
        this.hbData['purity'] = '';
        this.hbData['purname'] = '';
      }

      // loader.dismiss();
    })
    // }
  }

  hbdesignSelected() {
    // if(this.hbDesigns.length == 0) {
    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();
    this.common.getsubdesigns({ "id_product": this.hbData['pro_id'], "design_no": this.hbData['design_no'] }).then(data => {
      this.hbsubDesigns = data;


      if (this.hbsubDesigns.length == 1) {

        this.hbData['sub_design_no'] = this.hbsubDesigns[0].id_sub_design;
        this.hbData['sub_design_name'] = this.hbsubDesigns[0].label;

      }
      else {
        this.hbData['sub_design_no'] = '';
        this.hbData['sub_design_name'] = '';

      }

      loader.dismiss();
    })
    // }

  }

  openMasSearch(master) {
    this.errorMsg = "";
    if (master == 'Product') {
      let loader = this.load.create({
        content: 'Please Wait',
        spinner: 'bubbles',
      });
      loader.present();
      if (this.ret_settings['subproduct_required'] == 1) {
        let filter_by = (this.ret_settings['collections_required'] == 1 ? "collection" : "category");
        let collection_id = (this.item_type == "home_bill" ? this.hbData['collection'] : this.ntData['collection']);
        if (collection_id > 0) {
          this.retail.getProductTreeList({ "filter_by": filter_by, "id": collection_id }).then(data => {
            if (this.item_type == "home_bill") {
              this.hbProducts = data;
            }
            loader.dismiss();
            this.openMasModal({ 'searchArr': data, page: master, listType: "tree" }, master);
          })
        } else {
          loader.dismiss();
          this.errorMsg = "Collection required !!";
          setTimeout(() => {
            this.errorMsg = "";
          }, this.common.msgTimeout);
        }
      } else {
        if (this.hbProducts.length == 0) {
          this.retail.getProducts({ "type": "active", "id_category": "", "last_id": -1 }).then(data => {
            this.hbProducts = data;
            loader.dismiss();
            this.openMasModal({ 'searchArr': this.hbProducts, page: master, listType: "normal" }, master);
          })
        } else {
          loader.dismiss();
          this.openMasModal({ 'searchArr': this.hbProducts, page: master, listType: "normal" }, master);
        }
      }
    }
    else if (master == 'Design') {
      if (this.hbData['pro_id']) {
        this.openMasModal({ 'searchArr': this.hbDesigns, page: master, listType: "normal" }, master);
      }
    }
    else if (master == 'subDesign') {
      if (this.hbData['design_no']) {
        this.openMasModal({ 'searchArr': this.hbsubDesigns, page: master, listType: "normal" }, master);
      }
    }
    else if (master == 'Purity') {
      if (this.hbData['pro_id']) {
        this.openMasModal({ 'searchArr': this.hbPurities, page: master, listType: "normal" }, master);
      }
    }

  }


  openMasSearch_nonTag(master) {
    this.errorMsg = "";
    console.log(this.nontag_sections);
    console.log(this.products);
    console.log(this.designs);
    console.log(this.sub_designs);


    switch (master) {
      case 'Section':
        this.openMasModal({ searchArr: this.nontag_sections, page: master, listType: "normal" }, master);
        break;

      case 'Product':
        this.openMasModal({ searchArr: this.products, page: master, listType: "normal" }, master);
        break;

      case 'Design':
        // if (this.ntData['pro_id']) {
        this.openMasModal({ searchArr: this.designs, page: master, listType: "normal" }, master);
        // }
        break;

      case 'subDesign':
        // if (this.ntData['design']) {
        this.openMasModal({ searchArr: this.sub_designs, page: master, listType: "normal" }, master);
        // }
        break;

      default:
        // Optional: handle invalid master values
        console.log('Invalid master type:', master);
        break;
    }
  }


  opennon() {


    let modal = this.modal.create(MasSearchPage, { 'searchArr': this.ntPurities, page: 'Purity', listType: "normal" })
    modal.present();
    modal.onDidDismiss(data => {
      if (data != null) {


        this.ntData['purity'] = data.id_purity;
        this.ntData['purname'] = data.label;
        this.ntData['metal_type'] = data.rate_field;
        this.ntData['market_metal_type'] = data.market_rate_field;
        // this.calcSaleValue('');

        let detail = { itemData: this.ntData, metalRate: this.metalRate, tax_details: this.tax_details, item_type: this.item_type };
        this.ntData = this.retail.calculateSaleValue(detail);
        console.log(this.ntData)


      }
    });
  }
  openMasModal(data, master) {
    let modal = this.modal.create(MasSearchPage, data)
    modal.present();
    modal.onDidDismiss(data => {
      if (data != null) {

        if (this.item_type == "non_tag") {

          if (master == 'Section') {
            this.ntData['id_section'] = data.id_section;
            this.ntData['section_name'] = data.section_name;
            this.sectionSelected(this.ntData['id_section'])
          }
          else if (master == 'Product') {
            this.ntData['pro_id'] = data.pro_id;
            this.ntData['product_name'] = data.product_name;
            this.pro_metal_type = data.pro_metal_type;
            this.productSelected(this.ntData['pro_id'])
          }
          else if (master == 'Design') {
            this.ntData['design_name'] = data['design_name']
            this.ntData['design'] = data
            this.setNTitemData(data)
          } else if (master == 'subDesign') {
            console.log(data, 'sub design');

            this.ntData['sub_design_name'] = data['sub_design_name']
            this.ntData['sub_design'] = data
            console.log(this.ntData['sub_design_name'], 'sub design');

            this.ntsubdesign(data)
          }

        } else if (this.item_type == "home_bill") {
          if (master == 'Design') {
            this.hbData['design_no'] = data.id_design;
            this.hbData['design_name'] = data.label;
            this.hbdesignSelected()

          }
          else if (master == 'subDesign') {
            this.hbData['sub_design_no'] = data.id_sub_design;
            this.hbData['sub_design_name'] = data.label;
            this.common.getset({
              "id_product": this.hbData['pro_id'],
              "id_design": this.hbData['design_no'],
              "id_sub_design": this.hbData['sub_design_no'],
              "gross_wt": this.hbData['gross_wt'],
              "type": 3,
              "lot_no": '',
              "id_branch": this.id_branch
            }).then(data => {

              this.hbData['checkwas'] = data['data']['wastag_min'];
              this.hbData['mc_min'] = data['data']['mc_min']
              if (this.hbData['mc_min'] != undefined) {
                this.show_home = true
              }
            });
          }
          else if (master == 'Product') {

            this.hbData['tax_type'] = data.tax_type;
            this.hbData['scheme_closure_benefit'] = data.scheme_closure_benefit;

            this.hbData['pro_id'] = data.pro_id;
            this.hbData['tax_group_id'] = data.tax_group_id;
            this.hbData['tax_percentage'] = data.tax_percentage;
            this.hbData['calculation_based_on'] = data.calculation_based_on;
            this.pro_metal_type = data.pro_metal_type;
            this.hbData['product_name'] = (data.parent_prods_name != null ? data.parent_prods_name + ',' + data.label : data.label);
            this.hbProdSelected();

          }
          else if (master == 'Purity') {
            this.hbData['purity'] = data.id_purity;
            this.hbData['purname'] = data.label;
            this.hbData['metal_type'] = data.rate_field;
            this.hbData['market_metal_type'] = data.market_rate_field;
            this.common.getset({
              "id_product": this.hbData['pro_id'],
              "id_design": this.hbData['design_no'],
              "id_sub_design": this.hbData['sub_design_no'],
              "gross_wt": this.hbData['gross_wt'],
              "type": 3,
              "lot_no": '',
              "id_branch": this.id_branch
            }).then(data => {

              this.hbData['checkwas'] = data['data']['wastag_min'];
              this.hbData['mc_min'] = data['data']['mc_min']
              if (this.hbData['mc_min'] != undefined) {
                this.show_home = true
              }
            });
            this.calcSaleValue('hbgross');

          }
        }

      }
    });
  }
  // ./Home Bill

  // Old Metal
  calcOldmetalValue2(changedInput) {
    this.omData['other_stone_wt'] = 0;
    this.omData['other_stone_price'] = 0;
    if (changedInput == 'id_category') {
      let cat = this.oldMetalCat.filter((i: any) => i.id_category == this.omData['id_category']);
      this.omData['category'] = cat[0].cat_name;
      let metaltype = this.oldMetalTypes.filter((i: any) => i.id_metal == this.omData['id_category']);
      this.metalCatTypes = metaltype;

      if (this.metalCatTypes.length == 1) {


        this.omData['id_old_metal_type'] = this.metalCatTypes[0]['id_metal_type'];
      }
      else {
        this.omData['id_old_metal_type'] = '';

      }
      //  let metaltype =  this.oldfullrates.filter((i: any) => i.id_metal == this.omData['id_category']);
      // this.oldrates = metaltype;

      // this.oldcategory = [];
      // this.omData['rate']  = 0;
    }
    //   else if(changedInput == 'id_old_metal_type'){


    //      let metaltype =  this.oldfullcategory.filter((i: any) => i.id_old_metal_type == this.omData['id_old_metal_type']);
    //     this.oldcategory = metaltype;

    //     let metaltype1 =  this.oldfullrates.filter((i: any) => i.id_metal == this.omData['id_category']);
    //     this.oldamount = metaltype1[0].rate;
    //     console.log(this.oldamount)

    //   }
    //   else if(changedInput == 'id_old_metal_cat_type'){


    //     let metaltype =  this.oldfullcategory.filter((i: any) => i.id_old_metal_cat == this.omData['id_old_metal_cat_type']);
    //    this.omData['rate'] = this.oldamount -  this.oldamount * metaltype[0].old_metal_perc / 100;
    //  }
    else if (changedInput == 'id_purpose') {
      this.omData['purpose'] = (this.omData['id_purpose'] == 1 ? "Cash" : "Exchange");
    }
    console.log(this.omData['rate'])
    if (changedInput == 'stone') {
      let stData = this.calcStoneDetail();
      this.omData['other_stone_wt'] = stData['stone_wt'];
      this.omData['other_stone_price'] = stData['stone_price'];
    }
    this.omData['stone_details'] = this.stone_details;
    let gross_wt = this.retail.setAsNumber(this.omData['gross_wt']);
    let dust_wt = this.retail.setAsNumber(this.omData['dust_wt']);
    let stone_wt = this.retail.setAsNumber(this.omData['stone_wt']);
    let other_stone_wt = this.retail.setAsNumber(this.omData['other_stone_wt']);
    let other_stone_price = this.retail.setAsNumber(this.omData['other_stone_price']);
    let rate_per_grm = this.retail.setAsNumber(this.omData['rate']);
    let wast_wgt = this.retail.setAsNumber(this.omData['wastage_wt']);
    let wast_percent = this.retail.setAsNumber(this.omData['wastage']);
    let net_wt = parseFloat(((gross_wt) - (dust_wt) - (stone_wt) - (other_stone_wt)).toFixed(3));
    console.log(net_wt)
    if (changedInput == 'wastage_wt') {
      // let net_wt 			= parseFloat(((gross_wt) - (dust_wt) - (stone_wt) - (other_stone_wt) - (wast_wgt)).toFixed(3));

      //let wast_percent= ((net_wt * (wast_wgt / 100)));
      let wast_percent = parseFloat((((wast_wgt) * 100) / net_wt).toFixed(3));
      this.omData['wastage'] = wast_percent;
      net_wt = parseFloat(((gross_wt) - (dust_wt) - (stone_wt) - (other_stone_wt) - (wast_wgt)).toFixed(3));
      let amount = Math.round((net_wt * rate_per_grm) + (other_stone_price));

      this.omData['net_wt'] = net_wt;
      this.omData['amount'] = amount;
    }
    else { // wastage %
      let wast_wgt = parseFloat((net_wt * (wast_percent / 100)).toFixed(2));
      this.omData['wastage_wt'] = wast_wgt;
      console.log(this.omData['wastage'])
      net_wt = parseFloat(((gross_wt) - (dust_wt) - (stone_wt) - (other_stone_wt) - (wast_wgt)).toFixed(3));
      let amount = Math.round((net_wt * rate_per_grm) + (other_stone_price));

      this.omData['net_wt'] = net_wt;
      this.omData['amount'] = amount;
    }
    // else{
    //   net_wt 			= parseFloat(((gross_wt) - (dust_wt) - (stone_wt) - (other_stone_wt) - (wast_wgt)).toFixed(3));
    //   let amount 	= Math.round((net_wt*rate_per_grm)+(other_stone_price));

    //   this.omData['net_wt']  = net_wt;
    //   this.omData['amount']  = amount;
    // }


    console.log(this.omData)
  }

  calcOldmetalValue(changedInput) {

    //  this.checking();
    console.log(changedInput);


    this.omData['gross_wt'] = this.omData['gross_wt'] < 0 ? 0 : this.omData['gross_wt'];
    this.omData['rate'] = this.omData['rate'] < 0 ? 0 : this.omData['rate'];
    this.omData['touch'] = parseFloat(this.omData['touch']) < 0 ? '0' : this.omData['touch']
    this.omData['other_stone_wt'] = 0;
    this.omData['other_stone_price'] = 0;
    if (changedInput == 'id_category') {
      console.log('id_category');

      let cat = this.oldMetalCat.filter((i: any) => i.id_category == this.omData['id_category']);
      this.omData['category'] = cat[0].cat_name;
      let metaltype = this.oldMetalTypes.filter((i: any) => i.id_metal == this.omData['id_category']);
      this.metalCatTypes = metaltype;

      console.log(this.metalCatTypes);
      //  console.log(this.metalCatTypes[0]['id_metal'], 'zzzzz');


      this.omData['id_old_metal_type'] = this.metalCatTypes.length > 0 ? this.metalCatTypes[0]['id_metal_type'] : '';
      console.log(this.oldfullcategory, 'pppp');
      this.omData['id_metal_type'] = 1
      console.log(this.omData['id_old_metal_type'], 'oooooo');


      metaltype = this.oldfullcategory.filter((i: any) => i.id_old_metal_type == this.omData['id_old_metal_type']);
      if (metaltype.length != 0) {
        this.get_purity_default(metaltype[0])
      }
      this.oldcategory = metaltype;
      console.log(this.oldcategory)

      let metaltype1 = this.oldfullrates.filter((i: any) => i.id_metal == this.omData['id_category']);
      console.log(metaltype1);
      if (metaltype1.length != 0) {
        this.oldamount = metaltype1[0].rate;
      } else {
        console.log("metal type is empty");
      }

      this.omData['id_old_metal_cat_type'] = this.oldcategory.length > 0 ? this.oldcategory[0]['id_old_metal_cat'] : '';
      console.log(this.omData['id_old_metal_cat_type']);

      console.log('old :', this.oldfullcategory);

      metaltype = this.oldfullcategory.filter((i: any) => i.id_old_metal_cat == this.omData['id_old_metal_cat_type']);
      console.log(metaltype);

      if (metaltype.length != 0) {
        // this.omData['rate'] = this.oldamount - this.oldamount * metaltype[0].old_metal_perc / 100;
        // naveen
      }
      //  let metaltype =  this.oldfullrates.filter((i: any) => i.id_metal == this.omData['id_category']);
      // this.oldrates = metaltype;

      // this.oldcategory = [];
      // this.omData['rate']  = 0;

    }
    else if (changedInput == 'id_old_metal_type') {
      console.log('id_old_metal_type');


      console.log(this.oldfullcategory);
      console.log(this.omData['id_old_metal_type'])
      let metaltype = this.oldfullcategory.filter((i: any) => i.id_old_metal_type == this.omData['id_old_metal_type']);
      this.oldcategory = metaltype;
      console.log(this.oldcategory);

      let metaltype1 = this.oldfullrates.filter((i: any) => i.id_metal == this.omData['id_category']);
      if (metaltype1.length != 0) {
        this.oldamount = metaltype1[0].rate;
      } else {
        console.log("metal type is empty");
      }

      // this.oldamount = metaltype1[0].rate;
      console.log(this.oldamount)
      console.log(this.omData['id_old_metal_cat_type'])

    }
    else if (changedInput == 'id_old_metal_cat_type') {
      console.log('id_old_metal_cat_type');

      console.log(this.omData, 'ondata');

      console.log(this.omData['id_old_metal_cat_type'])
      console.log(this.oldfullcategory)

      let metaltype = this.oldfullcategory.filter((i: any) => i.id_old_metal_cat == this.omData['id_old_metal_cat_type']);
      console.log(metaltype, 'metal type');
      if (metaltype.length != 0) {
        this.get_purity_default(metaltype[0])
        // this.omData['rate'] = this.oldamount - this.oldamount * metaltype[0].old_metal_perc / 100;
        // naveen
      }

      //  this.omData['rate'] = Math.round(Math.ceil(this.omData['rate']/10))*10 ;
      console.log(this.omData['rate']);

    }
    else if (changedInput == 'id_purpose') {
      console.log('id_purpose');

      this.omData['purpose'] = (this.omData['id_purpose'] == 1 ? "Cash" : "Exchange");
    }
    else if (changedInput == 'touch') {

      console.log('touch');

      console.log(parseFloat(this.omData['touch']) <= 100)
      if (parseFloat(this.omData['touch']) <= 100) {
        this.errorMsg = ''


      } else if (parseFloat(this.omData['touch']) > 100) {
        this.omData['touch'] = '100'
        // this.errorMsg = "Please Enter Lessthan 100%";
      }

    }

    // console.log(this.omData['rate'])
    // if(changedInput == 'stone')
    // {
    let stData = this.calcStoneDetail();
    // this.omData['other_stone_wt'] = stData['stone_wt'];
    // this.omData['other_stone_price'] = stData['stone_price'];
    this.omData['stone_price'] = stData['stone_price'];
    this.omData['stone_details'] = this.stone_details;
    this.omData['stone_wt'] = stData['stone_wt'];

    this.omData['other_stone_wt'] = stData['stone_wt'];
    this.omData['other_stone_price'] = stData['stone_price'];
    // }
    this.omData['stone_details'] = this.stone_details;
    let gross_wt = this.retail.setAsNumber(this.omData['gross_wt']);
    let dust_wt = this.retail.setAsNumber(this.omData['dust_wt']);
    let stone_wt = this.retail.setAsNumber(this.omData['stone_wt']);
    let other_stone_wt = this.retail.setAsNumber(this.omData['other_stone_wt']);
    let other_stone_price = this.retail.setAsNumber(this.omData['other_stone_price']);
    // let rate_per_grm: any = this.retail.setAsNumber(this.omData['rate']);
    let rate_per_grm: any;

    console.log(this.omData, 'omdata');



    if (!this.mr) {
      if (this.omData['id_category'] == '1') {
        if (this.omData['purity'] == "75.00") {
          rate_per_grm = this.retail.setAsNumber(this.metalRate['goldrate_18ct']);
          console.log(rate_per_grm, 'rate');

        } else {
          rate_per_grm = this.retail.setAsNumber(this.metalRate['goldrate_22ct']);
          console.log(rate_per_grm, 'rate');

        }
      } else if (this.omData['id_category'] == '2') {
        rate_per_grm = this.retail.setAsNumber(this.metalRate['silverrate_1gm']);

      } else if (this.omData['id_category'] == '3') {
        rate_per_grm = this.retail.setAsNumber(this.metalRate['platinum_1g']);

      }
      this.omData['rate'] = rate_per_grm

    } else {
      rate_per_grm = this.omData['rate']

    }



    let wast_wgt = this.retail.setAsNumber(this.omData['wastage_wt']);
    let wast_percent = this.retail.setAsNumber(this.omData['wastage']);
    let net_wt: any = parseFloat(((gross_wt) - (dust_wt) - (other_stone_wt)).toFixed(3));
    console.log(net_wt)
    if (changedInput == 'wastage_wt') {
      // let net_wt 			= parseFloat(((gross_wt) - (dust_wt) - (stone_wt) - (other_stone_wt) - (wast_wgt)).toFixed(3));

      //let wast_percent= ((net_wt * (wast_wgt / 100)));
      let wast_percent = parseFloat((((wast_wgt) * 100) / net_wt).toFixed(3));
      this.omData['wastage'] = wast_percent;
      net_wt = parseFloat(((gross_wt) - (dust_wt) - (other_stone_wt) - (wast_wgt)).toFixed(3));
      let amount = Math.round((net_wt * rate_per_grm) + (other_stone_price));

      this.omData['net_wt'] = net_wt;
      // amount = parseFloat(net_wt) * parseFloat(this.omData['touch']) / 100 * parseFloat(rate_per_grm);
      amount = parseFloat(net_wt) * parseFloat(this.omData['touch']) / 100 * parseFloat(rate_per_grm) + (other_stone_price);

      this.omData['amount'] = amount.toFixed(2);
      this.omData['amount'] = amount;
    }
    else { // wastage %
      let wast_wgt = parseFloat((net_wt * (wast_percent / 100)).toFixed(3));
      this.omData['wastage_wt'] = wast_wgt;
      console.log(this.omData['wastage'])
      net_wt = parseFloat(((gross_wt) - (dust_wt) - (other_stone_wt) - (wast_wgt)).toFixed(3));
      let amount: any = Math.round((net_wt * rate_per_grm) + (other_stone_price));

      this.omData['net_wt'] = net_wt;
      amount = parseFloat(net_wt) * parseFloat(this.omData['touch']) / 100 * parseFloat(rate_per_grm) + (other_stone_price);


      this.omData['amount'] = amount.toFixed(2);
    }
    // else{
    //   net_wt 			= parseFloat(((gross_wt) - (dust_wt) - (stone_wt) - (other_stone_wt) - (wast_wgt)).toFixed(3));
    //   let amount 	= Math.round((net_wt*rate_per_grm)+(other_stone_price));

    //   this.omData['net_wt']  = net_wt;
    //   this.omData['amount']  = amount;
    // }

    console.log(this.omData)
  }



  // ./Old Metal
  addother() {
    let modal = this.modal.create(OtherPage, { "stoneMasData": this.stoneMasData, "action": "add", "other_metal": this.other });
    modal.present();
    modal.onDidDismiss(data => {
      if (data != null) {
        console.log('stone : ', data);

        this.tagData['othermetal_details'] = data;
        this.other = data;
        this.tagData['othermetal_charges'] = 0;

        data.forEach(element => {

          this.tagData['othermetal_charges'] += element['price'];
        });
        this.calcSaleValue('');
        console.log(data);
      }
    });
  }

  // Stone Details
  addStone() {

    let gross: any = 0;

    if (this.item_type == 'old_metal') {

      gross = this.omData['gross_wt']
    }

    else if (this.item_type == 'non_tag') {

      gross = this.ntData['gross_wt']
    }
    else if (this.item_type == 'home_bill') {
      gross = this.hbData['gross_wt'];

    }
    else if (this.item_type == 'tag') {
      gross = this.tagData['gross_wt'];
    }
    console.log('addStone : ', this.stone_details);

    // if(this.initial == true){
    //   console.log('add true :  ');
    //   var temp = JSON.parse(localStorage.getItem('actualTag'));
    //   console.log('tempp: ', temp[0]);
    //   this.tagData = Object.assign({}, temp[0]);
    //   this.stone_details = this.tagData.hasOwnProperty('stone_details') ? this.tagData['stone_details'] : [];
    //   console.log(this.stone_details);
    //   //this.tagData['stone_details'] = this.stone_details;
    // }else{
    //   console.log('add else : ');

    //   this.tagData['stone_details'] = this.stone_details;
    //   console.log(this.tagData['stone_details']);

    // }


    let modal = this.modal.create(AddStoneDetailPage, { "tagData": this.tagData, "stoneMasData": this.stoneMasData, "action": "add", "stone_details": JSON.parse(JSON.stringify(this.stone_details)), "ptype": this.item_type, 'gross': gross, "stoneMasTypes": this.stoneMasTypes, "is_partial": this.hbData['is_partly_sold'] });
    modal.present();
    modal.onDidDismiss(data => {
      console.log(data, 'modal dataaaaaaaaaaaaaa');
      console.log(this.tagData, 'tag data');
      console.log(this.stone_details, 'stone');


      if (data != null) {
        this.stone_details = data['data'];
        this.old_stone_settings = data['old_stone_settings'];

        console.log(data);
        console.log(this.stone_details);
        // Remove the old 'tag_data'

        // let freshData = JSON.parse(JSON.stringify(this.tagData));
        // localStorage.setItem('tag_data', JSON.stringify(freshData));
        // this.tagData = JSON.parse(localStorage.getItem('tag_data') || '[]');
        //       console.log(this.tagData,'tag data');


        if (this.item_type == 'old_metal') {

          this.calcOldmetalValue('');
        }
        else if (this.item_type == 'home_bill') {
          this.hbData['stone_details'] = this.stone_details;

          this.calcSaleValue('');
        }
        else if (this.item_type == 'non_tag') {
          this.ntData['stone_details'] = this.stone_details;

          this.calcSaleValue('');
        }
        else if (this.item_type == 'tag') {
          // this.hbData['stone_details'] = this.stone_details;

          this.calcSaleValue('');
          console.log(this.tagData, 'tag data');
        }
        console.log(data);
      } else {
        // naveen
        // var temp = JSON.parse(localStorage.getItem('actualTag'));
        // console.log('tempp: ', temp);
        // this.tagData = Object.assign({}, this.tagData);
        // this.stone_details = this.tagData.hasOwnProperty('stone_details') ? this.tagData['stone_details'] : [];
        // console.log(this.stone_details);
        // this.initial = true;
        // console.log('clear 1 : ',JSON.parse(localStorage.getItem('tag_data')));
        // // let tempesti = JSON.parse(localStorage.getItem('tag_data'));
        // //   this.tagData = Object.assign({}, tempesti);
        // this.stone_details = this.tagData['stone_details'];
        // this.calcSaleValue('');
        // this.stone_details = this.tagData.hasOwnProperty('stone_details') ? this.tagData['stone_details'] : [];
        // console.log(this.stone_details,'stone');


      }


    });
    /*let addRow = true;
    this.stone_details.forEach( i => {
      if(i['stone_id'] == ''){
        addRow = false;
      }
    })
    if(addRow){
      this.stone_details.push({"stone_id" : "", "stone_pcs" : "1", "stone_wt" : "0", "st_price" : "0"});
    }
    else{
      setTimeout(()=>{
        this.stnErrMsg = "Invalid stone detail..";
      },this.common.msgTimeout);
    }
    console.log(this.stone_details) ;*/
  }

  deleteStone(idx) {
    this.stone_details.splice(idx, 1);
    this.calcOldmetalValue('stone');
  }
  // ./Stone Details

  /*getCatPurities(id_category){
    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();
    this.retail.getCatPurities(postData).then(data=>{
      loader.dismiss();
    })
  }*/

  ionViewDidLoad() {

  }

  next(data) {

    this.homeback = data;
    this.content.scrollToTop();

  }
  back(data) {
    this.homeback = data;
    this.content.scrollToTop();

  }

  oldnext(data) {

    this.oldback = data;
    this.content.scrollToTop();

  }
  oback(data) {
    this.oldback = data;
    this.content.scrollToTop();

  }

  nnext(data) {

    this.nonback = data;
    this.content.scrollToTop();

  }
  nback(data) {
    this.nonback = data;
    this.content.scrollToTop();

  }
  checkingtagretail_max_wastage_percent() {
    this.tagData['retail_max_wastage_percent'] = this.tagData['retail_max_wastage_percent'] < 0 ? 0 : this.tagData['retail_max_wastage_percent'];
    console.log(this.tagData['retail_max_wastage_percent']);
    if (parseInt(this.tagData['retail_max_wastage_percent']) > 100) {
      this.cd.detectChanges();

      this.tagData['retail_max_wastage_percent'] = '';
      this.tagData['wastage_wt'] = '';

      this.cd.detectChanges();
      this.content.resize();
      this.calcSaleValue('');

    }
    else {
      this.calcSaleValue('');

    }
  }
  checkingtagless_wt() {

    console.log(parseInt(this.tagData['less_wt']) > parseInt(this.tagData['net_wt']))
    if (parseInt(this.tagData['less_wt']) > parseInt(this.tagData['net_wt'])) {
      this.cd.detectChanges();

      this.tagData['less_wt'] = '';
      this.cd.detectChanges();

      this.content.resize();
      this.calcSaleValue('');

    }
    else {
      this.calcSaleValue('');

    }
  }
  checkingnonless_wt() {
    this.ntData['less_wt'] = this.ntData['less_wt'] < 0 ? 0 : this.ntData['less_wt'];

    console.log(parseInt(this.ntData['less_wt']) > parseInt(this.ntData['net_wt']))
    if (parseInt(this.ntData['less_wt']) > parseInt(this.ntData['net_wt'])) {
      this.cd.detectChanges();

      this.ntData['less_wt'] = '';
      this.cd.detectChanges();
      setTimeout(() => {
        this.cd.detectChanges();

        this.ntData['less_wt'] = '';
        this.cd.detectChanges();
      }, 100);
      this.content.resize();
      this.calcSaleValue('');


    }
    else {
      this.calcSaleValue('');

    }
  }
  checkingnonretail_max_wastage_percent() {
    this.ntData['retail_max_wastage_percent'] = this.ntData['retail_max_wastage_percent'] < 0 ? 0 : this.ntData['retail_max_wastage_percent'];

    if (parseInt(this.ntData['retail_max_wastage_percent']) > 100) {
      this.cd.detectChanges();

      this.ntData['retail_max_wastage_percent'] = '';
      this.ntData['wast_wgt'] = '';

      this.cd.detectChanges();
      setTimeout(() => {
        this.cd.detectChanges();

        this.ntData['retail_max_wastage_percent'] = '';
        this.ntData['wast_wgt'] = '';
        this.cd.detectChanges();
      }, 100);
      this.content.resize();
      this.calcSaleValue('wast');

    }
    else {
      this.calcSaleValue('wast');

    }
  }
  checkingnonwast_wgt() {
    this.ntData['wast_wgt'] = this.ntData['wast_wgt'] < 0 ? 0 : this.ntData['wast_wgt'];

    if (parseInt(this.ntData['wast_wgt']) > parseInt(this.ntData['net_wt'])) {

      this.cd.detectChanges();

      this.ntData['retail_max_wastage_percent'] = '';
      this.ntData['wast_wgt'] = '';
      this.cd.detectChanges();
      setTimeout(() => {
        this.cd.detectChanges();

        this.ntData['retail_max_wastage_percent'] = '';
        this.ntData['wast_wgt'] = '';
        this.cd.detectChanges();
      }, 100);
      this.content.resize();
      this.calcSaleValue('wastage_wt');

    }
    else {
      this.calcSaleValue('wastage_wt');

    }

  }
  checkinghome() {
    console.log(this.hbData['wast_wgt']);
    console.log(parseInt(this.hbData['net_wt']));


    if (parseInt(this.hbData['wast_wgt']) > parseInt(this.hbData['net_wt'])) {
      console.log('if1');

      this.cd.detectChanges();

      this.hbData['retail_max_wastage_percent'] = '';
      this.hbData['wast_wgt'] = '';
      this.cd.detectChanges();
      setTimeout(() => {
        this.cd.detectChanges();

        this.hbData['retail_max_wastage_percent'] = '';
        this.hbData['wast_wgt'] = '';
        this.cd.detectChanges();
      }, 100);
      this.content.resize();
      this.calcSaleValue('');
    }
    if (parseInt(this.hbData['retail_max_wastage_percent']) > 100) {
      console.log('if2');

      this.cd.detectChanges();

      this.hbData['retail_max_wastage_percent'] = '';
      this.hbData['wast_wgt'] = '';

      this.cd.detectChanges();
      setTimeout(() => {
        this.cd.detectChanges();

        this.hbData['retail_max_wastage_percent'] = '';
        this.hbData['wast_wgt'] = '';
        this.cd.detectChanges();
      }, 100);
      this.content.resize();
      this.calcSaleValue('');


    }
  }
  checkingwastage() {
    this.omData['wastage'] = this.omData['wastage'] < 0 ? 0 : this.omData['wastage'];

    if (parseInt(this.omData['wastage']) > 100) {
      this.cd.detectChanges();

      this.omData['wastage'] = '';
      this.omData['wastage_wt'] = '';

      this.cd.detectChanges();
      setTimeout(() => {
        this.cd.detectChanges();

        this.omData['wastage'] = '';
        this.omData['wastage_wt'] = '';
        this.cd.detectChanges();
      }, 100);
      this.content.resize();
      this.calcOldmetalValue('wastage');

    }
    else {
      this.calcOldmetalValue('wastage');

    }
  }
  checkingwastage_wt() {
    this.omData['wastage_wt'] = this.omData['wastage_wt'] < 0 ? 0 : this.omData['wastage_wt'];

    if (parseInt(this.omData['wastage_wt']) > parseInt(this.omData['net_wt'])) {
      this.cd.detectChanges();

      this.omData['wastage'] = '';
      this.omData['wastage_wt'] = '';
      this.cd.detectChanges();
      setTimeout(() => {
        this.cd.detectChanges();

        this.omData['wastage'] = '';
        this.omData['wastage_wt'] = '';
        this.cd.detectChanges();
      }, 100);
      this.content.resize();
      this.calcOldmetalValue('wastage_wt');

    }
    else {
      this.calcOldmetalValue('wastage_wt');

    }
  }
  checkingstone_wt() {

    if (parseInt(this.omData['stone_wt']) > parseInt(this.omData['net_wt'])) {
      this.cd.detectChanges();

      this.omData['stone_wt'] = '';
      this.cd.detectChanges();
      setTimeout(() => {
        this.cd.detectChanges();

        this.omData['stone_wt'] = '';
        this.cd.detectChanges();
      }, 100);
      this.content.resize();
      this.calcOldmetalValue('stone_wt');

    }
    else {
      this.calcOldmetalValue('stone_wt');

    }
  }
  checkingdust_wt() {
    this.omData['dust_wt'] = this.omData['dust_wt'] < 0 ? 0 : this.omData['dust_wt'];
    console.log(parseInt(this.omData['dust_wt']) > parseInt(this.omData['net_wt']))
    if (parseInt(this.omData['dust_wt']) > parseInt(this.omData['net_wt'])) {
      this.cd.detectChanges();

      this.omData['dust_wt'] = '';
      this.cd.detectChanges();

      setTimeout(() => {
        this.cd.detectChanges();

        this.omData['dust_wt'] = '';
        this.cd.detectChanges();
      }, 100);
      this.content.resize();
      this.calcOldmetalValue('dust_wt');
    }
    else {
      this.calcOldmetalValue('dust_wt');

    }



  }
  oldsubdesign() {
    let modal = this.modal.create(Mass3Page)
    modal.present();
    modal.onDidDismiss(data => {
      if (data != null) {

        this.omData['old_metal_prod_id'] = data['old_metal_prod_id'];
        this.omData['old_metal_prod_name'] = data['old_metal_prod_name'];

      }
    });

  }
  ntsubdesign(id_design) {

    // if (nt_item.design == id_design.design_no && nt_item.pro_id == id_design.pro_id)
    // this.ntData['design_no'] = id_design.design_no;
    // this.ntData['design'] = id_design.design_name;
    console.log('design_no  :', this.ntData['design_no']);
    console.log('designs : ', this.ntData['design']);
    let set_design = this.ntData['design']
    let sub_design = id_design

    console.log(id_design.id_section);
    console.log('sundesigna choose : ', this.id_section);






    this.selectedNTStock = [];
    this.ntData['mc_type'] = '2';
    this.ntData['stone_details'] = [];
    console.log(this.nonTagStock1)

    this.nonTagStock1['nt_items'].forEach(nt_item => {
      // console.log('1 : ',nt_item.design);
      // console.log('2 : ',id_design.design_no);
      // console.log('3 :',nt_item.pro_id);
      // console.log('4 : ',id_design.pro_id);

      if (nt_item.design == id_design.design_no && nt_item.pro_id == id_design.pro_id && nt_item.id_sub_design == id_design.id_sub_design && nt_item.id_section == this.id_section) {
        console.log(nt_item, '00000000000')
        console.log('designs : ', this.ntData['design']);

        this.selectedNTStock['AVgross_wt'] = nt_item['AVgross_wt'];
        console.log('selectedNTStock : ', this.selectedNTStock['AVgross_wt']);

        this.selectedNTStock['gross_wt'] = nt_item['AVgross_wt'];
        this.selectedNTStock['less_wt'] = nt_item.less_wt;
        this.selectedNTStock['net_wt'] = nt_item.net_wt;
        this.selectedNTStock['piece'] = nt_item.piece;
        nt_item.product_name = (nt_item.parent_prods_name != null ? nt_item.parent_prods_name + ',' + nt_item.product_name : nt_item.product_name);
        // this.ntData = nt_item;
        // this.ntData['design'] = nt_item.design_name
        this.ntData['pro_id'] = nt_item.pro_id
        console.log(this.ntData['design'], '999999999999999');
        this.ntData['design_no'] = nt_item.design;
        this.ntData['AVgross_wt'] = nt_item.AVgross_wt;
        console.log('AVgross_wt', this.ntData['AVgross_wt']);
        // naveen1
        this.ntData['design'] = set_design
        this.ntData['sub_design'] = sub_design
        this.selectedNTStock['AVpiece'] = nt_item['AVpiece'];
        this.selectedNTStock['AVpieces'] = nt_item['AVpiece'];

        this.ntData['id_section'] = this.id_section
        this.ntData['section_name'] = this.section_name
        this.ntData['market_metal_type'] = nt_item['market_metal_type']
        this.ntData['metal_name'] = nt_item['metal_name']
        this.ntData['metal_type'] = nt_item['metal_type']
        this.ntData['calculation_based_on'] = nt_item['calculation_based_on']
        this.ntData['tax_group_id'] = nt_item['tax_group_id']
        this.ntData['id_nontag_item'] = nt_item['id_nontag_item']
        console.log('this.ntData nontag : ', this.ntData['id_nontag_item']);


        if (parseFloat(nt_item.gross_wt) == 0) {
          this.errorMsg = "Requested item is currently Out of Stock!!";
          this.msg = "";
          setTimeout(() => {
            this.errorMsg = "";
          }, this.common.msgTimeout);
        }
        if (parseFloat(nt_item.gross_wt) > 0) {
          this.ntData['gross_wt'] = "";
          this.ntData['less_wt'] = "";
          this.ntData['net_wt'] = "";
          this.ntData['piece'] = 1;
          this.ntData['size'] = '';
          this.ntData['purname'] = '';
        }
        console.log(this.ntData);
      }
    })


    console.log(this.ntData['sub_design_name'], 'sub design');



    // let modal = this.modal.create(Mass2Page)
    // modal.present();
    // modal.onDidDismiss(data => {
    //   if (data != null) {
    //     this.ntData['sub_design_name'] = data['label'];
    //     this.ntData['sub_design_id'] = data['value'];
    //   }
    // });

  }
  ionViewWillLeave() {
    this.events.publish('entered', false);

  }
  ionViewWillEnter() {

    this.events.publish('entered', true);
    this.events.publish('pageno', 1);

  }


  addcharge() {


    let modal = this.modal.create(ChargesPage, { "stoneMasData": this.stoneMasData, "action": "add", "stone_details": this.charges, "ptype": 'pro', 'gross': '' });
    modal.present();
    modal.onDidDismiss(data => {
      if (data != null) {

        this.charges = data;

        this.hbData['charges'] = this.charges;

        if (this.charges.length != 0) {
          this.hbData['charge_value'] = 0;

          this.charges.forEach(tag => {

            this.hbData['charge_value'] = Number(this.hbData['charge_value']) + Number(tag.charge_value);
          })
          this.calcSaleValue('');

        }

      }
    });

  }
  calculatecus() {
    
    var max_tol = this.pro_metal_type == '1' ||  this.tagData['id_metal'] == '1'? parseFloat(this.empData['emp_setting']['max_gold_tol']) : parseFloat(this.empData['emp_setting']['max_silver_tol']);
    var min_tol =this.pro_metal_type == '1' || this.tagData['id_metal'] == '1'? parseFloat(this.empData['emp_setting']['min_gold_tol']) : parseFloat(this.empData['emp_setting']['min_silver_tol']);
    if (this.item_type == 'tag') {

      this.tagData['metalratec'] = 'true';

      var metal_rate = parseFloat(this.metalRate[this.tagData['metal_type']]);

      var max_metal_val = metal_rate + (metal_rate * max_tol / 100);
      var min_metal_value = metal_rate - (metal_rate * min_tol / 100);
      var rate_per = parseFloat(this.tagData['rate_per']);
      console.log(max_metal_val);
      console.log(min_metal_value);

      if (rate_per >= min_metal_value && rate_per <= max_metal_val) {
        this.terrorMsg = '';
        this.calcSaleValue(this.item_type);
      } else {
        this.terrorMsg = "Please Enter Valid Metal Rate";

      }
    }
    else if (this.item_type == 'non_tag') {
      this.ntData['metalratec'] = 'true';


      var metal_rate = parseFloat(this.metalRate[this.ntData['metal_type']]);

      var max_metal_val = metal_rate + (metal_rate * max_tol / 100);
      var min_metal_value = metal_rate - (metal_rate * min_tol / 100);
      var rate_per = parseFloat(this.ntData['rate_per']);
      console.log(max_metal_val);
      console.log(min_metal_value);

      if (rate_per >= min_metal_value && rate_per <= max_metal_val) {
        this.metal_error_msg = '';
        this.calcSaleValue(this.item_type);
      } else {
        this.metal_error_msg = "Please Enter Valid Metal Rate";

      }

    }
    else if (this.item_type == 'home_bill') {
      this.hbData['metalratec'] = 'true';
      var metal_rate = parseFloat(this.metalRate[this.hbData['metal_type']]);

      var max_metal_val = metal_rate + (metal_rate * max_tol / 100);
      var min_metal_value = metal_rate - (metal_rate * min_tol / 100);
      var rate_per = parseFloat(this.hbData['rate_per']);
      console.log(max_metal_val);
      console.log(min_metal_value);

      if (rate_per >= min_metal_value && rate_per <= max_metal_val) {
        this.metal_error_msg = '';
        this.calcSaleValue(this.item_type);
      } else {
        this.metal_error_msg = "Please Enter Valid Metal Rate";

      }
    }
  }
  public onKeyUp(event: any) {
    // let newValue = event.target.value;
    // const charCode = (event.which) ? event.which : event.keyCode;
    // console.log(charCode)
    // console.log(newValue)
    // console.log(event)
    // console.log(event.key)

    // if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    //   event.target.value = newValue.slice(0, -1);
    //   return false;
    // }
    // return true;
    this.selectedNTStock['AVpieces'] = this.selectedNTStock['AVpiece'] - this.ntData['piece']
    this.selectedNTStock['AVpieces'] = this.selectedNTStock['AVpieces'] < 0 ? 0 : this.selectedNTStock['AVpieces'];
    // this.ntData['piece'] = this.selectedNTStock['AVpiece'] < this.ntData['piece'] ? this.selectedNTStock['AVpiece'] : this.ntData['piece'];
      // if (parseFloat(this.selectedNTStock['AVpiece']) > parseFloat(this.ntData['piece'])) {
      //    this.ntData['piece'] = this.selectedNTStock['AVpiece'];

      // }
      
  }

  non_pcs(){
       this.selectedNTStock['AVpieces'] = this.selectedNTStock['AVpiece'] - this.ntData['piece']
    this.selectedNTStock['AVpieces'] = this.selectedNTStock['AVpieces'] < 0 ? 0 : this.selectedNTStock['AVpieces'];
    // this.ntData['piece'] = this.selectedNTStock['AVpiece'] < this.ntData['piece'] ? this.selectedNTStock['AVpiece'] : this.ntData['piece'];
      if (parseFloat(this.selectedNTStock['AVpiece']) < parseFloat(this.ntData['piece'])) {
         this.ntData['piece'] = this.selectedNTStock['AVpiece'];

      }
  }
  // purcheck() {
  // this.omData['purity'] = isNaN(parseFloat(this.omData['purity'])) || this.omData['purity'] < 0 || this.omData['purity'] > 100? 0 : parseFloat(this.omData['purity']);

  //     this.omData['wastage'] = !this.purity_show? (100 - parseFloat(this.omData['purity'])).toFixed(2):0;
  //     console.log(this.omData['wastage'],'wast');

  //   // if (this.omData['id_category'] == '2') {

  //   //   this.omData['wastage'] = 0 // 100 - this.omData['purity'];
  //   //   this.checkingwastage();
  //   // }

  //    let purity = Number(this.omData['purity']); // convert to number safely

  // // if (purity < 100) {
  // //   // Option 1: Reset to 10
  // //   this.omData['purity'] = 100;

  // //   // Option 2: Show alert/toast
  // //   let toast = this.toast.create({
  // //     message: "please enter valid purity",
  // //     duration: 2000,
  // //     position: "bottom"
  // //   });
  // //   toast.present();
  // // }

  // }

  purcheck() {
    this.omData['purity'] = this.omData['purity'] < 0 ? 0 : this.omData['purity'];
    if (this.omData['id_category'] == '2') {
      this.omData['wastage'] = 100 - this.omData['purity'];
      this.checkingwastage();
    }
  }

  public mobonKeyUp(event: any) {
    const NUMBER_REGEXP = /^[0-9]*$/;
    let newValue = event.target.value;
    let regExp = new RegExp(NUMBER_REGEXP);
    if (!regExp.test(newValue)) {
      event.target.value = newValue.slice(0, -1);
      return true;
    } else {
      return false;
    }
  }


  hbgross() {
    this.calcSaleValue('hbgross');
  }

  non_gross() {

    this.common.getset({
      "id_product": this.ntData['pro_id'],
      "id_design": this.ntData['design']['design_no'],
      "id_sub_design": this.ntData['sub_design_id'],
      "gross_wt": this.ntData['gross_wt'],
      "type": 2,
      "lot_no": "",
      "id_branch": this.id_branch
    }).then(data => {
      console.log(data, '9999999999999');


      this.ntData['checkwas'] = data['data']['wastag_min'];
      this.ntData['mc_min'] = data['data']['mc_min'];
      if (this.ntData['mc_min'] != undefined) {
        this.show_mc = true
      }
      this.calcSaleValue('gross');


    });
  }



  get_purity_default(data) {
    if (data['id_old_metal_cat'] == 39 || data['id_old_metal_cat'] == 37) {
      this.purity_show = true;
      this.omData['purity'] = data.id_old_metal_cat == 39 ? '75.00' : '91.60';
      this.omData['wastage'] = 0;
      console.log(this.omData['wastage'], 'wastage');

    } else {
      this.omData['purity'] = '';
      this.purity_show = false;

    }


  }



  calc_taxable_amount(data) {
    var itemData = data.itemData;
    this.hbData['sales_value'] = 0
    if (itemData['tax_type'] == 1) {
      var tax_rate: any = this.calculate_inclusive_value_tax(itemData['taxable'], itemData['tax_group_id'])
      console.log(tax_rate, 'tax rate ');
      this.hbData['tax_price'] = parseFloat(tax_rate).toFixed(2)
      this.hbData['sales_value'] = parseFloat(this.amt_without_gst).toFixed(2)
    }
    else {
      var tax_rate: any = this.calculate_exclusive_value_tax(itemData['taxable'], itemData['tax_group_id'])
      console.log(tax_rate, 'tax rate ');
      this.hbData['tax_price'] = parseFloat(tax_rate).toFixed(2)
      this.hbData['sales_value'] = (parseFloat(itemData['taxable']) + parseFloat(tax_rate)).toFixed(2);
    }

    console.log(this.hbData['tax_price'], "tax price");
    console.log(this.hbData['sales_value'], "tax price");
  }

  calculate_exclusive_value_tax(taxcallrate, taxgroup) {
    var totaltax = 0;
    console.log(taxcallrate, 'cal rate');
    console.log(taxgroup, 'cal rate');

    this.tax_details.forEach(taxitem => {
      if (taxitem.tgi_tgrpcode == taxgroup) {
        if (taxitem.tgi_calculation == 1) {
          if (taxitem.tgi_type == '1') {
            totaltax += (taxcallrate) * ((taxitem.tax_percentage) / 100);
            console.log(totaltax, 'total tax');

          } else {
            totaltax -= (taxcallrate) * ((taxitem.tax_percentage) / 100);
          }
        }
      }
    });
    return totaltax;
  }

  amt_without_gst: any;
  calculate_inclusive_value_tax(taxcallrate, taxgroup) {
    var totaltax = 0;
    this.amt_without_gst = 0;
    this.tax_details.forEach(taxitem => {
      if (taxitem.tgi_tgrpcode == taxgroup) {
        if (taxitem.tgi_calculation == 1) {
          if (taxitem.tgi_type == '1') {
            const rate = parseFloat(taxcallrate) || 0;
            const taxPercent = parseFloat(taxitem.tax_percentage) || 0;
            this.amt_without_gst = (rate * 100) / (100 + taxPercent);
            totaltax = rate - this.amt_without_gst;
            console.log(totaltax, 'total tax');

          }
        }
      }
    });
    return totaltax;

  }






  forceMinValue() {
    const mcMin = parseFloat(this.tagData['mc_min']) || 0;
    const val = parseFloat(this.tagData['mc_value']) || 0;
    this.terrorMsg = ''
    if (val < mcMin) {
      // this.tagData['mc_value'] = mcMin; // force it back to min
      console.log('1111111111111', this.tagData['mc_value']);
      this.terrorMsg = "Please Enter required MC Value";

    } else {
      this.calcSaleValue('');
    }
  }





}
