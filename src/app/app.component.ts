import { Component, ViewChild } from '@angular/core';
import { Events, Platform, Nav, Config, MenuController, ToastController, LoadingController, AlertController, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Market } from '@ionic-native/market';
import { CommonProvider } from '../providers/common';
//import { OneSignal } from '@ionic-native/onesignal';
import { Network } from '@ionic-native/network';
import { Toast } from '@ionic-native/toast';
import { AppVersion } from '@ionic-native/app-version';
import { NavController, App } from "ionic-angular/index";
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { DatePicker } from '@ionic-native/date-picker';
import { File } from '@ionic-native/file';
import { timer } from 'rxjs/observable/timer';   //works fine

//Pages
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { CountrymodelPage } from '../pages/modal/countrymodel/countrymodel';
import { IntroimgPage } from '../pages/introimg/introimg';
import { MaintenancePage } from '../pages/maintenance/maintenance';
import { EstiPage } from '../pages/estimation/estimation';
import { CusRegisterPage } from '../pages/cus-register/cus-register';
import { CategoryPage } from '../pages/category/category';
import { EcatalogPage } from '../pages/e-catalog/e-catalog';
import { WishlistPage } from '../pages/wishlist/wishlist';
import { CartPage } from '../pages/cart/cart';
import { StockCodeEntryPage } from '../pages/stock-entry/stock-entry';
import { EdittagPage } from '../pages/edittag/edittag';
import { EstimationlistPage } from '../pages/estimationlist/estimationlist';
import { SubdesignlistPage } from '../pages/subdesignlist/subdesignlist';
import { DesignlistPage } from '../pages/designlist/designlist';
import { CustomorderPage } from '../pages/customorder/customorder';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Device } from '@ionic-native/device';
import { SubdesignPage } from '../pages/subdesign/subdesign';
import { CollectionPage } from '../pages/collection/collection';
import { AvrsearchPage } from '../pages/avrsearch/avrsearch';
import { SupcatPage } from '../pages/supcat/supcat';
import { SupsubdesignPage } from '../pages/supsubdesign/supsubdesign';
import { FaqPage } from '../pages/faq/faq';
import { Edittag2Page } from '../pages/edittag2/edittag2';
import { DirectPage } from '../pages/direct/direct';
import { InstockPage } from '../pages/instock/instock';
import { OrderStatusPage } from '../pages/order-status/order-status';

@Component({
	templateUrl: 'app.html',
	providers: [CommonProvider]
})
export class MyApp {
	rootPage: any = LoginPage;
	home: any;
	deals: any;
	loginstatus = false;
	showSplash = true;
	@ViewChild(Nav) nav: Nav;
	pages: any = [];
	overlayHidden: boolean = true;
	lastBack = 0;
	allowClose: boolean = false;
	app_version: any = 0;
	versionData;
	timer: any;
	exptimer: any;
	count: any = 1;
	foot: any = true;
	currYear: any;
	id_branch: any = 0;
	settingsData: any;
	branch_settings: any;
	login_branch: any;
	storageDirectory: any;
	clickedMenu = 0;
	enter = true;
	page = 1;
	companyName: any = 'Hari Jewellery ';

