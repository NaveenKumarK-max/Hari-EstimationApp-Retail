


import { Component } from '@angular/core';
import { NavController,ToastController,NavParams, Events,AlertController, LoadingController,ModalController,ViewController } from 'ionic-angular';

import { CommonProvider } from '../../providers/common';
import { Keyboard } from 'ionic-angular';
import { ProductdetailPage } from '../productdetail/productdetail';


import { Observable } from 'rxjs/Observable';
import { elementEventFullName } from '@angular/core/src/view';
import { ComparePage } from '../compare/compare';
import { NotifymodelPage } from '../notifymodel/notifymodel';

 
@Component({
  selector: 'page-mass2',
  templateUrl: 'mass2.html',
  providers:[CommonProvider]
})
export class Mass2Page {
 
  protected searchStr: string;
  protected captain: string;
  protected searchData: any[] = [];
public input: string = '';
public temp: any[] = [];
status: any = false;
subscription: any;
gif= false;
full = false;


  constructor(public viewCtrl:ViewController,public toast:ToastController,public modal:ModalController,private keyboard: Keyboard,public commonProvider: CommonProvider, private loadingCtrl: LoadingController, public navCtrl: NavController) {

  }
  goback(){

    this.navCtrl.pop();

  }
  
  selected(data){
    this.viewCtrl.dismiss(data);
  }
 

  removeFocus() {
    this.keyboard.close();
  };

  search() {


    if(this.input.length >=4){
    let loader = this.loadingCtrl.create( {
      content: "Please wait...",
      spinner: 'bubbles',

  } );
  loader.present();
  this.gif= true;

    this.commonProvider.getsubdesignsold({'searchTxt':this.input}).then(data  => {
      // this.searchData = data;
      this.gif= false;

      this.status = true;

      this.temp = data;
      console.log(data);
      
      loader.dismiss();
  },err=>{
    console.log(err)
    this.gif= false;

    // this.temp = err['products'];

    loader.dismiss();
  } );
}
else{
  this.temp = [];
  this.status = false;
  this.gif= false;


}

  }
  
  
 
}