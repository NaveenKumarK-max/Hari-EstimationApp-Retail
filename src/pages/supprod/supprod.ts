import { Component } from '@angular/core';
import { Events,IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';
import { RetailProvider } from '../../providers/retail';
import { AvrsearchPage } from '../avrsearch/avrsearch';
import { DesignsPage } from '../designs/designs';
import { ProductDetailPage } from '../product-detail/product-detail';
import { SubdesignPage } from '../subdesign/subdesign';


// @IonicPage()
@Component({
  selector: 'page-supprod',
  templateUrl: 'supprod.html',
  providers: [RetailProvider]
})
export class SupprodPage {
  empData = JSON.parse(localStorage.getItem('empDetail'));
  categoryitems = this.navParams.get('data');
  id_ret_category = this.navParams.get('id_category');
  products: any[] = [];
  last_id: any = 0;
  errormsg:any;
  pagename = this.navParams.get('pagename');

  constructor(private events: Events,public navCtrl: NavController,public load: LoadingController, public navParams: NavParams,public retailService: RetailProvider) {
   console.log(this.categoryitems);
    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();

    var postData = {
      'id_employee': this.empData['uid'] != null ? this.empData['uid'] : null,
      'type': 'active',
      'id_category': this.id_ret_category,
      'last_id': this.last_id,
      'status':this.pagename


    }
    this.retailService.getsupProducts(postData).then(data => {

      this.products = data;
      console.log(this.products);
      loader.dismiss();

    })


 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsPage');
  }
  doInfinite(infiniteScroll: any) {
    console.log(this.products)
    this.last_id = this.products[this.products.length - 1]['pro_id'];
    console.log(this.last_id);
    var postData = {
      'id_employee': this.empData['uid'] != null ? this.empData['uid'] : null,
      'type': 'active',
      'id_category': this.id_ret_category,
      'last_id': this.last_id,
      'status':this.pagename

    }
    this.retailService.getsupProducts(postData).then(data => {
      console.log(data)
      for (let index = 0; index < data.length; index++) {
        this.products.push(data[index])
      }
      infiniteScroll.complete();
    })
  }
  openDesign(pro_id){
    console.log(pro_id);
    console.log(this.products);
    // this.navCtrl.push(DesignsPage,{'id_product':pro_id,      'id_category': this.id_ret_category,
    // 'data':this.products,'pagename':this.pagename});
    var temp ={"Category": [
      {

        "category_code": this.id_ret_category,
      }
    ],
    "Product": [
      {
        "productcode": pro_id,
        "category_code": this.id_ret_category,
        'id_product':pro_id
      }],
      // "Design": [
      //   {
      //     "id_product": pro_id,
      //     "id_design": data.design_no,
      //     "design_code": data.design_code,
      //     "productcode": pro_id,
      //     "category_code": this.id_ret_category,
      //   }]
    }
  
  this.navCtrl.push(SubdesignPage,{'filter':temp});

  }
  ionViewWillEnter(){
    let user = true;
  //  this.events.publish('user:created', user);
  this.events.publish( 'entered', true );						
  this.events.publish( 'pageno', 1 );	
  }
  ionViewWillLeave(){
    this.events.publish( 'entered', false );						
  
    }
 
  open(){
    this.navCtrl.push( AvrsearchPage ,{'supplier':true});

  }

}
