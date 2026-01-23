import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { CommonProvider } from '../../providers/common';
import { HomePage } from '../home/home';

/**
 * Generated class for the OtpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html',
  providers: [CommonProvider]

})
export class OtpPage {

  temp: any = { "sys_otp": '', "sys_otp_exp": "", "input_otp": "" };
  msg: any = '';
  page = this.navParams.get('page');
  postdata: any = '';
  userdet = this.navParams.get('userdet');
  otpDetails = this.navParams.get('otpDetail');

  constructor(private event: Events, private nav: NavController, public toast: ToastController, public load: LoadingController, public common: CommonProvider, public navCtrl: NavController, public navParams: NavParams) {
    console.log("OTP Page : "+this.page);
    console.log(this.userdet);
    console.log(this.otpDetails);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OtpPage');
  }

  sign() {
    this.navCtrl.push(LoginPage)
  }

  submit() {
    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();
      if (this.navParams.get('page') == 'loginOTP') {
        this.postdata = {
          'username': this.userdet['username'],
          'password': this.userdet['password'],
          'sys_otp_exp': this.otpDetails['otp']['sys_otp_exp'],
          'input_otp': this.temp['input_otp'],
          'sys_otp': this.otpDetails['otp']['otp_code'],
          'id_branch': this.userdet['id_branch']
        };
        this.common.verifyLoginOTP(this.postdata).then(data => { 
            let ctrl = this.toast.create({
              message: data['msg'],
              duration: this.common.toastTimeout,
              position: 'bottom'
            });
            ctrl.present();
            if (data.result) {
              if (data.type == "logged") { // Employee Logged In
                  localStorage.setItem('userdet', JSON.stringify(this.userdet)); // Login details
                  localStorage.setItem('empDetail', JSON.stringify(data.empdata)); // Employee Details
                  localStorage.setItem('logstatus', JSON.stringify(true));
                  this.event.publish('user:changed', true, data.empdata);
                  loader.dismiss();
                  this.nav.setRoot(HomePage);
              }
            }
            else {
              this.msg = data['msg'];
              loader.dismiss();
            }           
        })
      }
      else {
        this.msg = "Invalid Page";
        loader.dismiss();
      }
  }
  resend() {
    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();

    /*if (this.navParams.get('page') == 'old') {
       this.common.generateotp(this.navParams.get('data'), '').then(data => {

        this.temp['sysotp'] = data['otp']
        this.temp['last_otp_expiry'] = data['expiry']
        loader.dismiss();
      })
    }*/

  }
}
