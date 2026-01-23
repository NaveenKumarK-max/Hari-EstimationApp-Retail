import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events,  ViewController,ToastController ,LoadingController} from 'ionic-angular';

/**
 * Generated class for the IntroimgPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-introimg',
  templateUrl: 'introimg.html',
})
export class IntroimgPage {

  popupimage = this.navParams.get('image');
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
  console.log("000",this.navParams.get('image'));    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IntroimgPage');
  }
  close(){

    this.viewCtrl.dismiss();
    
  }
 

}
