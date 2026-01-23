import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Content, IonicPage, NavController, NavParams, Slides, ViewController } from 'ionic-angular';

/**
 * Generated class for the OrderStatusViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-order-status-view',
  templateUrl: 'order-status-view.html',
})
export class OrderStatusViewPage {
  @ViewChild(Content) content: Content;
  @ViewChild('slides') slides: Slides;
  slidess = [];
  //   advance_adj_amount - balance amount
  // :
  // "0"
  // advance_amount
  // :

  receivedData: any
  balance: any
  toggle: any = true;
  calc: any = 350;
  slideimg: any;

  totalstonevalue: any = 0
  totalgram: any = 0;
  totalct: any = 0;
  totaldiavalue:any = 0
  description
 

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public cd: ChangeDetectorRef) {
  
    this.receivedData = this.navParams.get('item');
    this.description = this.receivedData.description
    this.description.innerHTML
    if (this.receivedData.image_details == undefined) {
      this.receivedData.image_details = []
      this.receivedData.image_details.push({
        'image': ''
      })
    } else {
      console.log("image details is available");
    }
    console.log(this.receivedData.image_details, '88888');

    this.slidess.push(this.receivedData)
    this.balance = this.receivedData.advance_amount - this.receivedData.advance_adj_amount
    console.log(this.balance);
    console.log(this.slidess, '000000000000');
    this.slideimg = this.receivedData['default_image'];
    console.log(this.slideimg);

    console.log(this.receivedData, 'kkkkkkkkkkk');


    if (this.receivedData['stonedetail'].length > 0) {
      for (let index = 0; index < this.receivedData['stonedetail'].length; index++) {
        this.totalstonevalue += parseFloat(this.receivedData['stonedetail'][index].amount)

        if (this.receivedData['stonedetail'][index]['uom_id'] == 1) {
          this.totalgram += parseFloat(this.receivedData['stonedetail'][index]['wt'])
        
        } else if (this.receivedData['stonedetail'][index]['uom_id'] == 6) {
          this.totalct += parseFloat(this.receivedData['stonedetail'][index]['wt'])
      
        }
      }
    }

    if (this.receivedData['diadetail'].length > 0) {
      console.log('data : ', this.receivedData['diadetail']);

      for (let index = 0; index < this.receivedData['diadetail'].length; index++) {
        this.totaldiavalue += parseFloat(this.receivedData['diadetail'][index].amount)
     
        console.log('total : ', this.totaldiavalue);

        if (this.receivedData['diadetail'][index]['uom_id'] == 1) {
          this.totalgram += parseFloat(this.receivedData['diadetail'][index]['wt'])
        

        } else if (this.receivedData['diadetail'][index]['uom_id'] == 6) {
          this.totalct += parseFloat(this.receivedData['diadetail'][index]['wt'])
     
        }

      }
    }


  }

  scrolling(event) {
    if (event.scrollTop == 0) {

      this.calc = 350;
    }
    else {
      this.calc = 350 - event.scrollTop;
      this.content.resize();
      this.cd.detectChanges();

    }
    // your content here for scrolling
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatusViewPage');
  }

  back() {
    this.viewCtrl.dismiss();
  }
  fixprice(data) {

    let temp1: any = parseFloat(data).toFixed(3);

    return temp1;
  }
  price(data) {

    let temp1: any = parseFloat(data).toFixed();

    return temp1;

  }
  tog(i) {
    console.log(i);

    this.receivedData['stonedetail'].forEach((value, key) => {
      if (key == i && this.receivedData['stonedetail'][key]['toggle'] == false) {
        this.receivedData['stonedetail'][key]['toggle'] = true;
      }
      else {
        this.receivedData['stonedetail'][key]['toggle'] = false;
      }
    });
    console.log(this.receivedData['stonedetail'])
  }

  diamond_tog(i) {
    console.log(i);

    this.receivedData['diadetail'].forEach((value, key) => {
      if (key == i && this.receivedData['diadetail'][key]['toggle'] == false) {
        this.receivedData['diadetail'][key]['toggle'] = true;
      }
      else {
        this.receivedData['diadetail'][key]['toggle'] = false;
      }
    });
    console.log(this.receivedData['diadetail'])
  }


  slide() {

    console.log(this.slides.getActiveIndex())
    this.receivedData = this.slidess.length - 1 < this.slides.getActiveIndex() ? this.slidess[this.slides.getActiveIndex() - 1] : this.slidess[this.slides.getActiveIndex()];
    console.log(this.receivedData)
    this.slideimg = this.receivedData['TagImage'];
    // this.productdet['net_wt'] = this.productdet['NetWt'];
    //     this.productdet['gross_wt'] = this.productdet['GrossWt'];

    // this.productdet['metal_type'] = this.productdet['rate_field'];
    // this.productdet['market_metal_type'] = this.productdet['market_rate_field'];
    // this.productdet['tax_group_id'] = this.productdet['tgrp_id'];
    // // if(this.productdet['colorcode'] == ''){
    // //   this.productdet['colorcode'] = 'black';
    // // }
    // this.calculate('');

    this.cd.detectChanges();
  }
  back1() {
    if (this.slides.getActiveIndex() != 0) {
      this.slides.slidePrev();
    }
  }
  next() {

    this.slides.slideNext();
  }

  setimg(img, ind) {

    this.slideimg = img;

    console.log(this.slideimg)
  }

}

