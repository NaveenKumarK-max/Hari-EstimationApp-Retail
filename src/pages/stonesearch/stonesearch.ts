import { Component,Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events,Keyboard,  ViewController,ToastController ,LoadingController} from 'ionic-angular';

/**
 * Generated class for the CustomPopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-stonesearch',
  templateUrl: 'stonesearch.html',
})
export class StonesearchPage {

  details:any = []; 
  empData:any = [];
  public input: string = '';

  constructor(public keyboard:Keyboard,public events:Events,public navCtrl: NavController,public renderer: Renderer,public viewCtrl: ViewController, public navParams: NavParams) {
    this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'countrymodel', true); 
    this.empData = this.navParams.get('empData'); 
    this.details = this.navParams.get('empData'); 
  }

  selected(temp){
    this.viewCtrl.dismiss(temp);
  }

  dismiss(temp){
    this.viewCtrl.dismiss();
  }

  search() {
  
    this.details = this.empData.filter(item => item['stone_name'].toUpperCase().includes(this.input.toUpperCase()));
  }
  ionViewWillLeave(){
    this.events.publish( 'entered', false );						
  
    }
  ionViewWillEnter(){
  
  this.events.publish( 'entered', true );						
  this.events.publish( 'pageno', 111 );	
  
  }
}
