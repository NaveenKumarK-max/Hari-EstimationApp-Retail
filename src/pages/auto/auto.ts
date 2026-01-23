


import { Component,Renderer } from '@angular/core';
import { NavController,ViewController,ToastController,NavParams, Events, AlertController, LoadingController ,ModalController} from 'ionic-angular';

import { HomePage } from '../../pages/home/home';
import { SubcategoryPage } from '../../pages/subcategory/subcategory';
// import { ProductDetailPage } from '../../pages/product-detail/product-detail';
import { CommonProvider } from '../../providers/common';
import { Keyboard } from 'ionic-angular';
import { RetailProvider } from '../../providers/retail';


import { CategoryProvider } from '../../providers/category-provider';
import { TagDetailsPage } from '../tag-details/tag-details';
import { ProdetailPage } from '../prodetail/prodetail';
import { CusSearchPage } from '../modal/customer/customer';


@Component({
  selector: 'page-auto',
  templateUrl: 'auto.html',
  providers:[RetailProvider]
})
export class AutoPage {

  protected searchStr: string;
  protected captain: string;
  protected searchData: any[] = [];
public input: string = '';
public temp: any[] = [];
status: any = false;

  constructor(public toast:ToastController,public retail:RetailProvider,public modal:ModalController,private events: Events,public renderer:Renderer,public viewCtrl:ViewController,private keyboard: Keyboard,public commonProvider: CommonProvider, private loadingCtrl: LoadingController, public navCtrl: NavController) {
 
  
  

  // // this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'mobilecontactsjoin', true);




  //   this.categoryProvider.readall().then(( data ) => {
  //     this.searchData = data;


  //     // this.dataService = completerService.local(this.searchData, 'name_design', 'name_design');

  //     console.log(data);

  //     this.commonProvider.search(

  //       {
  //         "UserId":"LOGIMAX",
  //             "Password":"123",
  //             "Branch":"",
  //             "Metal":"",
  //             "Product":0,
  //             "SubProduct":0,
  //             "TagNo":"",
  //             "FromWt":0,
  //             "ToWt":0,
  //             "FromPrice":0,
  //             "ToPrice":0
  //     }

  //     ).then(( data ) => {

  //       let productItems = data['ReturnObject'] != null ? data['ReturnObject'] : [];


  //       productItems.forEach(element => {

  //         element['name_design'] = element['ProductName'];
  //         this.searchData.push(element);
  //       });
  //       console.log(this.searchData)

  //       console.log(productItems)
  //       loader.dismiss();

  //     });
  // } );

  }
  goback(){

    this.navCtrl.pop();

  }

  onItemSelect(selected){
    console.log(selected);

    if(selected.hasOwnProperty('TagNo')){

      // this.navCtrl.push( TagDetailsPage, { 'filter': [selected] } );
      selected['net_wt'] = selected['NetWt'];
      selected['gross_wt'] = selected['GrossWt'];
      selected['metal_type'] = selected['rate_field'];
      selected['market_metal_type'] = selected['market_rate_field'];
      selected['tax_group_id'] = selected['tgrp_id'];

      if(selected.hasOwnProperty('TagStone')){
        selected['TagStoneDetails'] = selected['TagStone'];
    }
    selected['arr'] = this.temp;

    //this.navCtrl.push( ProdetailPage, { proid: selected } );
	 this.navCtrl.push( ProdetailPage, { proid: selected , single: [selected]} );

    }
    else{

      console.log(selected['id_design']);
      
      // this.navCtrl.push( ProdetailPage, { proid: '' , single: '' } );
    }


    // if(selected)
    //     this.model.searchStr = selected.originalObject.value;
    // }
  }


  removeFocus() {
    this.keyboard.close();
  };

  search() {


    let loader = this.loadingCtrl.create( {
          // content: "Please wait...",
          // spinner: 'hide',
          // content: `<img src="assets/loader.gif" height="80px" width="80px"/>`,
      } );
      loader.present();
    // this.categoryProvider.readall().then(( data ) => {
      // this.searchData = data;


      // this.dataService = completerService.local(this.searchData, 'name_design', 'name_design');

      // console.log(data);
   console.log(this.input);
   

      this.commonProvider.filter({ "TagNo":this.input}).then(( data ) => {

        this.temp = data['ReturnObject'] != null ? data['ReturnObject'] : [];


        // productItems.forEach(element => {

        //   element['name_design'] = element['ProductName'];
        //   this.searchData.push(element);
        // });
        // console.log(this.searchData)

        // console.log(productItems)
        loader.dismiss();
        this.status = true;

        if(this.temp.length == 1){
          console.log(this.temp);
          this.onItemSelect(this.temp[0]);
        }

      });
  // } );

  //   if (!this.input.trim().length || !this.keyboard.isOpen()) {
  //     console.log('11111111')
  //     this.temp = [];
  //     return;
  //   }
  //   console.log(this.searchData)

  //   this.temp = this.searchData.filter(item => !item.hasOwnProperty('TagNo') ? item['name_design'].toUpperCase().includes(this.input.toUpperCase()) : item['TagNo'].toUpperCase().includes(this.input.toUpperCase()));
  // }
    }
    ionViewWillLeave(){
      console.log('ooooooooooooo');
      this.events.publish( 'entered', false );

      }
    ionViewWillEnter(){
console.log('ssssssssssss');

    this.events.publish( 'entered', true );
    this.events.publish( 'pageno', 1 );
    this.temp = [];
    this.input = '';

    }

    texto(event){
      if(event.keyCode == 13){
        this.search();
      }
      console.log(event)
    }

    fixprice(data){

      let temp1:any = parseFloat(data).toFixed(3);

      return temp1;

    }


    addWishlist(item){


      let empData = JSON.parse(localStorage.getItem('empDetail'));

        let modal = this.modal.create(CusSearchPage,{'show':'true'})
        modal.present();
        modal.onDidDismiss(mData => {
          console.log(mData)
          if(mData != null){
            // this.idcus = mData['id_customer'];

            let loader = this.loadingCtrl.create({
              content: 'Please Wait',
              spinner: 'bubbles',
            });
            loader.present();

            this.retail.addToWishlist(
              {
                "customer_name" : mData['firstname'],
                "mobile"          : mData['mobile'],
                "customer_id"     : mData['id_customer'],
                "tag_id"          : item['id_tag_detail'],
                "tag_code"        : item['TagNo'],
                "branch_id"       : empData['id_branch'],
                "employee_id"     : empData['uid'],
                "id_sub_design"   : item['id_sub_design'],
                "product_id"      : item['product_id'],
                "design_id"         : item['design_id'],
            }).then(data=>{


              let toastMsg = this.toast.create({
                message: data.msg,
                duration: this.commonProvider.toastTimeout,
                position: 'middle'
              });
              toastMsg.present();

              loader.dismiss();

            },err=>{
              let toastMsg = this.toast.create({
                message: "try again",
                duration: this.commonProvider.toastTimeout,
                position: 'middle'
              });
              toastMsg.present();
              loader.dismiss();

            })
          }else{

          }
        });



    }
    price(data){

      let temp1:any = parseFloat(data).toFixed();

      return temp1;

    }
}
