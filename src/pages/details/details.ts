import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,LoadingController} from 'ionic-angular';
import { RetailProvider } from '../../providers/retail';
import { CommonProvider } from '../../providers/common';

/**
 * Generated class for the DetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
  providers: [RetailProvider,CommonProvider]

})
export class DetailsPage {

  details:any = '';
  id:any = this.navParams.get('id');

  constructor(public load:LoadingController,public retail:RetailProvider,public navCtrl: NavController, public navParams: NavParams) {
  
    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();

  
    this.retail.getdetails({'id_customer' : this.id}).then(data => {

      this.details = data;
      console.log(data);
      loader.dismiss();

    },err=>{
      loader.dismiss();

    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailsPage');
  }

}
