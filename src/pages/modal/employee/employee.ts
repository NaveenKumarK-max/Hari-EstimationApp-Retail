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
  selector: 'page-employee',
  templateUrl: 'employee.html',
})
export class EmpSearchPage {

  details:any = []; 
  empData:any = [];
  public input: string = '';
  loader:any

  constructor(public keyboard:Keyboard,public events:Events,public navCtrl: NavController,public renderer: Renderer,public viewCtrl: ViewController, public navParams: NavParams,private loadingCtrl: LoadingController) {
    let loader = this.loadingCtrl.create({ 
      content: 'Please Wait', 
      spinner: 'bubbles',
     }); 
     loader.present(); 
     this.empData = this.navParams.get('empData') 
     this.details = this.navParams.get('empData');
    console.log(this.empData.length,'ooooooooooo'); 
    this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'countrymodel', true); 
    // if(this.empData.length != 0){ 
      loader.dismiss(); 
    // }
    
  }

  selected(temp){
    this.viewCtrl.dismiss(temp);
  }

  dismiss(temp){
    this.viewCtrl.dismiss();
  }

  search() {
    if (!this.input.trim().length || !this.keyboard.isOpen()) { 
      this.details = this.navParams.get('data');
      return;
    }
    this.details = this.empData.filter(item => item['emp_name'].toUpperCase().includes(this.input.toUpperCase()));
  }
  ionViewWillLeave(){
    this.events.publish( 'entered', false );						
  
    }
  ionViewWillEnter(){
  
  this.events.publish( 'entered', true );						
  this.events.publish( 'pageno', 1 );	
  
  }
}
