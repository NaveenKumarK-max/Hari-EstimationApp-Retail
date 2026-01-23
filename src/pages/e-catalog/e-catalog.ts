import { Component, ViewChild } from '@angular/core';
import { Events,IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common';
import { RetailProvider } from '../../providers/retail'; 
import { FilterPage } from '../modal/filter/filter';
import { DesignDetailPage } from '../design-detail/design-detail';


@Component({
  selector: 'page-ecatalog',
  templateUrl: 'e-catalog.html',
  providers: [RetailProvider]
})
export class EcatalogPage { 
  designData: any[] = [];
  last_id: any = 0;
  empData = JSON.parse(localStorage.getItem('empDetail'));
  filters : any;
	filter_options  :any;
	filterargs  :any;

  constructor(private events: Events,public modal: ModalController, public navCtrl: NavController, public navParams: NavParams, public load: LoadingController, public retail: RetailProvider) {
    
  }

  ionViewDidLoad() {
    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();
    var postData = {
      'id_employee': this.empData['uid'] != null ? this.empData['uid'] : null,
      'type': 'active',
      'last_id': this.last_id
    }
    this.retail.getECatalog(postData).then(data => {
      this.designData = data;
      loader.dismiss();
    }) 
    // this.retail.getEcatalogFilters().then(result => {
    //   let res = result.responseData; 
    //   this.filters = res.filters;
    //   this.filter_options = res.filter_options;
    //   this.filterargs = res.filterargs; 
    //   let obj = {filters:res.filters,filter_options:res.filter_options,filterargs:res.filterargs};
    //   localStorage.setItem( 'resetFilterData',JSON.stringify( obj ) );
    //   this.openFilter();
    // }); 

  }

  doInfinite(infiniteScroll: any) {
    this.last_id = this.designData[this.designData.length - 1]['design_no'];
    console.log(this.last_id);
    var postData = {
      'id_employee': this.empData['uid'] != null ? this.empData['uid'] : null,
      'type': 'active',
      'last_id': this.last_id
    }
    this.retail.getECatalog(postData).then(data => {
      for (let index = 0; index < data.length; index++) {
        this.designData.push(data[index])
      }
      infiniteScroll.complete();
    })
  }

  openDesign(design_no){ 
    this.navCtrl.push(DesignDetailPage,{'design_no':design_no})  
  }

  openFilter(){
    let data = {'filters':this.filters,'filter_options':this.filter_options,'filterargs':this.filterargs};
    let modal = this.modal.create(FilterPage,data,{enableBackdropDismiss: false})
    modal.present();
    modal.onDidDismiss(data => {
      console.log(data);
      let loader = this.load.create({
        content: 'Please Wait',
        spinner: 'bubbles',
      });
      loader.present();
      var postData = {
        'id_employee': this.empData['uid'] != null ? this.empData['uid'] : null,
        'type': 'active',
        'last_id': this.last_id
      }
      this.retail.getECatalog(postData).then(data => {
        this.designData = data;
        loader.dismiss();
      })  
    })
  }
  ionViewWillLeave(){
    this.events.publish( 'entered', false );						
  
    }
  ionViewWillEnter(){
  
  this.events.publish( 'entered', true );						
  this.events.publish( 'pageno', 1 );	
  
  }

}
