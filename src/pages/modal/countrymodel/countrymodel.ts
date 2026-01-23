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
  selector: 'page-countrymodel',
  templateUrl: 'countrymodel.html',
})
export class CountrymodelPage {


  details:any[] = [];

  searchData:any[] = [];
  public input: string = '';
  name:any = ''

  constructor(private events: Events,public keyboard:Keyboard,public event:Events,public navCtrl: NavController,public renderer: Renderer,public viewCtrl: ViewController, public navParams: NavParams) {
    this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'countrymodel', true);
    this.name = this.navParams.get('name');
    this.details = this.navParams.get('data');
    this.searchData = this.navParams.get('data');
  }

  selected(temp){
    this.viewCtrl.dismiss(temp,this.name);
  }

  dismiss(temp){
    this.viewCtrl.dismiss();
  }

  search() {
    if (!this.input.trim().length || !this.keyboard.isOpen()) { 
      this.details = this.navParams.get('data');
      return;
    }
    this.details = this.name != "Village"? this.searchData.filter(item => item['name'].toUpperCase().includes(this.input.toUpperCase())):this.searchData.filter(item => item['village_name'].toUpperCase().includes(this.input.toUpperCase()));
  }
  ionViewWillLeave(){
    this.events.publish( 'entered', false );						
  
    }
  ionViewWillEnter(){
  
  this.events.publish( 'entered', true );						
  this.events.publish( 'pageno', 1 );	
  
  }
}
