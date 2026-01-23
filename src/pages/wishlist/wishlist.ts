// import { Component, ViewChild } from '@angular/core';
// import { IonicPage, NavController, NavParams, LoadingController, ModalController, Events } from 'ionic-angular';
// import { CommonProvider } from '../../providers/common';
// import { RetailProvider } from '../../providers/retail';


// @Component({
//   selector: 'page-wishlist',
//   templateUrl: 'wishlist.html',
//   providers: [RetailProvider,CommonProvider]
// })
// export class WishlistPage {

//   empData = JSON.parse(localStorage.getItem('empDetail'));
//   cusData = JSON.parse( localStorage.getItem( 'currentCustomer' ) );
//   hideAddToCart = false;
//   proceedCart = false;
//   selectedItems = [];

//   constructor(public modal: ModalController, public events: Events, public navCtrl: NavController, public navParams: NavParams, public load: LoadingController, public retail: RetailProvider, private common : CommonProvider) {
//     events.subscribe('wishListItems:selected', (items) => {
// 			if (items) {
//         this.selectedItems = items;
//         this.proceedCart = (this.selectedItems.length > 0) ? true : false;
// 			}
// 		});
//   }

//   ionViewDidLoad() {

//   }

//   proceedToCart(){
//     let currentCustomer = localStorage.getItem( 'currentCustomer' );
//     if ( currentCustomer != null ) {
//       let loader = this.load.create({
//         content: 'Please Wait',
//         spinner: 'bubbles',
//       });
//       loader.present();
//       let postData = {"id_branch" : this.empData['id_branch'], "id_employee" : this.empData['id_employee'], "id_customer" : this.cusData['id_customer'], "status" : 1, "items" : this.selectedItems};
//       this.retail.addToCart(postData).then(result => {
//           if(result.status){
//             this.common.presentToast( result.msg,'6000' );
//             this.events.publish('AddToCart:completed', true);
//           }else{
//             this.common.presentToast( result.msg,'' );
//           }
//           loader.dismiss();
//       }, error => {
//           loader.dismiss();
//       });
//     }
//     else{
//       alert("Invalid Customer Data");
//     }
//   }
//   ionViewWillLeave(){
//     this.events.publish( 'entered', false );

//     }
//   ionViewWillEnter(){

//   this.events.publish( 'entered', true );
//   this.events.publish( 'pageno', 1 );

//   }

// }
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Events, ModalController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common';
import { RetailProvider } from '../../providers/retail';
import { CusSearchPage } from '../modal/customer/customer';
import { ProdetailPage } from '../prodetail/prodetail';

/**
 * Generated class for the WishlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-wishlist',
  templateUrl: 'wishlist.html',
})
export class WishlistPage {

  data: any[] = [];
  name: any = '';
  wish: any[] = [];
  searchwish: any[] = [];



  constructor(public modal: ModalController, public events: Events, public comman: CommonProvider, public load: LoadingController, public toast: ToastController, public navCtrl: NavController, public navParams: NavParams) {

    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'dots',
    });
    loader.present();

    this.comman.getwish().then(data => {

      console.log(data);
      this.wish = data;
      this.searchwish = data;

      loader.dismiss();
    }, err => {
      loader.dismiss();

    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WishlistPage');
  }
  ionViewWillLeave() {
    this.events.publish('entered', false);

  }
  ionViewWillEnter() {

    this.events.publish('entered', true);
    this.events.publish('pageno', 1);

  }

  remove(i) {

    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'dots',
    });
    loader.present();

    this.comman.delwish(i['id_wishlist']).then(data => {
      let toast = this.toast.create({
        message: data['msg'],
        position: 'bottom',

        duration: 3000
      });
      toast.present();

      this.comman.getwish().then(data => {

        console.log(data);
        this.wish = data;
        loader.dismiss();
      })
    })

  }

  openDesign(data,i){

    console.log(data , i);
    let product_id = JSON.parse(localStorage.getItem('see'))[i];
    product_id['net_wt'] = data['NetWt'];
    product_id['gross_wt'] = data['GrossWt'];
    product_id['metal_type'] = data['rate_field'];
    product_id['market_metal_type'] = data['market_rate_field'];
    product_id['tax_group_id'] = data['tgrp_id'];
    product_id['id_tag_detail'] = data['tag_id']

    // if(this.from != undefined){
      // this.navCtrl.push( ProdetailPage, { proid: design_no } );
      if(product_id.hasOwnProperty('TagStone')){
        product_id['TagStoneDetails'] = data['TagStone'];
    }
    // localStorage.setItem('see',JSON.stringify(this.designs))
    console.log(JSON.parse(localStorage.getItem('see')))

    // product_id['arr'] = JSON.parse(localStorage.getItem('see'));

    // this.comman.setdata(this.designs);
    // product_id['arr'] = this.designs;
    // product_id['arr'].unshift(product_id);
    // product_id['purities'] = [{'purity':'90.00','id_purity':1},{'purity':'80.00','id_purity':2}];
    // product_id['weights'] = [{'weight_description':'70g' ,'id_weight':1}];
    // product_id['sizes'] = [{'value':'70','name':'inch' ,'id_size':1}];

    // product_id['weight'] = '';
    // product_id['pcs'] = '';
    // product_id['due_date'] = '';
    // product_id['id_weight'] = '';
    // product_id['id_purity'] = '';
    // product_id['min_weight'] = '';
    // product_id['max_weight'] = '';


    // product_id['id_size'] = '';
    // product_id['sample_details'] = '';
    this.events.publish('inf',product_id);
    console.log(product_id)

    this.navCtrl.push( ProdetailPage, { proid: product_id , single: []} );


    // }else{
    //   this.navCtrl.push(DesignDetailPage,{ 'id_category': this.id_ret_category,'id_product': this.id_product,'design_no':this.design,'id_sub_design':design_no.id_sub_design,'type':'edit'})

    // }
  }

  search() {



    // let modal = this.modal.create(CusSearchPage,{'show':'true'})
    // modal.present();
    // modal.onDidDismiss(mData => {
    //   console.log(mData)
    //   if(mData != null){
    //     this.wish = this.searchwish.filter(data=>data['customer_id'] == mData['id_customer']);
    //     this.name = mData['firstname'];

    //   }else{

    //   }
    // });
    this.wish = this.searchwish.filter(item => item['cus_name'].toUpperCase().includes(this.name.toUpperCase()));



  }

}
