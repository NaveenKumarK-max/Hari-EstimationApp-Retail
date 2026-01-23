import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,MenuController } from 'ionic-angular';

/**
 * Generated class for the MaintenancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-maintenance',
  templateUrl: 'maintenance.html',
})
export class MaintenancePage {
  maintaindata:any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams,private menu: MenuController) {
  this.maintaindata = this.navParams.get(("maintainData"))['comp'];  
  console.log(this.maintaindata);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MaintenancePage');
  }
  ionViewDidEnter() {
		this.menu.swipeEnable(false);

		// If you have more than one side menu, use the id like below
		// this.menu.swipeEnable(false, 'menu1');
	  }

	  ionViewWillLeave() {
		// Don't forget to return the swipe to normal, otherwise 
		// the rest of the pages won't be able to swipe to open menu
		this.menu.swipeEnable(true);

		// If you have more than one side menu, use the id like below
		// this.menu.swipeEnable(true, 'menu1');
	   }

}
