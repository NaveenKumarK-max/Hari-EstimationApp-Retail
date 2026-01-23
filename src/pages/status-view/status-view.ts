import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Content,IonicPage, NavController, NavParams, Slides, ViewController } from 'ionic-angular';

/**
 * Generated class for the StatusViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-status-view',
  templateUrl: 'status-view.html',
})
export class StatusViewPage {
  @ViewChild(Content) content: Content;
  @ViewChild('slides') slides: Slides;
  slidess=[];
//   advance_adj_amount - balance amount
// :
// "0"
// advance_amount
// :

  receivedData:any
  balance:any
  toggle:any=true;
  calc:any = 350;
  slideimg : any ;


  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController,public cd:ChangeDetectorRef) {
    this.receivedData = this.navParams.get('item');
    this.slidess.push(this.receivedData)
    this.balance = this.receivedData.advance_amount - this.receivedData.advance_adj_amount
    console.log(this.balance);
    console.log(this.slidess,'000000000000');
    this.slideimg = this.receivedData['default_image'];
    console.log(this.slideimg);

    console.log(this.receivedData,'kkkkkkkkkkk');

  }

  scrolling(event) {

    if(event.scrollTop == 0){

      this.calc = 350;
    }
    else{
      this.calc = 350 - event.scrollTop;
      this.content.resize();
      this.cd.detectChanges();
    }
      // your content here for scrolling
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatusViewPage');
  }

  back(){
    this.viewCtrl.dismiss();
  }
  fixprice(data){

    let temp1:any = parseFloat(data).toFixed(3);

    return temp1;
  }
  price(data){

    let temp1:any = parseFloat(data).toFixed();

    return temp1;

  }
  tog(i) {
    console.log(i);

      this.receivedData['stonedetail'].forEach((value, key) => {
        if(key == i && this.receivedData['stonedetail'][key]['toggle'] == false){
           this.receivedData['stonedetail'][key]['toggle'] = true;  }
                else{
                   this.receivedData['stonedetail'][key]['toggle'] = false;
                     }
                    });
                     console.log(this.receivedData['stonedetail'])
                    }

  diamond_tog(i) {
    console.log(i);

      this.receivedData['diadetail'].forEach((value, key) => {
        if(key == i && this.receivedData['diadetail'][key]['toggle'] == false){
           this.receivedData['diadetail'][key]['toggle'] = true;  }
                else{
                   this.receivedData['diadetail'][key]['toggle'] = false;
                     }
                    });
                     console.log(this.receivedData['diadetail'])
                    }


                    slide(){

                      console.log(this.slides.getActiveIndex())
                      this.receivedData = this.slidess.length - 1 < this.slides.getActiveIndex() ?  this.slidess[this.slides.getActiveIndex() - 1] : this.slidess[this.slides.getActiveIndex()] ;
                      console.log(this.receivedData)
                      this.slideimg  = this.receivedData['TagImage'];
                      // this.productdet['net_wt'] = this.productdet['NetWt'];
                      //     this.productdet['gross_wt'] = this.productdet['GrossWt'];

                      // this.productdet['metal_type'] = this.productdet['rate_field'];
                      // this.productdet['market_metal_type'] = this.productdet['market_rate_field'];
                      // this.productdet['tax_group_id'] = this.productdet['tgrp_id'];
                      // // if(this.productdet['colorcode'] == ''){
                      // //   this.productdet['colorcode'] = 'black';
                      // // }
                      // this.calculate('');

                      this.cd.detectChanges();      }
                    back1(){
                      if(this.slides.getActiveIndex() != 0){
                      this.slides.slidePrev();
                      }
                    }
                    next(){

                      this.slides.slideNext();
                    }

                    setimg(img,ind){

                      this.slideimg  =img;

                      console.log(this.slideimg)
                    }

}
