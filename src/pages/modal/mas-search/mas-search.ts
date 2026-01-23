import { Component } from '@angular/core';
import { Events, IonicPage, Keyboard, NavController, NavParams,ViewController,LoadingController } from 'ionic-angular';
import { CommonProvider } from '../../../providers/common';

/**
 * Generated class for the MasSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-mas-search',
  templateUrl: 'mas-search.html',
  providers: [CommonProvider]

})
export class MasSearchPage {

  searchArr:any[] = [];
  toggle: any = true;
  page = "";
  list = [];
  listType = "normal";

  constructor(private events: Events, public keyboard:Keyboard, public load:LoadingController, public common:CommonProvider,public viewCtrl: ViewController,public navCtrl: NavController, public navParams: NavParams) {
    this.searchArr = this.navParams.get('searchArr');
    this.list = this.navParams.get('searchArr');
    this.page = this.navParams.get('page');
    this.listType = this.navParams.get('listType'); 
    events.subscribe('treeProd:selected', (data) => {
			this.viewCtrl.dismiss(data);
		});
    console.log(this.list);
    
  }

  selected(data){
    this.viewCtrl.dismiss(data);
  }

  getSearch(ev:any){
    const val = ev.target.value;
    if (!val.trim().length || !this.keyboard.isOpen()) { 
      this.list = this.navParams.get('searchArr');
      return;
    }
    if(this.page == "Section"){
    this.list = this.searchArr.filter(item => item['section_name'].toUpperCase().includes(val.toUpperCase()));
    }else if(this.page == "Product"){
    this.list = this.searchArr.filter(item => item['product_name'].toUpperCase().includes(val.toUpperCase()));
    }else if(this.page == "Design"){
    this.list = this.searchArr.filter(item => item['design_name'].toUpperCase().includes(val.toUpperCase()));
    }else if(this.page == "subDesign"){
    this.list = this.searchArr.filter(item => item['sub_design_name'].toUpperCase().includes(val.toUpperCase()));
    }else{
    this.list = this.searchArr.filter(item => item['label'].toUpperCase().includes(val.toUpperCase()));
    }
    console.log(this.list);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MasSearchPage');
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }
  ionViewWillLeave(){
    this.events.publish( 'entered', false );						
  
    }
  ionViewWillEnter(){
  
  this.events.publish( 'entered', true );						
  this.events.publish( 'pageno', 1 );	
  
  }
}
