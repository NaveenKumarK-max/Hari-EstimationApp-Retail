import { Component } from '@angular/core';
import { Events,IonicPage, NavController, NavParams,LoadingController,ToastController,ModalController } from 'ionic-angular';
import { RetailProvider } from '../../providers/retail';
import { CommonProvider } from '../../providers/common';
import { MasSearchPage } from '../modal/mas-search/mas-search';
import { SubdesignimgPage } from '../../pages/subdesignimg/subdesignimg';
import { DesignimgPage } from '../designimg/designimg';

/**
 * Generated class for the SubdesignlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-designlist',
  templateUrl: 'designlist.html',
  providers: [CommonProvider,RetailProvider]

})
export class DesignlistPage {

  hbProducts = [];
  hbDesigns = [];
  searchhbDesigns = [];
  hbsubDesigns = [];
  searchhbsubDesigns = [];
  input = '';
  hbData = {};
  show = false;

  constructor(private events: Events,public load:LoadingController,public toast:ToastController,public modal:ModalController,public comman:CommonProvider,public retail:RetailProvider,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubdesignlistPage');
  }
  ionViewWillEnter(){

    if(this.hbData.hasOwnProperty('pro_id')){

      this.hbProdSelected();
    }
    this.events.publish( 'entered', true );						
    this.events.publish( 'pageno', 1 );	
  }
  ionViewWillLeave(){
    this.events.publish( 'entered', false );						
  
    }
  
  openMasSearch(master){
    
    console.log(master)
        if(this.hbProducts.length == 0) {
          let loader = this.load.create({
            content: 'Please Wait',
            spinner: 'bubbles',
          });
          loader.present();
          this.retail.getProducts({"type":"active", "id_category":"", "last_id":-1}).then(data=>{
            this.hbProducts = data;
            loader.dismiss();
            this.openMasModal({'searchArr' : this.hbProducts, page : master, listType : "normal"}, master);
          })
        }
    else if(master == 'Design'){ 
      if(this.hbData['pro_id']){
         this.openMasModal({'searchArr' : this.hbDesigns, page : master, listType : "normal"}, master);
      }
    } 
    else{
      this.openMasModal({'searchArr' : this.hbProducts, page : master, listType : "normal"}, master);
    } 
  }
  openMasModal(data,master){ 
    let modal = this.modal.create(MasSearchPage,data)
    modal.present();
    modal.onDidDismiss(data => {
      if(data != null){ 
        if(master == 'Design'){
          this.hbData['id_design'] = data.id_design;
          this.hbData['design_name'] = data.label;
          this.hbdesignSelected()
          this.show = true;
        }
       
        else if(master == 'Product'){ 
         
            this.hbData['pro_id'] = data.pro_id;
            this.hbData['tax_group_id'] = data.tax_group_id;
            this.hbData['tax_percentage'] = data.tax_percentage;
            this.hbData['calculation_based_on'] = data.calculation_based_on;
            this.hbData['metal_type'] = data.metal_type;
            this.hbData['product_name'] = (data.parent_prods_name != null ? data.parent_prods_name+','+data.label : data.label);
            this.hbProdSelected();
                  
        }
             
      }
    });
  }
  hbProdSelected(){ 
    // if(this.hbDesigns.length == 0) {
      let loader = this.load.create({
        content: 'Please Wait',
        spinner: 'bubbles',
      });
      loader.present();
      this.retail.getDesigns({"type":"active", "id_product":this.hbData['pro_id'], "last_id":-1}).then(data=>{
        this.hbDesigns = data;
        this.searchhbDesigns = data;
        this.show = true;

        loader.dismiss();
      })
    // }  
   
  }
  hbdesignSelected(){ 
    // if(this.hbDesigns.length == 0) {
      let loader = this.load.create({
        content: 'Please Wait',
        spinner: 'bubbles',
      });
      loader.present();
      this.comman.getsubdesigns({"id_product":this.hbData['pro_id'], "design_no":this.hbData['id_design']}).then(data=>{
        this.hbsubDesigns = data;
        this.searchhbsubDesigns = data;

        loader.dismiss();
      })
    // }  
    
  }
  editdesign(data){

    this.hbData['id_design'] = data.id_design;

    this.navCtrl.push(DesignimgPage,{'data':data})
  }
  search() {

    
    
    this.hbDesigns = this.searchhbDesigns.filter(item => item['label'].toUpperCase().includes(this.input.toUpperCase()));
  }
}
