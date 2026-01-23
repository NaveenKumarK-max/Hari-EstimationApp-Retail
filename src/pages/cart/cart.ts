import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, Events, Platform } from 'ionic-angular';
import { CommonProvider } from '../../providers/common';
import { RetailProvider } from '../../providers/retail';
import { CusSearchPage } from '../modal/customer/customer';
import { OrderStatusPage } from '../order-status/order-status';
import { HomePage } from '../home/home';


@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
  providers: [RetailProvider]
})
export class CartPage { 

  empData = JSON.parse(localStorage.getItem('empDetail')); 
  cusData = JSON.parse( localStorage.getItem( 'currentCustomer' ) );
  allowPlaceOrder = false;
  selectedItems = [];
 page = this.navParams.get('page')
  
  constructor(private platform: Platform,public modal: ModalController, public events: Events, public navCtrl: NavController, public navParams: NavParams, public load: LoadingController, public retail: RetailProvider, private common : CommonProvider) { 
  
     this.platform.registerBackButtonAction(() => {
      if (this.page == 'direct') {
      this.goHome()
    } else {
       this.navCtrl.pop();
      // maybe exit app or show alert
    }
  });
  
    events.subscribe('cartItems:selected', (items) => {
			if (items) {
        console.log(items)
        this.selectedItems = items;
        this.allowPlaceOrder = (this.selectedItems.length > 0) ? true : false;
			}  
		});
  }

  ionViewDidLoad() {
     
  } 

  createOrder(){
    // let currentCustomer = localStorage.getItem( 'currentCustomer' );
    // if ( currentCustomer != null ) {
    let ordertype;
      let loader = this.load.create({
        content: 'Please Wait',
        spinner: 'bubbles',
      });
      loader.present();
      let postData = {
                      "order" : 
                              {
                                "order_request_from"  : "cart",
                                "id_karigar"          : null,
                                "order_for"           : 2,
                                "order_to_br"         : null,
                                "order_to"            : this.cusData['id_customer'],
                                "order_from"          : this.empData['id_branch'],
                                "id_branch"           : this.empData['id_branch'],
                                "rate_calc_from"      : this.empData['rate_calc_from'], 
                                "id_employee"         : this.empData['uid'],
                                "order_type"           : ordertype = this.selectedItems.length != 0? this.selectedItems[0]["order_type"] : null,
                                'rate_type'           : ordertype = this.selectedItems.length != 0? this.selectedItems[0]["rate_type"] : null,

                              },
                      "o_item" : this.selectedItems
                    };
      this.retail.createOrder(postData).then(result => {

          if(result.status){
            this.events.publish('Order:created', true);
          } 
          this.common.presentToast( result.msg,'' );
          loader.dismiss();
      }, error => {

          loader.dismiss();
      });
    // }
    // else{
    //              this.openCusModal();

    // }
    this.navCtrl.push(OrderStatusPage,{'type':2})
    // this.navCtrl.push(OrderStatusPage)
  }

  openCusModal() {
    let modal = this.modal.create(CusSearchPage,{'first1':this.selectedItems[0]['customer_name']})
    modal.present();
    modal.onDidDismiss(mData => {
        if(mData != null){
            localStorage.setItem( 'currentCustomer', JSON.stringify( mData ) );
            this.cusData = JSON.parse( localStorage.getItem( 'currentCustomer' ) );
            this.createOrder();
          }
    });
} 
ionViewWillLeave(){
  this.events.publish( 'entered', false );						

  }
ionViewWillEnter(){

this.events.publish( 'entered', true );						
this.events.publish( 'pageno', 1 );	

}


goHome() {
  this.navCtrl.setRoot(HomePage);
}



}
