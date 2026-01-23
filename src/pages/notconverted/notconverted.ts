import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ActionSheetController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common';

/**
 * Generated class for the NotconvertedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-notconverted',
  templateUrl: 'notconverted.html',
      providers: [CommonProvider]

})
export class NotconvertedPage {

	whole:any [] = [];
	ind:any = '';
  swhole:any [] = [];

  constructor(public actionSheetCtrl: ActionSheetController,public loadingCtrl:LoadingController,public common: CommonProvider,public navCtrl: NavController, public navParams: NavParams) {
  let loader = this.loadingCtrl.create({
			content: 'Please Wait',
			spinner: 'bubbles',
		  });
		  loader.present();

      this.common.notconverted().then(data=>{
        this.whole = data;
        this.swhole = data;


      data.forEach(element => {

        element['tog'] = 'View More';
      });
        loader.dismiss();
      },err=>{
        loader.dismiss();
    
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotconvertedPage');
  }
  open(i){

      if(this.whole[i]['tog']  == 'View More'){
       this.whole[i]['tog'] = 'View Less';
     }
     else{
       this.whole[i]['tog'] = 'View More';
     }
  console.log(this.ind)

  }


  filter(){

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Filter by',
      buttons: [
        {
          text: 'Created',
          handler: () => {
            this.whole = this.swhole.filter(item => item['status'] == '1');

            console.log('Destructive clicked');
          }
        },
        {
          text: 'Converted',
          handler: () => {
            this.whole = this.swhole.filter(item => item['status'] == '2');

            console.log('Archive clicked');
          }
        },
        {
          text: 'Closed',
          handler: () => {
            this.whole = this.swhole.filter(item => item['status'] == '3');

            console.log('Cancel clicked');
          }
        }
      ]
    });
 
    actionSheet.present();
  }

}
