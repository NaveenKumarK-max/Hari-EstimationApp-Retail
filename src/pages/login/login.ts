import { Component, Pipe, PipeTransform, trigger, state, style, transition, animate, keyframes, ElementRef } from '@angular/core';
import { App,NavParams, NavController, Platform, MenuController, Events, LoadingController, ToastController, ViewController, ModalController } from 'ionic-angular';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { CommonProvider } from '../../providers/common';
import { Edittag2Page } from '../edittag2/edittag2';
import { OtpPage } from '../otp/otp';
import { Device } from '@ionic-native/device';
import { AvrsearchPage } from '../avrsearch/avrsearch';
import { EstiPage } from '../estimation/estimation';
import { CategoryPage } from '../category/category';
import { WriteReviewPage } from '../write-review/write-review';
import { CartPage } from '../cart/cart';

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [CommonProvider],


  animations: [
    trigger('myvisibility', [
      state('visible', style({
        opacity: 1
      })),
      state('invisible', style({
        opacity: 0
      })),
      transition('* => *', animate('.5s'))
    ])
  ]

})
export class LoginPage {
  visibleState = 'visible';

  public loginForm: FormGroup;
  public username: AbstractControl;
  public password: AbstractControl;
  // public branchname: AbstractControl;

  public submitted: boolean = false;
  isDisabled: boolean = false;
  getuserLoginURL: string = '';
  errorMessage: string = '';
  public typecheck = 'password';
  public showPass = false;
  remember: any = false;
  currency: any = '';
  id_branch: any = [];
  branch_name: any = '';

  type: any;
  text: any;
  facebook: any;
  user: any = { username: '' };
  emailChanged: boolean = false;
  submitAttempt: boolean = false;
  animateClass = { 'zoom-in': true };