	constructor(
		private device: Device,public iab:InAppBrowser,private file: File, androidPermissions: AndroidPermissions,  private market: Market, public platform: Platform, public events: Events, public menu: MenuController, statusBar: StatusBar, splashScreen: SplashScreen, private network: Network, private loadingCtrl: LoadingController, private toastCtrl: ToastController, private toast: Toast, public alertCtrl: AlertController, private appVersion: AppVersion, private app: App, public modalCtrl: ModalController, public common: CommonProvider) {//private common: CommonProvider, private common: CommonProvider

		events.subscribe('user:created', (user) => {
			// user and time are the same arguments passed in `events.publish(user, time)
			this.foot = user;
			console.log('Welcome', user);
		});

		// events.subscribe( 'entered', (enter) => {
		// 	console.log(enter)
		// 	this.enter = enter;
		// });
		events.subscribe( 'lp', (enter) => {
			console.log(enter)
			this.enter = enter;
		});
		events.subscribe( 'pageno', (no) => {
			console.log(no)
			this.page = no;
		});

		platform.ready().then(() => {
				appVersion.getVersionNumber().then((s) => {
					this.app_version = s;
					console.log(this.app_version)
				})
			// this.nav.push(SubdesignPage);
			androidPermissions.requestPermissions(
			[
				androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
				androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
				androidPermissions.PERMISSION.READ_CONTACTS,
				androidPermissions.PERMISSION.READ_SMS
			]
			);
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
				this.presentAlert('Turn on Wi-Fi or mobile data.', 'You are Offline', '');
			});
			//disconnectSubscription.unsubscribe();
			let connectSubscription = this.network.onConnect().subscribe(() => {
				//this.presentAlert('Turn on Wi-Fi or mobile connection','You are Offline');
			});
			//	connectSubscription.unsubscribe();
			if (platform.is('cordova')) {
				appVersion.getVersionNumber().then((s) => {
					this.app_version = s;
					console.log(this.app_version)
				})
			}
			// Delete downloaded Estimation files in local
			this.storageDirectory = this.file.externalDataDirectory;
			this.file.resolveDirectoryUrl(this.storageDirectory).then((resolvedDirectory) => {
				this.file.listDir(this.storageDirectory,this.common.cmpShortName).then((data) => {
					console.log('resolvedDirectory',data);
					if(data){
						var now = new Date().toISOString().split('T')[0];
						var nowTimeStamp =  Math.floor((new Date(now)).getTime()/1000);
						console.log(nowTimeStamp);
						// Delete directory
						for ( let i = 0; i < data.length; i++ ) {
							console.log('----- list Directory',data[i].name);
							var folderTimeStamp =  Math.floor((new Date(data[i].name)).getTime()/1000);
							var CurrentDate = new Date();
							console.log(data[i].name);
							console.log(CurrentDate.toISOString().split('T')[0]);
							if(CurrentDate.toISOString().split('T')[0] == data[i].name){
								console.log(1111111)
							}else{
								console.log(222222);
								this.file.removeRecursively(resolvedDirectory.nativeURL+''+this.common.cmpShortName+'/', data[i].name).then(() => {
								console.log("Directory deleted successfully");
								}).catch(err => {
									console.log(err);
									console.log("Error occurred while deleting directory");
								});
							}
						}
					}else{
							console.log("No directories found");
					}

				}).catch(err1 => {
					console.log(err1);
					console.log("Error occurred while listDir");
				});
			}).catch(err2 => {
				console.log(err2);
				console.log("Error occurred while resolveDirectoryUrl");
			});

			platform.registerBackButtonAction(() => {
				if(this.nav.getActive()['name'] == 'EstiBasicDetailPage'){
					this.nav.setRoot(HomePage);
				}
				else if (this.nav.getActive()['name'] != 'PaymentPage') {
					const overlay = this.app._appRoot._overlayPortal.getActive();
					const nav = this.app.getActiveNav();
					const closeDelay = 2000;
					const spamDelay = 500;
					if (overlay && overlay.dismiss) {
						overlay.dismiss();
					} else if (nav.canGoBack()) {
						nav.pop();
					} else if (Date.now() - this.lastBack > spamDelay && !this.allowClose) {
						this.allowClose = true;
						let toast = this.toastCtrl.create({
							message: "Press back again to exit",
							duration: closeDelay,
							dismissOnPageChange: true
						});
						toast.onDidDismiss(() => {
							this.allowClose = false;
						});
						toast.present();
					} else if (Date.now() - this.lastBack < closeDelay && this.allowClose) {
						platform.exitApp();
					}
					this.lastBack = Date.now();
				}
			});

			statusBar.styleDefault();
			statusBar.overlaysWebView(false);
			splashScreen.hide();

			// check app version
			this.common.getCusAppVersion().then((data) => {
				this.versionData = data;
				this.branch_settings = data['settings']['branch_settings']
				this.login_branch = data['settings']['login_branch']
				localStorage.setItem('versionData', JSON.stringify(this.versionData));
				console.log(this.versionData)
				if (this.versionData.mode == 1) {
					this.nav.setRoot(MaintenancePage, { 'maintainData': this.versionData });
				}
				else {
					let remember = JSON.parse(localStorage.getItem('remember'));
					if (remember == true) {
						localStorage.setItem('logstatus', JSON.stringify(true));
					}
					else {
						localStorage.setItem('logstatus', JSON.stringify(false))
					}
					if (platform.is('android')) {
						if ((this.versionData.android) != this.app_version) {
							if ((this.versionData.new_android_ver) != this.app_version) {
								this.presentAlert(this.versionData.msg, this.versionData.title, this.versionData.path);
							}
						}
					}
					else if (platform.is('ios')) {
						if ((this.versionData.ios) != this.app_version) {
							if ((this.versionData.newver_ios) != this.app_version) {
								this.presentAlert(this.versionData.iMsg, this.versionData.title, this.versionData.iPackage);
							}
						}
					}
				}
			})

			this.common.getfilter(false).then(data=>{

				localStorage.setItem('predata',JSON.stringify(data['ReturnObject']))

			});

			this.common.getfilter(true).then(data=>{

				localStorage.setItem('spredata',JSON.stringify(data['ReturnObject']))

			});
		});
		let status = JSON.parse(localStorage.getItem('logstatus'));
		if (status == false || status == null) {
				this.pages = [];
				this.common.getCusAppVersion().then((data) => {
					this.versionData = data;
					this.branch_settings = data['settings']['branch_settings']
					this.login_branch = data['settings']['login_branch']
					if (data.showpopup == 1) {
						let profileModal = this.modalCtrl.create(IntroimgPage, { 'image': this.versionData });
						profileModal.present();
					}
				});
				this.loginstatus = false;
				localStorage.setItem('logstatus', JSON.stringify(false))
				this.rootPage = LoginPage;
		} else {
				this.pages = [];
        //this.pages = this.getpages();
				let remember = JSON.parse(localStorage.getItem('remember'));
				this.common.getCusAppVersion().then((data) => {
					this.versionData = data;
					localStorage.setItem('versionData', JSON.stringify(this.versionData));
					if (data.showpopup == 1) {
						console.log(this.versionData);
						let profileModal = this.modalCtrl.create(IntroimgPage,
							{ 'image': this.versionData });
						profileModal.present();
					}
				});
				if (remember == true) {
					//	this.loginstatus = true;
					if (localStorage.getItem('userdet') != null) {
						this.common.doLogin({ 'mobile': JSON.parse(localStorage.getItem('userdet'))['mobile'], 'passwd': JSON.parse(localStorage.getItem('userdet'))['passwd'] }).then(res => {
							if (res) {
								if (res.is_valid) {
									localStorage.setItem('kyc_status', JSON.stringify(res['customer']['kyc_status']));
									localStorage.setItem('sssuser', JSON.stringify(res));
									this.loginstatus = true;
								}
							}
						})
					}
				}
				else {
					localStorage.setItem('logstatus', JSON.stringify(false));
					this.loginstatus = false;
					this.rootPage = LoginPage;
				}
		}
		events.subscribe('user:changed', (status) => {
			this.loginstatus = status;
			if (status) {
				let empdata = JSON.parse(localStorage.getItem('empDetail'));
				this.pages = empdata.menus;
			} else {
				this.loginstatus = false;
			}
		});
		var date = new Date();
		var ddd = date.getDate();
		var mmm = date.getMonth() + 1;
		var yy = date.getFullYear();
		this.currYear = yy;
		var postData = {
			'id_branch': this.id_branch
		}
	}
	ionViewWillEnter() {
		console.log("ionViewWillEnter");
	}
	presentAlert(msg, title, mypackage) {
		let alert = this.alertCtrl.create({
			title: title,
			subTitle: msg,
			enableBackdropDismiss: false,
			buttons: [
				{
					text: 'Ok',
					handler: data => {
						// this.nav.push(CustomorderPage);
						if (mypackage != '') {
								// this.market.open(mypackage);
								// window.open(mypackage)
								this.iab.create(mypackage, '_system', 'location=yes,hardwareback=yes,hidden=yes');

						}
						// this.platform.exitApp();
					}
				}
			]
		});
		alert.present();
	}

	/*getpages() {
        return [
						{ title: 'Home', icon: 'home', component: HomePage, show : (this.loginstatus ? 1 : 0) },
            { title: 'Estimation', icon: 'calculator', component: EstiPage, show : (this.loginstatus ? 1 : 0) },
            { title: 'Sign Out', icon: 'log-out', component: EstiPage, show : (this.loginstatus ? 1 : 0) },
        ];
  }*/

	// On clicking Menu
	openPage(pageData) {
		console.log(pageData)
		var pageName = pageData.component;
		console.log(pageName);
		this.clickedMenu = pageData.id;
		this.menu.close();
		if(pageName == 'LoginPage'){
			this.nav.push(LoginPage);
		}
		else if(pageName == 'HomePage'){
			this.nav.setRoot(HomePage);
		}
		else if(pageName == 'EstiPage'){
			this.nav.setRoot(EstiPage,{'old_metal':[],'home_bill':[],'non_tag':[],'tag':[],"page_type" : pageData.page,'tit': pageData.title});
		}
		else if(pageName == 'CusRegisterPage'){
			this.nav.push(CusRegisterPage);
		}
		else if(pageName == 'CategoryPage'){
			this.nav.push(CategoryPage,{'pagename':pageName == 'LiveStock' ? 'instock' : 'outofstock'});
		}
		else if(pageName == 'SupplierCategoryPage'){
			this.nav.setRoot(SupcatPage,{'pagename':pageName == 'LiveStock' ? 'instock' : 'outofstock'});
		}
		else if(pageName == 'Ecatalog'){
			this.nav.setRoot(EcatalogPage);
		}
		else if(pageName == 'OrderstatusPage'){
      this.nav.setRoot(OrderStatusPage);  }
		else if(pageName == 'OrdercreationPage'){  		this.nav.setRoot( DirectPage, { proid: {}, single: []} );
	}
		else if(pageName == 'CollectionPage'){
			this.nav.push(CollectionPage,{'filter':{
			// 	"Category": [
			// 	{

			// 	  "category_code": '0',
			// 	}
			//   ]
			"is_newArrival" : 1,
    "Stock Status": [
    {
      "name": "Open",
      "count": "-1",
      "status": true
    }
    ]

			},'collect':'tt'});
		}
		else if(pageName == 'EdittagPage'){
			this.nav.push(Edittag2Page);
		}
		else if(pageName == "WishlistPage"){
			this.nav.setRoot(WishlistPage);
		}
		else if(pageName == "CartPage"){
			this.nav.push(CartPage);
		}
		else if(pageName == "FaqPage"){
			this.nav.push(FaqPage);
		}
		else if(pageName == "StockCodeEntryPage"){
			this.nav.setRoot(StockCodeEntryPage);
		}
		else if(pageName == 'EstimationlistPage'){
			this.nav.push(EstimationlistPage);
		}
		else if(pageName == 'SubdesignPage'){
			this.nav.push(SubdesignlistPage);
		}
		else if(pageName == 'CustomorderPage'){
			this.nav.setRoot(CustomorderPage);
		}
		else if(pageName == 'DesignlistPage'){
			this.nav.push(DesignlistPage);
		}
		else if(pageName == 'logout'){
			let confirm = this.alertCtrl.create({
				title: 'Confirm Logout',
				subTitle: 'Are you sure you want to logout!',
				buttons: [
					{
						text: 'Cancel',
						handler: () => {
							console.log('Disagree clicked');
						}
					}, {
						text: 'Ok',
						handler: () => {

							let loader = this.loadingCtrl.create( {
								content: 'Please Wait',
								spinner: 'bubbles',
							} );
							loader.present();

							this.common.logout().then(data=>{

								loader.dismiss();
								localStorage.setItem('logstatus', JSON.stringify(false));
							localStorage.setItem('remember', JSON.stringify(false));
							localStorage.setItem('remember2', JSON.stringify(false));

							this.loginstatus = false;
							this.events.publish('user:changed', false);
							//this.nav.setRoot(HomePage, { st: false });
							this.nav.push( LoginPage );

							},err=>{
								loader.dismiss();

							})

						}
					}
				]
			});
			confirm.present();
		}
	}




	color(no){

		if(no == 1){
				this.page = no;

			this.nav.setRoot( HomePage );

			}
		if(no == 2){
			// if(this.loginstatus == true){
			this.page = no;

		this.nav.push(CategoryPage,{'data':{'name':'Category','id':2},'status':false,'nav':false,'more':false,'supplier':false})

			// }
			// else{
			// 	this.nav.push( LoginPage );

			// }
		}
		if(no == 3){
      this.page = no;
	  let empdata = JSON.parse(localStorage.getItem('empDetail'));
			// if(this.loginstatus == true){
				this.nav.push(SubdesignPage,{'filter':{"Category": [
					{

					  "category_code": '0',
					},

				  ],"Stock Status": [
					{
					  "name": "Open",
					  "count": "-1",
					  "status": true
					}
					],
					"Branch": [
						{
	
						  "id_branch": empdata['id_branch'],
	
						}
					  ],
					'supplier':false
				},
			
				'supplier':false,
				'collect':'tt',
			});

			// this.nav.setRoot(CollectionPage,{'data':{'name':'Collection','id':2},'status':false,'nav':false,'more':false})
		// }
		// else{
		// 	this.nav.push( LoginPage );

		// }
			}
		if(no == 4){
      console.log(no)
      this.page = no;

				// if(this.loginstatus == true){

				// this.nav.setRoot(CusRegisterPage);
				/* this.nav.push(SupsubdesignPage,{'filter':{	},'collect':'tt'}); */
        this.nav.push(CategoryPage,{'data':{'name':'Category','id':2},'status':false,'nav':false,'more':false,'supplier':true})			// }
			// else{
			// 	this.nav.push( LoginPage );

			// }

			}
			if(no == 5){
        this.page = no;
				// if(this.loginstatus == true){

								this.nav.push( AvrsearchPage );

			// }
			// else{
			// 	this.nav.push( LoginPage );

			// }
			}
	}
	direct(){


		this.nav.push( DirectPage, { proid: {}, single: []} );
	}
	openStatusPage(){
		this.nav.push(OrderStatusPage)
	  }

}
