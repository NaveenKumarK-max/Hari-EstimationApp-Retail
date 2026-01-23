import { Component } from '@angular/core';
import { Events,IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';
import { RetailProvider } from '../../providers/retail';
import { AvrsearchPage } from '../avrsearch/avrsearch';
import { DesignDetailPage } from '../design-detail/design-detail';
import { SubdesignPage } from '../subdesign/subdesign';
import { WishlistPage } from '../wishlist/wishlist';

// @IonicPage()
@Component({
  selector: 'page-supdesign',
  templateUrl: 'supdesign.html',
  providers: [RetailProvider]
})
export class SupdesignPage {

  id_product = this.navParams.get('id_product');
  id_ret_category = this.navParams.get('id_category');

  empData = JSON.parse(localStorage.getItem('empDetail'));
  designs: any={};
  last_id: any = 0;
  pagename = this.navParams.get('pagename');

  constructor(private events: Events,public navCtrl: NavController,public load: LoadingController, public navParams: NavParams , public retailService: RetailProvider) {

    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();

    var postData = {
      'id_employee': this.empData['uid'] != null ? this.empData['uid'] : null,
      'type': 'active',
      'id_product': this.id_product,
      'last_id': this.last_id,
      'status':this.pagename


    }
    this.retailService.getDesigns(postData).then(data => {

      this.designs = data;
      console.log(this.designs);
      loader.dismiss();

    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DesignsPage');
  }

  doInfinite(infiniteScroll: any) {
    console.log(this.designs)
    this.last_id = this.designs[this.designs.length - 1]['id_design'];
    console.log(this.last_id);
    var postData = {
      'id_employee': this.empData['uid'] != null ? this.empData['uid'] : null,
      'type': 'active',
      'id_product': this.id_product,
      'last_id': this.last_id,
      'status':this.pagename


    }
    this.retailService.getDesigns(postData).then(data => {
      console.log(data)
      for (let index = 0; index < data.length; index++) {
        this.designs.push(data[index])
      }
      infiniteScroll.complete();
    })
  }

  // openDesign(design_no){
  //   this.navCtrl.push(DesignDetailPage,{'design_no':design_no,'type':'view_only'})
  // }
  opensubDesign(data){

      var temp ={"Category": [
        {

          "category_code": this.id_ret_category,
        }
      ],
      "Product": [
        {
          "productcode": this.id_product,
          "category_code": this.id_ret_category,
          'id_product':this.id_product
        }],
        "Design": [
          {
            "id_product": this.id_product,
            "id_design": data.id_design,
            "design_code": data.design_code,
            "productcode": this.id_product,
            "category_code": this.id_ret_category,
          }]
      }

    this.navCtrl.push(SubdesignPage,{'filter':temp});

    // this.navCtrl.push(SubdesignPage,{       'id_category': this.id_ret_category,
    // 'id_product': this.id_product,
    // 'design_no':design_no,'type':'view_only','pagename':this.pagename})
  }
  open(){
    this.navCtrl.push( AvrsearchPage );

  }
  ionViewWillLeave(){
    this.events.publish( 'entered', false );

    }
  ionViewWillEnter(){

  this.events.publish( 'entered', true );
  this.events.publish( 'pageno', 1 );

  }
  addWishlist(){
    this.navCtrl.push(WishlistPage)
  }
}
