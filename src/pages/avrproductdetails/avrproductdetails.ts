import { Component } from '@angular/core';
import { Events,IonicPage, NavController, NavParams,LoadingController,ModalController,ToastController } from 'ionic-angular';

import { CommonProvider } from '../../providers/common';
import { AvrsearchPage } from '../avrsearch/avrsearch';
import { FolderpressPage } from '../folderpress/folderpress';
import { SupprodetailPage } from '../supprodetail/supprodetail';
import { AutoPage } from '../auto/auto';
import { DesignsPage } from '../designs/designs';
import { WishlistPage } from '../wishlist/wishlist';


// @IonicPage()
@Component({
    selector: 'page-avrproductdetails',
    templateUrl: 'avrproductdetails.html',
  providers: [CommonProvider]
})
export class AvrproductdetailsPage {

  id_product = this.navParams.get('id_product');
  design = this.navParams.get('design_no');

  empData = JSON.parse(localStorage.getItem('empDetail'));
  designs: any[]=[];
  // designs: any[]=[];

  last_id: any = 0;
  page_no: any = 1;

  id_ret_category = this.navParams.get('id_category');
  pagename = this.navParams.get('pagename');
  from = this.navParams.get('filter');
  checkStatus: boolean = false;
  total_records:any = 0;
  where:any = '';
  totalcartitems = localStorage.getItem('carts') != null ? JSON.parse(localStorage.getItem('carts'))['items'] : [];
	wish = [];

  constructor(public toast:ToastController,private events: Events,public modal:ModalController,public comman:CommonProvider,public navCtrl: NavController,public load: LoadingController, public navParams: NavParams ) {

    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();

    this.where = this.navParams.get('collect');

    // if(this.from != undefined){
      var postData = {
        // 'id_employee': this.empData['uid'] != null ? this.empData['uid'] : null,
        'type': 'active',
        'id_product': this.id_product,
        'last_id': this.last_id,
        'design_no':this.design
      }
      // this.from["lastid"] = this.last_id;
      this.from["page_no"] = this.page_no;
      this.from["type"] = 'pr';

      this.comman.metal(this.from ).then(data => {

        // this.designs = data;
        this.designs = data['ReturnObject'] != null ? data['ReturnObject'] : [];

        console.log(this.designs);
        this.total_records = data['total_records'];

        loader.dismiss();

      },err=>{
        loader.dismiss();

      })
    // }
    // else{
    //   var postData = {
    //     'id_employee': this.empData['uid'] != null ? this.empData['uid'] : null,
    //     'type': 'active',
    //     'id_product': this.id_product,
    //     'last_id': this.last_id,
    //     'design_no':this.design
    //   }
    //   this.comman.getsubdesigns(postData).then(data => {

    //     this.designs = data;
    //     console.log(this.designs);
    //     loader.dismiss();

    //   })
    // }


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DesignsPage');
  }

  doInfinite(infiniteScroll: any) {
    console.log(this.designs)
    this.page_no = this.page_no + 1;
    // if(this.from != undefined){

      this.from["lastid"] = this.designs[this.designs.length - 1]['id_tag_detail'];
      this.from["page_no"] = this.page_no;

    console.log(this.last_id);
    var postData = {
      // 'id_employee': this.empData['uid'] != null ? this.empData['uid'] : null,
      'type': 'active',
      'id_product': this.id_product,
      'last_id': this.last_id,
      'design_no':this.design

    }
    this.from["type"] = 'pr';

    this.comman.metal(this.from ).then(data => {
      let productItems = data['ReturnObject'] != null ? data['ReturnObject'] : [];

      for (let index = 0; index < productItems.length; index++) {
        this.designs.push(productItems[index])
      }

      infiniteScroll.complete();

    })

    // }else{

    //   this.last_id = this.designs[this.designs.length - 1]['id_sub_design'];
    // console.log(this.last_id);
    // var postData = {
    //   'id_employee': this.empData['uid'] != null ? this.empData['uid'] : null,
    //   'type': 'active',
    //   'id_product': this.id_product,
    //   'last_id': this.last_id,
    //   'design_no':this.design

    // }
    // this.comman.getsubdesigns(postData).then(data => {
    //   console.log(data)
    //   for (let index = 0; index < data.length; index++) {
    //     this.designs.push(data[index])
    //   }
    //   infiniteScroll.complete();
    // })
    // }

  }

