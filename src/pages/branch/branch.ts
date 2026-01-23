import { Component } from '@angular/core';
import { Events,IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';

/**
 * Generated class for the BranchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-branch',
  templateUrl: 'branch.html',
})
export class BranchPage {

  
  branch:any[] = [];
  sebranch:any[] = [];
  empData = JSON.parse(localStorage.getItem('empDetail'));

  constructor(private events: Events,public viewCtrl:ViewController,public navCtrl: NavController, public navParams: NavParams) {
  
    this.branch = this.navParams.get('branch');
    this.sebranch = this.navParams.get('branch');
    console.log(this.empData['branch_id']);

    if(this.empData['branch_id'] != 0){

      let temp:any = this.empData['branch_id'];
      let spl:any[] = temp.split(',');
      console.log(spl);
      let final:any[] = [];

      spl.forEach(element => {
        
       let two:any[] = this.branch.filter(data=> data['id_branch'] == element);

        final.push(two[0]);
      });
      this.branch = final;
      this.sebranch = final;

      console.log(final);

    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BranchPage');
  }
  dismiss(){
    this.viewCtrl.dismiss();
  }
  selected(data){
    this.viewCtrl.dismiss(data);
  }
  getCus(input){

    console.log(input.target.value);
    console.log(this.sebranch)

    this.branch = this.sebranch.filter(item => item['name'].toUpperCase().includes(input.target.value.toUpperCase()));


  }
  // ionViewWillLeave(){
	// 	this.events.publish( 'entered', false );						
  
	//   }
  ionViewWillEnter(){

	this.events.publish( 'entered', true );						
	this.events.publish( 'pageno', 1 );	

  }
}
