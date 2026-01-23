import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController,Events } from 'ionic-angular';
import { CommonProvider } from '../../providers/common';
import { RetailProvider } from '../../providers/retail';
import { AvrsearchPage } from '../avrsearch/avrsearch';
import { ProductsPage } from '../products/products';
import { CartPage } from '../cart/cart';
import { CusSearchPage } from '../modal/customer/customer';
import { AutoPage } from '../auto/auto';
import { WishlistPage } from '../wishlist/wishlist';

@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
  providers: [RetailProvider]
})
export class CategoryPage {
  categories: any[] = [];
  last_id: any = 0;
  empData = JSON.parse(localStorage.getItem('empDetail'));
  pagename = this.navParams.get('pagename');
  // {'metal':'gold','image':'','name':'gold'}
  page_no: any = 1;
  totalcartitems = localStorage.getItem('carts') != null ? JSON.parse(localStorage.getItem('carts'))['items'] : [];
  supplier = this.navParams.get('supplier');

  constructor(public events:Events,public navCtrl: NavController, public navParams: NavParams, public load: LoadingController, public retailService: RetailProvider) {

    console.log(this.empData);
    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();
    var postData = {
      'id_employee': this.empData != null ? this.empData['uid'] : null,
      'type': 'active',
      'last_id': this.last_id,
      'status':this.pagename,
      'page_no':this.page_no,
      'supplier':this.supplier

    }
    this.retailService.getCategories(postData).then(data => {
      this.categories = data;
      console.log(this.categories);
      loader.dismiss();
    },err=>{
      loader.dismiss();
    })


  }

  doInfinite(infiniteScroll: any) {
    this.page_no = this.page_no + 1;

    console.log(this.categories)
    this.last_id = this.categories[this.categories.length - 1]['id_ret_category'];
    console.log(this.last_id);
    var postData = {
      'id_employee': this.empData['uid'] != null ? this.empData['uid'] : null,
      'type': 'active',
      'last_id': this.last_id,
      'status':this.pagename,
      'page_no':this.page_no,
      'supplier':this.supplier

    }
    this.retailService.getCategories(postData).then(data => {
      console.log(data)
      for (let index = 0; index < data.length; index++) {
        this.categories.push(data[index])
      }
      infiniteScroll.complete();
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryPage');
  }

  openProduct(id_ret_category){
    console.log(id_ret_category);
    console.log(this.categories);
    this.navCtrl.push(ProductsPage,{'id_category':id_ret_category,'data':this.categories,'pagename':this.pagename,'supplier':this.supplier})

  }
  open(){
    this.navCtrl.push( AvrsearchPage );

  }
  ionViewWillLeave(){
		this.events.publish( 'entered', false );

	  }
  ionViewWillEnter(){

	this.events.publish( 'entered', true );
	this.events.publish( 'pageno', this.supplier == true ? 4 : 2 );


  }
  cart(){
    this.navCtrl.push(CartPage);

    }
    openModal() {
      this.navCtrl.push(AutoPage);
    }
    addWishlist(){

      this.navCtrl.push(WishlistPage)
    }
}
