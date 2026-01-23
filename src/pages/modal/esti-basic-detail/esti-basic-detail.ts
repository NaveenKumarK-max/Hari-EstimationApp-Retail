import { Component } from '@angular/core';
import { Events,IonicPage, NavController, NavParams,ViewController,LoadingController,ModalController,App } from 'ionic-angular';
import { CommonProvider } from '../../../providers/common';
import { CusSearchPage } from '../customer/customer';
import { EmpSearchPage } from '../employee/employee';
import { AddQuickCus } from '../add-quick-cus/add-quick-cus';
import { HomePage } from '../../home/home';
/**
 * Generated class for the EstiBasicDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-esti-basic-detail',
  templateUrl: 'esti-basic-detail.html',
  providers: [CommonProvider]

})
export class EstiBasicDetailPage {

  toggle: any = true;
  employees = [];
  askBranch = 0;
  selectedCusData = [];
  esti = [];
  branches = [];
  cusData = [];
  empData = JSON.parse(localStorage.getItem('empDetail'));

  constructor(private events: Events,public load:LoadingController,public app:App, public common:CommonProvider,public viewCtrl: ViewController,public navCtrl: NavController, public navParams: NavParams,  public modal: ModalController) {
    this.askBranch = this.navParams.get('askBranch');
    console.log(this.askBranch)
    this.employees = this.navParams.get('employees');
    this.selectedCusData = this.navParams.get('selectedCusData');
    this.esti = this.navParams.get('esti');
    this.branches = this.navParams.get('branches');
    console.log(this.esti);

    let temp = this.employees.filter(data=> data['id_employee'] == this.empData['uid']);
    if(temp.length > 0){
      this.esti['id_employee'] = temp[0]['id_employee'];
      this.esti['emp_name'] = temp[0]['emp_name'];
    }
  }

  proceed(){
    this.viewCtrl.dismiss(this.esti);
  }

  openEmpModal(){
    let modal = this.modal.create(EmpSearchPage,{"empData" : this.employees})
    modal.present();
    modal.onDidDismiss(data => {
      if(data != null){
        this.esti['id_employee'] = data.id_employee;
        this.esti['emp_name'] = data.emp_name;
      }
    }); 
  }

  openCusModal() {
    let modal = this.modal.create(CusSearchPage)
    modal.present();
    modal.onDidDismiss(data => {
      if(data != null){
        this.esti['cus_id'] = data.id_customer;
        this.esti['customer'] = data.label;
        this.selectedCusData = data;
        this.esti['selectedCusData']= data;
      }
    });
  }
  
  openQuickCus(){
    let modal = this.modal.create(AddQuickCus)
    modal.present();
    modal.onDidDismiss(data => {
      console.log(data)
      if(data != null){
        this.esti['cus_id'] = data.id_customer;
        this.esti['customer'] = data.label;
        this.selectedCusData = data;
        this.esti['selectedCusData']= data;
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EstiBasicDetailPage');
  }

  dismiss(){
    this.viewCtrl.dismiss();
    this.app.getRootNav().setRoot(HomePage);
  }

  ionViewWillLeave(){
    this.events.publish( 'entered', false );						
  
    }
  ionViewWillEnter(){
  
  this.events.publish( 'entered', true );						
  this.events.publish( 'pageno', 1 );	
  
  }

}
