import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, ViewController, LoadingController, ModalController, IonicApp, ToastController } from 'ionic-angular';
import { CommonProvider } from '../../../providers/common';
import { CusupdatePage } from '../../cusupdate/cusupdate';
import { DetailsPage } from '../../details/details';
import { AddQuickCus } from '../add-quick-cus/add-quick-cus';
import { OrderStatusPage } from '../../order-status/order-status';

/**
 * Generated class for the CusSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-customer',
  templateUrl: 'customer.html',
  providers: [CommonProvider]

})
export class CusSearchPage {

  customers: any[] = [];
  toggle: any = true;
  txt: any = '';

  constructor(private events: Events, public toast: ToastController, public ionicApp: IonicApp, public modal: ModalController, public load: LoadingController, public common: CommonProvider, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {

    this.txt = this.navParams.get('first1')
   // this.getCus()
    console.log(this.txt, 'uuuuuuuuu');

    // console.log(this.navParams.get('first'));
    // if(this.navParams.get('first') != undefined && this.navParams.get('first') != ''){

    //   this.txt = this.navParams.get('first')
    // }
  }

  selected(data) {
    console.log('ooooooo');
    // this.navCtrl.push(OrderStatusPage)

    this.viewCtrl.dismiss(data);

  }

  getCus() {
    const val = this.txt;
    if (val && val.trim() != '' && val.length >= 3) {
      let loader = this.load.create({
        content: 'Please Wait',
        spinner: 'bubbles',
      });
      loader.present();

      this.common.getCustBySearch({ "searchTxt": val }).then(data => {
        this.customers = data;
        loader.dismiss();
        console.log(this.customers);
        if (this.customers.length == 0) {
          this.navCtrl.push(AddQuickCus)

        }

      })
      console.log(this.customers, 'ooooooooooo');

    }
    else {
      let toast = this.toast.create({
        message: 'Please Enter Minimum 3 Digits',
        position: 'bottom',

        duration: 1000
      });
      toast.present();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CusSearchPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  openQuickCus() {
    let modal = this.modal.create(AddQuickCus)
    modal.present();
    modal.onDidDismiss(data => {
      console.log(data)
      if (data != null && data != undefined) {
        this.viewCtrl.dismiss(data);
      }
    });
  }
  edit(data) {

    this.navCtrl.push(CusupdatePage, { 'id': data })
  }
  eye(data) {

    this.navCtrl.push(DetailsPage, { 'id': data })
  }
  ionViewWillLeave() {
    this.events.publish('entered', false);

  }
  ionViewWillEnter() {

    this.events.publish('entered', true);
    this.events.publish('pageno', 1);

  }

  texto(event) {
    if (event.keyCode == 13) {
      this.getCus();
    }
console.log(this.txt.length,'length');

    if(this.txt.lenght != 10){
      this.customers = [];
    }
    console.log(event)
  }
}