  openDesign(product_id){
    product_id['net_wt'] = product_id['NetWt'];
    product_id['gross_wt'] = product_id['GrossWt'];
    product_id['metal_type'] = product_id['rate_field'];
    product_id['market_metal_type'] = product_id['market_rate_field'];
    product_id['tax_group_id'] = product_id['tgrp_id'];

    // if(this.from != undefined){
      // this.navCtrl.push( ProdetailPage, { proid: design_no } );
      if(product_id.hasOwnProperty('TagStone')){
        product_id['TagStoneDetails'] = product_id['TagStone'];
    }

    localStorage.setItem('see',JSON.stringify(this.designs))
    console.log(JSON.parse(localStorage.getItem('see')))

    // product_id['arr'] = JSON.parse(localStorage.getItem('see'));

    // product_id['arr'].unshift(product_id);
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
    this.navCtrl.push( DesignsPage, { filter:{metalcode:this.from['MetalCode'],product_id:product_id['product_id']} , single: JSON.parse(localStorage.getItem('see')) } );

    // }else{
    //   this.navCtrl.push(DesignDetailPage,{ 'id_category': this.id_ret_category,'id_product': this.id_product,'design_no':this.design,'id_sub_design':design_no.id_sub_design,'type':'edit'})

    // }
  }
  open(){
    this.navCtrl.push( AvrsearchPage,{'supplier':true} );

  }
  grid()
  {
      console.log("grid");
      this.checkStatus = true;
  }
  listgrid()
  {
      console.log("listgrid");
      this.checkStatus = false;
  }
  price(data){

    let temp1:any = parseFloat(data).toFixed();

    return temp1;

  }
//   sort(){

//     console.log(this.designs)
//     // else if(no == 4){

//       this.designs = this.designs.sort(function(a, b){
//         return parseInt(a.GrossWt) - parseInt(b.GrossWt)
//     });
//     console.log(this.designs)

// }
sort(now){

  let profileModal = this.modal.create(FolderpressPage);
  profileModal.present();

  profileModal.onDidDismiss(no=>{
    console.log(no);
    if(no != null){


  if(no == 2){

    this.designs = this.designs.sort(function(a, b){
      var nameA=a['sub_design_name'].toLowerCase(), nameB=b['sub_design_name'].toLowerCase()
      if (nameA < nameB) //sort string ascending
          return -1
      if (nameA > nameB)
          return 1
      return 0 //default return value (no sorting)
  });
  }
  else if(no == 3){

    this.designs = this.designs.sort(function(a, b){
      var nameA=a['sub_design_name'].toLowerCase(), nameB=b['sub_design_name'].toLowerCase()
      if (nameA > nameB) //sort string decending
          return -1
      if (nameA < nameB)
          return 1
      return 0 //default return value (no sorting)
  });    }
  else if(no == 4){

    this.designs = this.designs.sort(function(a, b){
      if(a.Rate != null && b.Rate != null){
        return parseInt(a.Rate) - parseInt(b.Rate)
        }
        // if(a.Rate != null && b.Rate == null){
        //   return parseInt(a.Rate) - parseInt(b.price)
        //   }
        //   if(a.Rate == null && b.Rate != null){
        //     return parseInt(a.price) - parseInt(b.Rate)
        //     }
        //     if(a.Rate == null && b.Rate == null){
        //       return parseInt(a.price) - parseInt(b.price)
        //       }
               });    }
  else if(no == 5){

    this.designs = this.designs.sort(function(a, b){
      if(b.Rate != null && a.Rate != null){
      return parseInt(b.Rate) - parseInt(a.Rate)
      }
      // if(b.Rate != null && a.Rate == null){
      //   return parseInt(b.Rate) - parseInt(a.price)
      //   }
      //   if(b.Rate == null && a.Rate != null){
      //     return parseInt(b.price) - parseInt(a.Rate)
      //     }
      //     if(b.Rate == null && a.Rate == null){
      //       return parseInt(b.price) - parseInt(a.price)
      //       }
  });    }
  else if(no == 6){
      this.designs = this.designs.sort(function(a, b){
                  return parseInt(a.weights['weight']) - parseInt(b.weights['weight'])
              });
  }
  else if(no == 7){
      this.designs = this.designs.sort(function(a, b){
          return parseInt(b.weights['weight']) - parseInt(a.weights['weight'])
      });
  }
  else if(no == 8){
    this.designs = this.designs.sort(function(a, b){
                return parseInt(a.timestamp) - parseInt(b.timestamp)
            });
}
else if(no == 9){
    this.designs = this.designs.sort(function(a, b){
        return parseInt(b.timestamp) - parseInt(a.timestamp)
    });
}
  console.log(no);
  console.log(this.designs);
}
});

  }
  ionViewWillLeave(){
    this.events.publish( 'entered', false );

    }
  ionViewWillEnter(){

  this.events.publish( 'entered', true );
  this.events.publish( 'pageno', 5 );
  this.comman.getwish().then(data=>{

    console.log(data);
    this.wish = data['supp_cat'];
  })

  }
  fixprice(data){

    let temp1:any = parseFloat(data).toFixed(3);

    // let temp:any = parseFloat(temp1);
    return temp1;
    // return temp.toLocaleString(undefined, {minimumFractionDigits: 3,
    //   maximumFractionDigits: 3});
    // return parseFloat(data).toLocaleString(undefined, {minimumFractionDigits: 2,
    //   maximumFractionDigits: 2});
    // return parseFloat(data).toFixed(2);
  }
  addWishlist(item,i){


    let empData = JSON.parse(localStorage.getItem('sssuser'));


          let loader = this.load.create({
            content: 'Please Wait',
            spinner: 'bubbles',
          });
          loader.present();

          this.comman.addToWishlist(
            {
              "customer_name" : empData['customer']['firstname'],
              "mobile"          : empData['mobile'],
              "customer_id"     : empData['customer']['id_customer'],
              "id_sub_design"   : item['id_sub_design'],
              "product_id"      : item['product_id'],
              "design_id"         : item['design_id'],
              // "branch_id"       : empData['id_branch'],
              // "employee_id"     : empData['uid'],
              'id_supp_catalogue':item['id_supp_catalogue']

          }).then(data=>{


            let toastMsg = this.toast.create({
              message: data.msg,
              duration: 4000,
              position: 'middle'
            });
            toastMsg.present();

            if(this.designs[i]['wishlist'] == 0){
              this.designs[i]['wishlist'] = 1;
            }
            else{
              this.designs[i]['wishlist'] = 0;

            }
            loader.dismiss();

          },err=>{
            let toastMsg = this.toast.create({
              message: "try again",
              duration: 4000,
              position: 'middle'
            });
            toastMsg.present();
            loader.dismiss();

          })



  }
  auto(){
    this.navCtrl.push(AutoPage)

  }
  wishlist(){
    this.navCtrl.push(WishlistPage)

}
}