  branch_settings: any;
  login_branch: any;
  branches = [];class="margin"
  cmpName = "";
  remember2: AbstractControl;
  deviceid:any = '';
  constructor(private device: Device,public navParams: NavParams,public appCtrl: App, public viewCtrl: ViewController, public toast: ToastController, private platform: Platform, private builder: FormBuilder, private nav: NavController, private event: Events, private menu: MenuController, private common: CommonProvider, private loadingCtrl: LoadingController, public events: Events, public modal: ModalController,) {


    platform.ready().then(() => {

      console.log(this.device)

    if (this.device.platform === 'browser') {
      console.log('Device UUID is not supported on browser platform');
    } else {
      this.deviceid = this.device.uuid;
      console.log('Device UUID is: ' + this.device.uuid);
    }

    });

    console.log(this.device)
    this.nav = nav;
    this.menu = menu;
    this.platform = platform;


    this.type = "User";
	this.cmpName = this.common.cmpName;

    this.loginForm = builder.group({
      username: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(15)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(16)])],
      id_branch: ['2', this.id_branch != null ? this.id_branch['id_branch'] : null],
      remember2: [false, ''],
      device :this.device['uuid'],
      status:1
    });

    this.username = this.loginForm.controls['username'];
    this.password = this.loginForm.controls['password'];
    this.id_branch = this.loginForm.controls['id_branch'];
    this.remember2 = this.loginForm.controls['remember2'];

    let loader = this.loadingCtrl.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();
    this.common.getCusAppVersion().then((data) => {
      this.branch_settings = data['settings']['branch_settings'];
      this.login_branch = data['settings']['login_branch'];
      localStorage.setItem('versionData', JSON.stringify(data));
      // if(this.branch_settings == 1 && this.login_branch == 1){
      //   this.common.getbranch().then(data=>{
      //     loader.dismiss();
      //     this.branches = data;
      //   })
      // }else{
      //   loader.dismiss();
      // }
      if(this.branch_settings == 1 && this.login_branch == 1){
        this.common.getbranch().then(data=>{
          loader.dismiss();
          this.branches = data;
          let remember = JSON.parse(localStorage.getItem('remember2'));
          console.log(remember)
          if (remember == true) {
            // this.remember2 = true;
            this.loginForm.controls["remember2"].setValue(true);

            this.loginForm.controls["username"].setValue(JSON.parse(localStorage.getItem('remember2value'))['username']);
            this.loginForm.controls["password"].setValue(JSON.parse(localStorage.getItem('remember2value'))['password']);
            this.loginForm.controls["id_branch"].setValue(JSON.parse(localStorage.getItem('remember2value'))['id_branch']);
          }

        })
      }else{
        let remember = JSON.parse(localStorage.getItem('remember2'));
        console.log(remember)

        if (remember == true) {
          // this.remember2 = true;
          this.loginForm.controls["remember2"].setValue(true);

          this.loginForm.controls["username"].setValue(JSON.parse(localStorage.getItem('remember2value'))['username']);
          this.loginForm.controls["password"].setValue(JSON.parse(localStorage.getItem('remember2value'))['password']);
          this.loginForm.controls["id_branch"].setValue(this.login_branch);
        }
        loader.dismiss();
      }
    });

  }

  public onSubmit(values: Object): void {
    // this.nav.setRoot(EstiPage);
  //   let modal = this.modal.create(WriteReviewPage,{'data':'data'},{
  //     cssClass: "my-modal"
  // })
  //   modal.present();
   values['device'] =  this.device.uuid;
   
 //  values['device'] = '1111111';
  values['model'] =  this.device.model;
  values['manufacturer'] =  this.device.manufacturer;

    var hasBranch = (this.branch_settings == 1 && this.login_branch == 1) ? true : false;
    this.submitted = true;
    if (hasBranch == false) { // Remove validation for Branch (No branch required for login)
    /*  this.loginForm.controls["branchname"].setValidators(null);
      this.loginForm.controls["branchname"].updateValueAndValidity();*/
    }
    if (this.loginForm.valid) {
        this.errorMessage = 'Logging in...';
        this.isDisabled = true;
        let loader = this.loadingCtrl.create({
          content: 'Please Wait',
          spinner: 'bubbles',
        });
        loader.present();
        this.common.doLogin(JSON.stringify(values)).then(res => {
          if (res) {
            if (res.result) {
                localStorage.setItem('remember', JSON.stringify(this.remember));
                if (res.type == "logged") { // Employee Logged In
                  localStorage.setItem('remember2', JSON.stringify(this.loginForm.get('remember2').value));
                  localStorage.setItem('remember2value', JSON.stringify(values));
                    localStorage.setItem('userdet', JSON.stringify(values)); // Login details
                    console.log(values)

                    console.log(JSON.parse(localStorage.getItem('remember2value')))
                    res.empdata['id_branch'] = JSON.parse(localStorage.getItem('remember2value'))['id_branch'];
                    let bname:any[] = this.branches.filter(data=>data['id_branch'] == res.empdata['id_branch']);
                    res.empdata['branch_name'] = bname.length > 0 ? bname[0]['name'] : res.empdata['branch_name'];
                    console.log(res.empdata);
                    localStorage.setItem('empDetail', JSON.stringify(res.empdata)); // Employee Details
                    localStorage.setItem('logstatus', JSON.stringify(true));
                    this.event.publish('user:changed', true);
                    this.nav.setRoot(Edittag2Page);
                }
                else if (res.type == "otp") { // OTP Required for Employee Log In [Redirect to OTP page]
                  this.nav.setRoot(OtpPage,{ userdet: values, page: 'loginOTP',otpDetail: res });
                }
            } else {
                this.errorMessage = res.msg;
                let ctrl = this.toast.create({
                  message: res.msg,
                  duration: this.common.toastTimeout,
                  position: 'bottom'
                });
                ctrl.present();
                this.isDisabled = false;
            }
            loader.dismiss();
          }
        }, error => {
          this.isDisabled = false;
          loader.dismiss();
        });
      }
      else { // Invalid Form Submit
        if(!this.loginForm.get('username').valid){
          let ctrl = this.toast.create({
            message: 'Please Enter Username Minimum 5 & Maximum 15 letters',
            duration: this.common.toastTimeout,
            position: 'bottom'
          });
          ctrl.present();
        }
        else{
        if(!this.loginForm.get('password').valid){
          let ctrl = this.toast.create({
            message: 'Please Enter Password Minimum 8 & Maximum 16 letters',
            duration: this.common.toastTimeout,
            position: 'bottom'
          });
          ctrl.present();
        }
      }
      }
    }

  updateremember(value) {
    this.remember = value;
    console.log(this.remember);
  }

  login() {
    this.nav.setRoot(LoginPage) //navigate to Edittag2Page
  }
  skip() {
    this.nav.setRoot(Edittag2Page) //navigate to Edittag2Page
  }

  /*openmodal() {
    let mod = this.modal.create(BranchPage)
    mod.present();
    mod.onDidDismiss(data => {
      if (data != undefined) {
        this.loginForm.controls['branchname'].setValue(data['name']);
        this.loginForm.controls['id_branch'].setValue(data['id_branch']);
      }
    });
  }*/

  showPassword() {
    this.showPass = !this.showPass;
    if (this.showPass) {
      this.typecheck = 'text';
    } else {
      this.typecheck = 'password';
    }
  }

  /* for footer as hide in default. it's assigned in app.components.ts */
  ionViewWillEnter() {
    let user = false;
    this.events.publish('user:created', user);
    this.events.publish('lp', false);

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
    this.events.publish('lp', true);

    // If you have more than one side menu, use the id like below
    // this.menu.swipeEnable(true, 'menu1');
  }

  toggleVisible() {
    this.visibleState = (this.visibleState == 'visible') ? 'invisible' : 'visible';
  }
  updateremember2(value) {
    // this.remember2 = value;
    this.loginForm.controls["remember2"].setValue(value);

    console.log(value);
  }
  open(){
    this.nav.push( AvrsearchPage );

  }
}



