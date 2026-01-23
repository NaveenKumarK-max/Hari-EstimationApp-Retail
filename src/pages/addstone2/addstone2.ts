import { Component } from '@angular/core';
import { Events, IonicPage, NavParams, ViewController, LoadingController, ToastController, ModalController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common';
import { RetailProvider } from '../../providers/retail';
import { filter } from 'rxjs/operators';
import { StonesearchPage } from '../stonesearch/stonesearch';

/**
 * Generated class for the AddStoneDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-addstone2',
  templateUrl: 'addstone2.html',
  providers: [CommonProvider, RetailProvider]

})
export class Addstone2Page {

  stoneData: any = [{ "is_apply_in_lwt": 0, "lwt": false, "stone_id": 0, "stone_pcs": '', "stone_wt": '', "stone_price": '' }];
  stoneSelected = { "rate_type": "1" };

  tagstoneData: any = [
    {
      amount: '',
      is_apply_in_lwt: 0,
      pieces: '',
      rate_per_gram: '',
      stone_cal_type: 0,
      stone_id: 0,
      stone_type: 0,
      tag_id: 0,
      uom_id: 0,
      wt: '',
      lwt: false
    }];

  fixed_rate_type: any = "";
  action: any;
  page: any;
  stoneMasData = [];
  stones = [];
  uom = [];
  cut = [];
  clarity = [];
  color = [];
  shape = [];
  errorMsg: any;
  stnErrMsg: any;
  proceedSave = false;
  ptype: any = "";
  gross: any = 0;
  ctype = [{ 'name': 'By Wt', 'stone_cal_type': '1' }, { 'name': 'By Pcs', 'stone_cal_type': '2' }];
  gtype_filter = [{ 'name': 'Carat', 'uom_id': '6' }, { 'name': 'Gram', 'uom_id': '1' }];

  totalvalue: any = 0
  totalgram: any = 0;
  totalct: any = 0;

  stoneMasTypes = [];
  gtype = [];

  uomtype:any =[];

  constructor(public modal: ModalController, private events: Events, public toast: ToastController, public load: LoadingController, public retail: RetailProvider, public common: CommonProvider, public viewCtrl: ViewController, public navParams: NavParams) {
    this.page = this.navParams.get('page');
    this.ptype = this.navParams.get('ptype');
    this.gross = this.navParams.get('gross');

    this.stoneMasData = this.navParams.get('stoneMasData');
    this.stoneMasTypes = this.navParams.get('stoneMasTypes');

    if (this.stoneMasData) {
      this.stones = this.stoneMasData;
      this.uom = this.stoneMasData;
      this.cut = this.stoneMasData;
      this.clarity = this.stoneMasData;
      this.color = this.stoneMasData;
      this.shape = this.stoneMasData;
    }
    console.log(this.stoneMasData);
    console.log(this.navParams.get('stone_details'))
    if (this.navParams.get('stone_details').length > 0 && this.ptype == 'tag') {
      this.tagstoneData = this.navParams.get('stone_details');
      this.get_total()
      this.uomchange()
      this.tagstoneData.forEach((element, index) => {

        this.tagstoneData[index]['lwt'] = this.tagstoneData[index]['is_apply_in_lwt'] == 1 ? true : false;
        let tr: any[] = this.stones.filter(data => data['stone_id'] == element['stone_id']);

        this.tagstoneData[index]['stone_name'] = tr.length > 0 ? tr[0]['stone_name'] : [];
      });

    }
    else if (this.navParams.get('stone_details').length > 0 && this.ptype != 'tag') {
      this.stoneData = this.navParams.get('stone_details');
      this.get_total()
      this.uomchange()
      this.stoneData.forEach((element, index) => {
        console.log(element['stone_id'])
        this.stoneData[index]['lwt'] = this.stoneData[index]['is_apply_in_lwt'] == 1 ? true : false;
        let tr: any[] = this.stones.filter(data => data['stone_id'] == element['stone_id']);

        this.stoneData[index]['stone_name'] = tr.length > 0 ? tr[0]['stone_name'] : [];
      });
    }

    this.action = this.navParams.get('action');

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  updateStone(submitType) {
    if (this.ptype == 'tag') {
      this.viewCtrl.dismiss(this.tagstoneData);
    }
    else {
      this.viewCtrl.dismiss(this.stoneData);

    }

    // Alert Message Timeout
    setTimeout(() => {
      this.errorMsg = "";
    }, this.common.msgTimeout);
  }

  addStone(submitType) {

    console.log(this.stoneData)
    console.log(this.gross)

    if (this.ptype != 'tag') {

      for (let index = 0; index < this.stoneData.length; index++) {

        console.log(this.stoneData[index]);

        // if (this.stoneData[index].stone_id > 0 && this.stoneData[index].stone_pcs > 0 && this.stoneData[index].stone_price > 0 && this.stoneData[index].stone_wt > 0) {

        let stData = this.calcStoneDetail();
        console.log(stData)

        // (this.stoneData[index]['uom_id'] == '6' ? Number(this.stoneData[index]['stone_wt']) / 5 : Number(this.stoneData[index]['stone_wt']))
        if (stData['comparestone_wt'] < this.gross) {

          if (this.stoneData.length - 1 == index) {

            if (this.ptype == 'tag') {
              this.viewCtrl.dismiss(this.tagstoneData);
            }
            else {
              console.log(this.stoneData);

              this.viewCtrl.dismiss(this.stoneData);

            }
          }
        } else {

          let ctrl = this.toast.create({
            message: "Please Enter Valid Stone Weight ",
            duration: this.common.toastTimeout,
            position: 'bottom'
          });
          ctrl.present();
          break;

        }

        // } else {

        //   let ctrl = this.toast.create({
        //     message: "* Fields are Mandatory",
        //     duration: this.common.toastTimeout,
        //     position: 'bottom'
        //   });
        //   ctrl.present();
        //   break;

        // }

      }

      // Alert Message Timeout
      setTimeout(() => {
        this.errorMsg = "";
      }, this.common.msgTimeout);
    }


    if (this.ptype == 'tag') {

      for (let index = 0; index < this.tagstoneData.length; index++) {

        console.log(this.tagstoneData[index]);

        // if (this.tagstoneData[index].stone_id > 0 && this.tagstoneData[index].pieces > 0 && this.tagstoneData[index].amount > 0 && this.tagstoneData[index].wt > 0) {
        let stData = this.calcStoneDetail();
        console.log(stData)
        if (stData['comparestone_wt'] < this.gross) {
          if (this.tagstoneData.length - 1 == index) {

            if (this.ptype == 'tag') {
              this.viewCtrl.dismiss(this.tagstoneData);
            }
            else {
              this.viewCtrl.dismiss(this.stoneData);

            }
          }
        } else {

          let ctrl = this.toast.create({
            message: "Please Enter Valid Stone Weight ",
            duration: this.common.toastTimeout,
            position: 'bottom'
          });
          ctrl.present();
          break;
        }
        // }
        // else {

        //   let ctrl = this.toast.create({
        //     message: "* Fields are Mandatory",
        //     duration: this.common.toastTimeout,
        //     position: 'bottom'
        //   });
        //   ctrl.present();
        //   break;

        // }
      }

      // Alert Message Timeout
      setTimeout(() => {
        this.errorMsg = "";
      }, this.common.msgTimeout);
    }
  }

  stoneChanged() {
    // this.stoneData['rate'] = 0;
    // this.stoneData['stone_price'] = 0;
    // if(this.stoneData['stone_id'] > 0){
    //   let filterData =  this.stones.filter((s: any) => s.stone_id == this.stoneData['stone_id']);
    //   this.stoneSelected = filterData[0];
    //   this.stoneData['rate'] = parseFloat(this.stoneSelected['rate_type']) == 1 ? parseFloat(this.stoneSelected['fixed_rate']) : "";
    //   this.fixed_rate_type = parseFloat(this.stoneSelected['fixed_rate_type']) == 1 ? "Per Gram" : (parseFloat(this.stoneSelected['fixed_rate_type']) == 2 ? "Per Piece" : "" );
    // }
  }

  calcStoneValue() {
    // let stn_price:any = 0; 
    // if(this.stoneData['stone_id'] > 0 && this.stoneData['stone_pcs'] > 0 && this.stoneData['stone_wt'] > 0 && this.stoneData['stone_price'] > 0  ){
    //   this.proceedSave = true; 
    // }else{
    //   this.proceedSave = false;
    // }
    // if(this.stoneData['stone_id'] > 0 && this.stoneData['stone_pcs'] > 0 && this.stoneData['stone_wt'] > 0 && this.stoneData['stone_price'] > 0){
    // let rate_type = parseFloat(this.stoneSelected['rate_type']);
    // let fixed_rate_type = parseFloat(this.stoneSelected['fixed_rate_type']);
    // Rate Type => 1-Fixed, 2 - Rate From Master, 3 - Manual
    // if(rate_type == 1 || rate_type == 3)	
    // {
    //   if(fixed_rate_type == 1) //Fixed Rate Type => 1-Per Gram,2-Per Piece
    //   {
    //     stn_price = this.stoneData['rate']*parseFloat(this.stoneData['stone_wt']); 
    //   }
    //   else{
    //     stn_price = this.stoneData['rate']*parseFloat(this.stoneData['stone_pcs']); 
    //   }
    // }
    // else if(rate_type == 2)
    // {
    //   console.log(this.stoneData['rate_details']);
    //   this.stoneData['rate_details'].forEach( rate => {
    //     if(rate.cent_from <= this.stoneData['stone_wt'] && this.stoneData['stone_wt'] <= rate.cent_to)
    //     {
    //       this.stoneData['rate'] = rate.rate;
    //       stn_price = parseFloat(rate.rate)*parseFloat(this.stoneData['stone_wt']);
    //     }
    //   })
    // }
    // }
    // this.stoneData['stone_price'] = parseFloat(stn_price) + parseFloat(this.stoneData['certif_charge']);
  }
  add() {

    if (this.ptype == 'tag') {
      this.tagstoneData.push({
        amount: '',
        is_apply_in_lwt: 0,
        pieces: '',
        rate_per_gram: '',
        stone_cal_type: 0,
        stone_id: 0,
        stone_type: 0,
        tag_id: 0,
        uom_id: 0,
        wt: '',
        lwt: false
      })
    }
    else {
      this.stoneData.push({ "is_apply_in_lwt": 0, "lwt": false, "stone_id": 0, "stone_pcs": '', "stone_wt": '', "stone_price": '' });
    }
  }
  remove(i) {
    this.totalvalue = 0;
    this.totalgram = 0;
    this.totalct = 0;

    if (this.ptype == 'tag') {

      if (this.tagstoneData.length > 1) {
        this.tagstoneData.splice(i, 1);
      }
      else if (this.tagstoneData.length == 1) {
        this.tagstoneData.splice(i, 1);

        this.tagstoneData.push({
          amount: '',
          is_apply_in_lwt: 0,
          pieces: '',
          rate_per_gram: '',
          stone_cal_type: 0,
          stone_id: 0,
          stone_type: 0,
          tag_id: 0,
          uom_id: 0,
          wt: '',
          lwt: false
        });

      }


      for (let index = 0; index < this.tagstoneData.length; index++) {
        this.totalvalue += parseFloat(this.tagstoneData[index].amount)

        if (this.tagstoneData[index]['uom_id'] == 1) {
          // this.totalgram += parseFloat(this.tagstoneData[index]['wt'] )
          let data: any = Number(this.totalgram) + Number(this.tagstoneData[index]['wt'])
          this.totalgram = data.toFixed(3)
        } else if (this.tagstoneData[index]['uom_id'] == 6) {
          // this.totalct += parseFloat(this.tagstoneData[index]['wt'] )
          let data: any = Number(this.totalct) + Number(this.tagstoneData[index]['wt'])
          this.totalct = data.toFixed(3)
        }
      }
      //   this.totalvalue = 0;
      //   for (let index = 0; index <this.tagstoneData.length; index++) {
      //     this.totalvalue += parseFloat(this.tagstoneData[index].amount)
      //  }
    }
    else {
      if (this.stoneData.length > 1) {
        this.stoneData.splice(i, 1);
        console.log(this.stoneData);

      }
      else if (this.stoneData.length == 1) {
        this.stoneData.splice(i, 1);

        this.stoneData.push({ "is_apply_in_lwt": 0, "lwt": false, "stone_id": 0, "stone_pcs": '', "stone_wt": '', "stone_price": '' });

      }
      for (let index = 0; index < this.stoneData.length; index++) {
        this.totalvalue += parseFloat(this.stoneData[index].stone_price)

        if (this.stoneData[index]['uom_id'] == 1) {
          // this.totalgram += parseFloat(this.stoneData[index]['stone_wt'] )
          let data: any = Number(this.totalgram) + Number(this.stoneData[index]['stone_wt'])
          this.totalgram = data.toFixed(3)
        } else if (this.stoneData[index]['uom_id'] == 6) {
          // this.totalct += parseFloat(this.stoneData[index]['stone_wt'] )
          let data: any = Number(this.totalct) + Number(this.stoneData[index]['stone_wt'])
          this.totalct = data.toFixed(3)
        }
      }
      //  this.totalvalue = 0;
      //     for (let index = 0; index <this.stoneData.length; index++) {
      //       this.totalvalue += parseFloat(this.stoneData[index].stone_price);
      //    }
    }
  }
  checkt(index) {

    this.tagstoneData[index]['is_apply_in_lwt'] = this.tagstoneData[index]['lwt'] == true ? 1 : 0;
  }
  checko(index) {

    this.stoneData[index]['is_apply_in_lwt'] = this.stoneData[index]['lwt'] == true ? 1 : 0;
  }
  tot(i) {

    this.tagstoneData[i]['amount'] = this.tagstoneData[i]['amount'] * this.tagstoneData[i]['wt'];

  }

  calcStoneDetail() {
    if (this.ptype == 'tag') {

      let data = { "wt": 0, "amount": 0, "comparestone_wt": 0 };
      this.tagstoneData.forEach((i, index) => {
        if (this.tagstoneData[index]['lwt']) {
          this.tagstoneData[index]['is_apply_in_lwt'] = 1;
        } else {
          this.tagstoneData[index]['is_apply_in_lwt'] = 0;
        }
        data['wt'] = data['wt'] + Number(i['wt']);
        data['comparestone_wt'] = data['comparestone_wt'] + (i['uom_id'] == '6' ? Number(i['wt']) / 5 : Number(i['wt']));

        data['amount'] = data['amount'] + Number(i['amount']);
      })
      return data;
    }
    else {
      let data = { "stone_wt": 0, "stone_price": 0, "comparestone_wt": 0 };
      this.stoneData.forEach((i, index) => {
        if (this.stoneData[index]['lwt']) {
          this.stoneData[index]['is_apply_in_lwt'] = 1;

        }
        else {
          this.stoneData[index]['is_apply_in_lwt'] = 0;
        }
        data['stone_wt'] = data['stone_wt'] + Number(i['stone_wt']);

        data['stone_price'] = data['stone_price'] + Number(i['stone_price']);
        console.log(data['comparestone_wt'])

        data['comparestone_wt'] = data['comparestone_wt'] + (i['uom_id'] == '6' ? Number(i['stone_wt']) / 5 : Number(i['stone_wt']));
        console.log(data['comparestone_wt'])
      })
      return data;
    }
  }

  ionViewWillLeave() {
    this.events.publish('entered', false);

  }
  ionViewWillEnter() {

    this.events.publish('entered', true);
    this.events.publish('pageno', 1);

  }

  ctypecheck(i) {

    console.log(this.tagstoneData[i]['stone_cal_type'])
    if (this.tagstoneData[i]['stone_cal_type'] == '2') {
      this.tagstoneData[i]['amount'] = this.tagstoneData[i]['pieces'] * this.tagstoneData[i]['rate_per_gram'];
    }
    else if (this.tagstoneData[i]['stone_cal_type'] == '1') {
      this.tagstoneData[i]['amount'] = this.tagstoneData[i]['wt'] * this.tagstoneData[i]['rate_per_gram'];

    }
  }
  ctypecheck2(i, type) {


    if (this.stoneData[i]['stone_cal_type'] == '2') {
      this.stoneData[i]['stone_price'] = this.stoneData[i]['stone_pcs'] * this.stoneData[i]['rate'];
    }
    else if (this.stoneData[i]['stone_cal_type'] == '1') {
      this.stoneData[i]['stone_price'] = this.stoneData[i]['stone_wt'] * this.stoneData[i]['rate'];
      console.log(this.stoneData[i]['stone_price']);
    }
    if (type == 'rate') {
      this.get_total()
    }


  }

  openstoneModal(i) {
    let modal = this.modal.create(StonesearchPage, { "empData": this.stones })
    modal.present();
    modal.onDidDismiss(data => {
      if (data != null) {
        this.tagstoneData[i]['stone_id'] = data.stone_id;
        this.tagstoneData[i]['stone_name'] = data.stone_name;

      }
    });
  }

  openstoneModal2(i) {
    let modal = this.modal.create(StonesearchPage, { empData: this.stones });
    modal.present();
    modal.onDidDismiss((data) => {
      if (data != null) {
        this.stoneData[i]["stone_id"] = data.stone_id;
        this.stoneData[i]["stone_name"] = data.stone_name;
      }
    });
  }
  public onKeyUp(event: any) {

  }

  get_total() {
    // console.log(this.stoneData[i]['stone_price']);
    console.log(this.stoneData);
    let data = this.stoneData
    console.log(data);
    console.log(this.tagstoneData,'ppppppppppp');
    console.log(this.stoneData,'ooooooooooo');

    this.totalvalue = 0;
    // if (this.stoneData[i]['stone_price'] != isNaN && this.stoneData[i]['stone_price'] != '') {
    if (this.ptype == 'tag') {
      for (let index = 0; index < this.tagstoneData.length; index++) {
        console.log(this.tagstoneData[index].amount);
        this.totalvalue += parseFloat(this.tagstoneData[index]['amount']);
        if(this.tagstoneData[index]['stone_type'] == 1){ 
          this.gtype =[]
          this.gtype.push(this.gtype_filter[0])  
       }else{
          this.uomtype = [];
          this.uomtype.push(this.gtype_filter[1]) 
    
    }
      }
    } else {
      for (let index = 0; index < data.length; index++) {
        console.log(data[index].stone_price);
        this.totalvalue += parseFloat(data[index].stone_price);
        console.log(this.totalvalue);
        if(data[index]['stone_type'] == 1){ 
          this.gtype =[]
          this.gtype.push(this.gtype_filter[0])
          console.log( this.gtype,'pp');
            
       }else{
          this.uomtype = [];
          this.uomtype.push(this.gtype_filter[1]) 
    
    }
      }
    }

    // }
  }

  uomchange() {
    this.totalgram = 0;
    this.totalct = 0;
    if (this.ptype == "tag") {
      for (let index = 0; index < this.tagstoneData.length; index++) {

        if (this.tagstoneData[index]['uom_id'] == 1) {
          let data: any = Number(this.totalgram) + Number(this.tagstoneData[index]['wt'])
          this.totalgram = data.toFixed(3)
          console.log(this.totalgram, 'gram');
          // this.totalgram += parseFloat(this.tagstoneData[index]['wt'] )
          // console.log( this.totalgram);

        } else if (this.tagstoneData[index]['uom_id'] == 6) {
          let data: any = Number(this.totalct) + Number(this.tagstoneData[index]['wt'])
          this.totalct = data.toFixed(3)
          console.log(this.totalct, 'cart');
          // this.totalct += parseFloat(this.tagstoneData[index]['wt'] )
        }
      }
    } else {
      for (let index = 0; index < this.stoneData.length; index++) {

        if (this.stoneData[index]['uom_id'] == 1) {
          let data: any = Number(this.totalgram) + Number(this.stoneData[index]['stone_wt'])
          this.totalgram = data.toFixed(3)
          console.log(this.totalgram, 'gram');


        } else if (this.stoneData[index]['uom_id'] == 6) {
          let data: any = Number(this.totalct) + Number(this.stoneData[index]['stone_wt'])
          this.totalct = data.toFixed(3)
          console.log(this.totalct, 'cart');
          // this.totalct += parseFloat(this.stoneData[index]['stone_wt'] )
        }
      }

    }
  }

  
  typechange(i) {
    if (this.ptype == "tag"){
      console.log(this.tagstoneData[i]['stone_type']);
      this.stones = this.stoneMasData;
      let typestone: any[] = this.stones.filter(data => data['stone_type'] == this.tagstoneData[i]['stone_type'])
      this.stones = typestone;
      console.log(this.stones);
      this.get_type(i)

    }else{
      console.log(this.stoneData[i]['stone_type']);
      this.stones = this.stoneMasData;
      let typestone: any[] = this.stones.filter(data => data['stone_type'] == this.stoneData[i]['stone_type'])
      this.stones = typestone;
      console.log(this.stones);
      this.get_type(i)
    }
  
    
  }

  get_type(i){
    for (let index=0;index < this.gtype_filter.length ; index++) {
      if(this.stoneData[i]['stone_type'] == 1){ 
        this.gtype =[]
        this.gtype.push(this.gtype_filter[0])  
      }else{
        this.uomtype = [];
        this.uomtype.push(this.gtype_filter[1]) 
    }
  }
  }


}
