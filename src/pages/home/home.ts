import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController, Events, LoadingController, Content, NavParams, ViewController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common';
import { LoginPage } from '../login/login';
import { EstiPage } from '../estimation/estimation';
import { CusRegisterPage } from '../cus-register/cus-register';
import { CategoryPage } from '../category/category';
import { EcatalogPage } from '../e-catalog/e-catalog';
import { WishlistPage } from '../wishlist/wishlist';
import { CartPage } from '../cart/cart';
import { StockCodeEntryPage } from '../stock-entry/stock-entry';
import { EmpSearchPage } from '../modal/employee/employee';
import { BluetoothPage } from '../bluetooth/bluetooth';
import { BranchPage } from '../branch/branch';
import { AutoPage } from '../auto/auto';
import { EstimationlistPage } from '../estimationlist/estimationlist';
import  * as test  from '../../assets/js/test.js';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
    providers: [CommonProvider]

})
export class HomePage {

    @ViewChild(Content) content: Content;
    myInput: any = '';
    showSpinner: any = true;
    showdash: any = false;
    empData = JSON.parse(localStorage.getItem('empDetail'));
    versionData = JSON.parse(localStorage.getItem('versionData'));
	totalcartitems = localStorage.getItem('carts') != null ? JSON.parse(localStorage.getItem('carts'))['items'] : [];

    metalRate = [];
    settings  = [];
    dash_esti = [];
    dash_om   = [];
	pages:any = [];
    currency: any = { 'currency': { 'reg_existing': 0 } };
	empid:any = '';
	empname:any= '';

	bid:any = '';
	bnamename:any= '';
	employees = [];
	branches = [];
	wish = [];

    constructor(public common: CommonProvider, public view: ViewController, public navParams: NavParams, public nav: NavController, private modalCtrl: ModalController, private events: Events, private loadingCtrl: LoadingController) {
	  let empdata = JSON.parse(localStorage.getItem('empDetail'));
	  this.pages = empdata.menus;
	  console.log(test.test);

	  this.common.getbranch().then(data=>{
		this.branches = data;
	  });
	  this.common.getwish().then(data=>{

		console.log(data);
		this.wish = data;
	  })

	}

    ionViewDidLoad() {
		let loader = this.loadingCtrl.create({
			content: 'Please Wait',
			spinner: 'bubbles',
		  });
		  loader.present();

      this.common.getCurrencyAndSettings({"id_branch":this.empData['id_branch']}).then(data=>{
        this.metalRate = data.metal_rates;
        this.settings = data.settings;
        localStorage.setItem( 'currencyAndSettings', JSON.stringify( data ) );
      })
      let postData = {"id_branch":this.empData['id_branch'], "id_employee":this.empData['uid']};
      this.common.getRetDashboard(postData).then(data=>{
        this.dash_esti = data.esti_sale;
        this.dash_om = data.esti_old_metal;
		loader.dismiss();
      },err=>{
		loader.dismiss();

	  })
	  this.common.getBranchEmployees(this.empData['id_branch']).then(data=>{
        this.employees = data;
	  });
    }

    ngAfterViewInit() {
    }
	openEmpModal(){
		let modal = this.modalCtrl.create(EmpSearchPage,{"empData" : this.employees})
		modal.present();
		modal.onDidDismiss(data => {
		  if(data != null){
			this.empid = data.id_employee;
			this.empname = data.emp_name;

			this.empData['username'] = data.emp_name;
			this.empData['uid']  = data.id_employee;
		  }
		});
	  }

	  openbranchodal(){
		let modal = this.modalCtrl.create(BranchPage,{"branch" : this.branches})
		modal.present();
		modal.onDidDismiss(data => {
		  if(data != null){
			this.bid = data.id_branch;
			this.bnamename = data.name;

			this.empData['branch_name'] = data.name;
			// this.empData['id_branch'] = data.id_branch;
		  }
		});
	  }

	openPage(pageData) {
		var pageName = pageData.component;
		console.log(pageName);
		if(pageName == 'LoginPage'){
			this.nav.push(LoginPage);
		}
		else if(pageName == 'HomePage'){
			this.nav.setRoot(HomePage);
		}
		else if(pageName == 'EstiPage'){
			this.nav.setRoot(EstiPage,{'old_metal':[],'home_bill':[],'non_tag':[],'tag':[],"page_type" : pageData.page,'empname':this.empname,'empid':this.empid,'bname':this.bnamename,'bid':this.bid});
		}
		else if(pageName == 'CusRegisterPage'){
			this.nav.setRoot(CusRegisterPage);
		}
		else if(pageName == 'CategoryPage'){
			this.nav.push(CategoryPage);
		}
		else if(pageName == 'Ecatalog'){
			this.nav.setRoot(EcatalogPage);
		}
		else if(pageName == "WishlistPage"){
			this.nav.setRoot(WishlistPage);
		}
		else if(pageName == "CartPage"){
			this.nav.push(CartPage);
		}
		else if(pageName == "StockCodeEntryPage"){
			this.nav.setRoot(StockCodeEntryPage);
		}
	}
	openModal() {
		this.nav.push(AutoPage)
	}
	// ionViewWillLeave(){
	// 	this.events.publish( 'entered', false );

	//   }
  ionViewWillEnter(){

	this.events.publish( 'entered', true );
	this.events.publish( 'pageno', 1 );
	this.totalcartitems = localStorage.getItem('carts') != null ? JSON.parse(localStorage.getItem('carts'))['items'] : [];

  }
  goes(data){
	this.nav.push(EstimationlistPage,{"dd":data});
  }
  cart(){
	this.nav.push(CartPage);

  }
  wishlist(){

	this.nav.push(WishlistPage)
  }
  goto(){
	this.nav.setRoot(EstiPage,{'old_metal':[],'home_bill':[],'non_tag':[],'tag':[],"page_type" : 'create','empname':this.empname,'empid':this.empid,'bname':this.bnamename,'bid':this.bid});

  }
}
