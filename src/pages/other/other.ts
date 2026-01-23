import { Component } from '@angular/core';
import { Events, IonicPage, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common';
import { RetailProvider } from '../../providers/retail';
import { filter } from 'rxjs/operators';

/**
 * Generated class for the AddStoneDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-other',
  templateUrl: 'other.html',
  providers: [CommonProvider, RetailProvider]

})
export class OtherPage {

  stoneData: any[] = [];
  stoneSelected = { "rate_type": "1" };
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
  totalGwt: number = 0;
  totalAmount: number = 0;

  constructor(private events: Events, public load: LoadingController, public retail: RetailProvider, public common: CommonProvider, public viewCtrl: ViewController, public navParams: NavParams) {
    this.page = this.navParams.get('page');
    this.stoneMasData = this.navParams.get('stoneMasData');
    console.log(this.navParams.get('other_metal'))


    //  this.action = this.navParams.get('action');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  updateStone(submitType) {
    this.viewCtrl.dismiss(this.stoneData);
    // Alert Message Timeout
    setTimeout(() => {
      this.errorMsg = "";
    }, this.common.msgTimeout);
  }

  addStone(submitType) {
    console.log(this.stoneData)
    this.viewCtrl.dismiss(this.stoneData);
    // Alert Message Timeout
    setTimeout(() => {
      this.errorMsg = "";
    }, this.common.msgTimeout);
  }

  stoneChanged() {
  }

  calcStoneValue() {
  }
  add() {
    this.stoneData.push({ "metal_id": 0, "stone_pcs": 0, "stone_wt": 0, "price": 0 });

  }
  remove(i) {

    if (this.stoneData.length > 1) {
      this.stoneData.splice(i, 1);
    }
    else if (this.stoneData.length == 1) {
      this.stoneData.splice(i, 1);

      this.stoneData.push({ "metal_id": 0, "stone_pcs": 0, "stone_wt": 0, "price": 0 });

    }
  }
  calp(i, j) {
    console.log(i);
    console.log(j);
    this.stoneData[i]['price'] = this.stones.filter(data => data['metal_id'] == j)[0]['price'];

  }
  ionViewWillLeave() {
    this.events.publish('entered', false);

  }
  ionViewWillEnter() {

    this.events.publish('entered', true);
    this.events.publish('pageno', 1);


    if (this.navParams.get('other_metal').length > 0) {
      this.stoneData = this.navParams.get('other_metal');
      for (let i = 0; i < this.stoneData.length; i++) {
        this.totalGwt += parseFloat(this.stoneData[i]['tag_other_itm_grs_weight']);
        this.totalAmount += parseFloat(this.stoneData[i]['tag_other_itm_act_amount']);
        console.log(this.totalGwt);
        console.log(this.totalAmount);
      }
    }

  }
}
