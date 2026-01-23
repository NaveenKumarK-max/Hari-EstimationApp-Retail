import { Component } from '@angular/core';
import { Events,IonicPage, NavParams, ViewController, LoadingController, ToastController } from 'ionic-angular';
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
  selector: 'page-charges',
  templateUrl: 'charges.html',
  providers: [CommonProvider, RetailProvider]

})
export class ChargesPage {

  stoneData: any = [{ "is_apply_in_lwt": 0, "lwt": false, "stone_id": 0, "stone_pcs": 0, "stone_wt": 0, "stone_price": 0 }];
  stoneSelected = { "rate_type": "1" };

  tagstoneData: any = [
    {
      charge_value: 0,
     id_charge:'',
     chargecode:'',
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

  constructor(private events: Events,public toast: ToastController, public load: LoadingController, public retail: RetailProvider, public common: CommonProvider, public viewCtrl: ViewController, public navParams: NavParams) {
    this.page = this.navParams.get('page');
    this.ptype = this.navParams.get('ptype');
    this.gross = this.navParams.get('gross');

    this.stoneMasData = this.navParams.get('stoneMasData');
    console.log(this.stoneMasData);
    console.log(this.navParams.get('stone_details'))
    
   
    
    this.action = this.navParams.get('action');

    this.common.getdivision().then(data=>{

        this.stones = data['charges'];
        if (this.navParams.get('stone_details').length > 0) {
      this.tagstoneData = this.navParams.get('stone_details');
      

    }
      });

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  updateStone(submitType) {

      this.viewCtrl.dismiss(this.tagstoneData);
    
    // Alert Message Timeout
    setTimeout(() => {
      this.errorMsg = "";
    }, this.common.msgTimeout);
  }

  addStone(submitType) {

    console.log(this.tagstoneData)


    for (let index = 0; index < this.tagstoneData.length; index++) {

      console.log(this.tagstoneData[index]);

      if ((this.tagstoneData[index].id_charge > 0 || this.tagstoneData[index].id_charge == '') && this.tagstoneData[index]['charge_value'] >= 0){
        
        if (this.tagstoneData.length - 1 == index) {

            this.viewCtrl.dismiss(this.tagstoneData);
          
        }
         
    }
    else {

      let ctrl = this.toast.create({
        message: "* Fields are Mandatory",
        duration: this.common.toastTimeout,
        position: 'bottom'
      });
      ctrl.present();
      break;

    }
    }

    // Alert Message Timeout
    setTimeout(() => {
      this.errorMsg = "";
    }, this.common.msgTimeout);
  
  }

  
  add() {

      this.tagstoneData.push({
        charge_value: 0,
     id_charge:'',
     chargecode:'',
      })
    
    
  }
  remove(i) {


      if (this.tagstoneData.length > 1) {
        this.tagstoneData.splice(i, 1);
      }
      else if (this.tagstoneData.length == 1) {
        this.tagstoneData.splice(i, 1);

        this.tagstoneData.push({
     charge_value: 0,
     id_charge:'',
     chargecode:'',
        });

      }

   
  }
  


  ionViewWillLeave(){
    this.events.publish( 'entered', false );						
  
    }
  ionViewWillEnter(){
  
  this.events.publish( 'entered', true );						
  this.events.publish( 'pageno', 1 );	
  
  }
 checkcode(i){

    let temp:any[] = this.stones.filter(data=>data['id_charge'] == this.tagstoneData[i]['id_charge']);
    this.tagstoneData[i]['chargecode'] = temp[0]['code_charge'];
    this.tagstoneData[i]['charge_value'] = temp[0]['value_charge'];
	    this.tagstoneData[i]['id_charge'] = temp[0]['id_charge'];
			


  }
}
