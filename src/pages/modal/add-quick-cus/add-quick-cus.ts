// import { Component } from '@angular/core';
// import { IonicPage, NavController, NavParams,ViewController,LoadingController,ModalController,ToastController } from 'ionic-angular';
// import { CommonProvider } from '../../../providers/common';
// import { CusSearchPage } from '../customer/customer';
// import { CountrymodelPage } from '../countrymodel/countrymodel';

// /**
//  * Generated class for the AddQuickCus page.
//  *
//  * See https://ionicframework.com/docs/components/#navigation for more info on
//  * Ionic pages and navigation.
//  */

// // @IonicPage()
// @Component({
//   selector: 'page-add-quick-cus',
//   templateUrl: 'add-quick-cus.html',
//   providers: [CommonProvider]

// })
// export class AddQuickCus {

//   page;
//   empData = JSON.parse(localStorage.getItem('empDetail'));
//   askBranch = 0;
//   loggedInBranch;
//   branches = [];
//   cusData = {"cus_type" : 0,'mobile':''};
//   errorMsg = "";
//   village = [];
//   city: any = [];
//   gstPattern:any = /^([0-9]{2}[a-zA-Z]{4}([a-zA-Z]{1}|[0-9]{1})[0-9]{4}[a-zA-Z]{1}([a-zA-Z]|[0-9]){3}){0,15}$/;
//   result  = true;
//   // regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

//   constructor(public toast:ToastController,public load:LoadingController, public common:CommonProvider,public viewCtrl: ViewController,public navCtrl: NavController, public navParams: NavParams,  public modal: ModalController) {


//     this.common.getVillages().then(data => {
//       this.village = data;
//       console.log(this.village);
//     })
//     this.common.getcity('35').then(data => {

//       this.city = data;
//       this.cusData['cityname'] = 'Palani';
//       this.cusData['id_city'] = '4065';
//     })

//     this.page = this.navParams.get('page');
//     this.loggedInBranch = this.empData['id_branch'];
//     console.log(this.loggedInBranch)
//     console.log(this.navParams.get('askBranch'))
//     console.log(this.empData['branch_settings'])
//     if(this.page == "esti"){
//       this.askBranch = this.navParams.get('askBranch');
//       this.branches = this.navParams.get('branches');
//     }else{
//       let loader = this.load.create({
//         content: 'Please Wait',
//         spinner: 'bubbles',
//       });
//       loader.present();
//       if((this.loggedInBranch == 0 || this.loggedInBranch == '' || this.loggedInBranch == null) && this.empData['branch_settings'] == 1){
//         this.askBranch = 1;
//         this.common.getbranch().then(data=>{
//           this.branches = data;
//           loader.dismiss();
//         })
//       }else{
//         loader.dismiss();
//       }
//     }

//   }
//   close(){

//     this.viewCtrl.dismiss();
//   }
//   proceed(){
//     if(this.cusData['mobile'].length == 10){

//     if(this.cusData['id_customer'] > 0){
//       this.viewCtrl.dismiss(this.cusData);
//     }else{
//       this.createQuickCus();
//     }
//   }
//   else{
//     this.errorMsg = "Please Enter Valid Mobile Number";
//     setTimeout(()=>{
//       this.errorMsg = "";
//     },this.common.msgTimeout);
//   }
//   }

//   createQuickCus(){
//     console.log(this.result)
//     if(this.result){
//       let loader = this.load.create({
//         content: 'Please Wait',
//         spinner: 'bubbles',
//       });
//       loader.present();
//       this.cusData['id_branch'] = this.loggedInBranch;
//       this.common.createQuickCustomer(this.cusData).then(res => {
//         if (res) {
//           if (res.success) {
//             console.log(res.response)
//             this.cusData = res.response;
//             this.viewCtrl.dismiss(this.cusData);
//           } else {
//             this.errorMsg = res.message;
//             setTimeout(()=>{
//               this.errorMsg = "";
//             },this.common.msgTimeout);
//           }
//           loader.dismiss();
//         }
//       }, error => {
//         loader.dismiss();
//       });

//     }
//       else {
//         console.log('gst');
//         let toast = this.toast.create({
//           message: 'Please Enter Correct Gst Number',
//           position: 'bottom',

//           duration: 6000
//         });
//         toast.present();

//     }

//   }

//   openCusModal() {
//     let modal = this.modal.create(CusSearchPage)
//     modal.present();
//     modal.onDidDismiss(mData => {
//       if(mData != null){
//         this.cusData = mData;
//         this.cusData['customer'] = mData['label'];
//       }
//     });
//   }

//   getmodal(name, details) {
//     let mod = this.modal.create(CountrymodelPage, { data: details, name: name })
//     mod.present();
//     mod.onDidDismiss((mData, name) => {
//       if (mData != undefined) {
//         let loader = this.load.create({
//           content: 'Please Wait',
//           spinner: 'bubbles',
//         });
//         loader.present();
//         if (name == 'Village') {
//           this.cusData['village_name'] = mData['village_name'];
//           this.cusData['id_village'] = mData['id_village'];
//           loader.dismiss();
//         }
//         if (name == 'City') {
//           this.cusData['cityname'] = mData['name'];
//           this.cusData['id_city'] = mData['id_city'];
//           console.log(this.cusData['cityname'])
//           loader.dismiss();
//         }
//       }

//     });

//   }

//   ionViewDidLoad() {
//     console.log('ionViewDidLoad AddQuickCus');
//   }
//   validateCaptilize(e) {

//       this.cusData['gst_number'] = e.toUpperCase();
//       this.usertypecheck();

//   }
//   usertypecheck(){
//     console.log('******')

//     if(this.cusData['cus_type'] == 2){

//        this.result = this.gstPattern.test(this.cusData['gst_number']);

//     }
//     else if(this.cusData['cus_type'] == 1){

//       this.result = true;
//     }

//   }

// }


import { Component, Pipe, PipeTransform, trigger, state, style, transition, animate, keyframes, ElementRef, ViewChild } from '@angular/core';
import { NavController, Platform, MenuController, Events, LoadingController, ToastController, ModalController, Content,ViewController } from 'ionic-angular';
import { Toast, Diagnostic, NativeStorage } from 'ionic-native';
import { FormGroup, AbstractControl, FormBuilder, Validators,FormArray } from '@angular/forms';
import { CommonProvider } from '../../../providers/common';
import { DatePicker } from '@ionic-native/date-picker';

import { CountrymodelPage } from '../../modal/countrymodel/countrymodel';
import { HomePage } from '../../home/home';



/*
  Generated class for the Register page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-add-quick-cus',
    templateUrl: 'add-quick-cus.html',
    providers: [CommonProvider]
})
export class AddQuickCus {
  @ViewChild(Content) content: Content;
  public registerForm: FormGroup;
  public mobile: AbstractControl;
  public passwd: AbstractControl;
  public cpasswd: AbstractControl;
  public firstname: AbstractControl;
  public relation_name: AbstractControl;
  public branchname: AbstractControl;
  public countryname: AbstractControl;
  public statename: AbstractControl;
  public cityname: AbstractControl;
  public village_name: AbstractControl;
  public id_country: AbstractControl;
  public id_state: AbstractControl;
  public id_city: AbstractControl;
  public id_village: AbstractControl;
  public email: AbstractControl;

  public nominee_name: AbstractControl;
  public nominee_relationship: AbstractControl;
  public nominee_mobile: AbstractControl;
  public company_name: AbstractControl;
  public gst_number: AbstractControl;
  public pan: AbstractControl;
  public voterid: AbstractControl;
  public rationcard: AbstractControl;
  public comments: AbstractControl;

  public marital_status: AbstractControl;
  public spouse_name: AbstractControl;
  public spouse_dob: AbstractControl;
 // public spouse_wed: AbstractControl;

  public child_name: AbstractControl;
  public child_dob: AbstractControl;

  public relation_type: AbstractControl;
  public refperson: AbstractControl;
  public refmobile: AbstractControl;
  public is_vip:AbstractControl;



  type = "p";
  count = 0;
  animateClass = { 'zoom-in': true };
  countries = [];
  states = [];
  cities = [];
  public submitted: boolean = false;
  isDisabled: boolean = false;
  errorMessage: string = '';
  public typechecknew = 'password';
  public showPassnew = false;
  public typecheckconfirm = 'password';
  public showPassconfirm = false;
  reg: any = /^[a-zA-Z ]*$/;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  gstPattern = "^([0-9]{2}[a-zA-Z]{4}([a-zA-Z]{1}|[0-9]{1})[0-9]{4}[a-zA-Z]{1}([a-zA-Z]|[0-9]){3}){0,15}$";
  panPattern = "^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$";
  votterPattern = "^([a-zA-Z]){3}([0-9]){7}?$";
  rationPattern = "^([a-zA-Z0-9]){8,12}\s*$";
  passportPattern = "^[A-PR-WY][1-9]\\d\\s?\\d{4}[1-9]$";
  pwd: any = false;
  accept: any = false;
  deviceid = JSON.parse(localStorage.getItem('DeviceData'));
  branch_name: any = '';
  branchid: any = '';
  branch_settings: any = '';
  is_branchwise_cus_reg: any = '';
  id_branch: any = '';
  details: any = { 'countryname': 'India', 'id_country': '101', 'statename': '', 'id_state': '', 'cityname': '', 'id_city': '' };
  country: any[] = [];
  state: any = [];
  city: any = [];
  village: any = [];
  address1: any = '';
  address2: any = '';
  passport:any='';
  dl_number:any='';
  pincode: any = [];
  religion: any = [];
  gender: any = [];
  cus_type: any = [];
  date_of_birth: any = [];
  date_of_wed: any = [];


  selected =0;
  showinput:any = false;


  empData = JSON.parse(localStorage.getItem('empDetail'));

  childrendata: FormArray;
  pincode_show: any;

  constructor(public viewCtrl:ViewController,private datePicker: DatePicker, private platform: Platform, private builder: FormBuilder, private nav: NavController, private events: Events, private menu: MenuController, private commonservice: CommonProvider, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private event: Events, public modal: ModalController, public common: CommonProvider) {

    console.log(this.empData);
    console.log(JSON.parse(localStorage.getItem('empDetail'))['idcity']);
    console.log(JSON.parse(localStorage.getItem('empDetail'))['cityname']);
    console.log(JSON.parse(localStorage.getItem('empDetail'))['idstate']);
    console.log(JSON.parse(localStorage.getItem('empDetail'))['statename']);
    console.log(JSON.parse(localStorage.getItem('empDetail'))['idcountry']);
    console.log(JSON.parse(localStorage.getItem('empDetail'))['countryname']);

    this.nav = nav;
    this.menu = menu;
    this.platform = platform;

    this.registerForm = builder.group({
      'is_vip': [0, Validators.compose([Validators.required])],
      'firstname': ['', Validators.compose([Validators.required])],
      'relation_name': [''],
      'relation_type': [''],
      'mobile': ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      'email': ['', Validators.compose([Validators.pattern(this.emailPattern)])],
      // 'passwd': ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(16)])],
      // 'cpasswd': ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(16)])],
      'address1': ['', Validators.compose([Validators.required]),this.address1 != null ? this.address1['address1'] : null],
      'address2': this.address2 != null ? this.address1['address2'] : null,
      'passport':['',Validators.compose([Validators.pattern(this.passportPattern)])],
      'dl_number':[''],
      'pincode': ['', Validators.compose([Validators.required,Validators.minLength(6)]), this.pincode != null ? this.pincode['pincode'] : null],
      'religion': this.religion != null ? this.religion['religion'] : null,
      'gender': this.gender != null ? this.gender['gender'] : null,
      // 'cus_type': this.cus_type != null ? this.cus_type['cus_type'] : null,
      'cus_type': 1,

      'date_of_birth': this.date_of_birth != null ? this.date_of_birth['date_of_birth'] : null,
      'date_of_wed': this.date_of_wed != null ? this.date_of_wed['date_of_wed'] : null,
      'countryname': this.details['countryname'],
      'id_country': this.details['id_country'],
      'statename': this.details['statename'],
      'id_state': this.details['id_state'],
      'cityname': this.details['cityname'],
      'id_city': this.details['id_city'],
      'village_name': ['', this.village_name != null ? this.village_name['village_name'] : null],
      'id_village': this.details['id_village'],
      //  'branchname': ['', Validators.compose([Validators.required]), this.branchname != null ? this.branchname['branchname'] : null],
      'id_branch': this.empData['id_branch'] != null ? this.empData['id_branch'] : null,

      'nominee_name': this.nominee_name != null ? this.nominee_name['nominee_name'] : null,
      'nominee_relationship': this.nominee_relationship != null ? this.nominee_relationship['nominee_relationship'] : null,
      'nominee_mobile': this.nominee_mobile != null ? this.nominee_mobile['nominee_mobile'] : null,
      'company_name': this.company_name != null ? this.company_name['company_name'] : null,
      'gst_number': ['', Validators.compose([Validators.pattern(this.gstPattern)]), this.gst_number != null ? this.gst_number['gst_number'] : null],
      'pan': ['', Validators.compose([Validators.pattern(this.panPattern)]), this.pan != null ? this.pan['pan'] : null],
      'voterid': ['', Validators.compose([Validators.pattern(this.votterPattern)]), this.voterid != null ? this.voterid['voterid'] : null],
      'rationcard': ['', Validators.compose([Validators.pattern(this.rationPattern)]), this.rationcard != null ? this.rationcard['rationcard'] : null],

      //'pan': this.pan != null ? this.pan['pan'] : null,
      // 'voterid': this.voterid != null ? this.voterid['voterid'] : null,
      //'rationcard': this.rationcard != null ? this.rationcard['rationcard'] : null,
      'comments': this.comments != null ? this.comments['comments'] : null,

      'marital_status': this.marital_status != null ? this.marital_status['marital_status'] : null,
      'spouse_name': this.spouse_name != null ? this.spouse_name['spouse_name'] : null,
      'spouse_dob': this.spouse_dob != null ? this.spouse_dob['spouse_dob'] : null,
    //  'spouse_wed': this.spouse_wed != null ? this.spouse_wed['spouse_wed'] : null,

      childrendata: new FormArray([]),
      'refperson': this.details['refperson'],
      'refmobile': this.details['refmobile'],

    },
    );

    this.add();

    this.firstname = this.registerForm.controls['firstname'];
    this.relation_name = this.registerForm.controls['relation_name'];
    this.relation_type = this.registerForm.controls['relation_type'];

    this.mobile = this.registerForm.controls['mobile'];
    this.email = this.registerForm.controls['email'];
    // this.passwd = this.registerForm.controls['passwd'];
    // this.cpasswd = this.registerForm.controls['cpasswd'];
    this.address1 = this.registerForm.controls['address1'];
    this.address2 = this.registerForm.controls['address2'];
    this.passport = this.registerForm.controls['passport'];
    this.dl_number = this.registerForm.controls['dl_number'];
    this.pincode = this.registerForm.controls['pincode'];
    this.religion = this.registerForm.controls['religion'];
    this.gender = this.registerForm.controls['gender'];
    this.cus_type = this.registerForm.controls['cus_type'];
    this.date_of_birth = this.registerForm.controls['date_of_birth'];
    this.date_of_wed = this.registerForm.controls['date_of_wed'];

    this.countryname = this.registerForm.controls['countryname'];
    this.statename = this.registerForm.controls['statename'];
    this.cityname = this.registerForm.controls['cityname'];
    this.village_name = this.registerForm.controls['village_name'];
    this.id_country = this.registerForm.controls['id_country'];
    this.id_state = this.registerForm.controls['id_state'];
    this.id_city = this.registerForm.controls['id_city'];
    this.id_village = this.registerForm.controls['id_village'];

    this.branchname = this.registerForm.controls['branchname'];
    this.id_branch = this.empData['id_branch'];

    this.nominee_name = this.registerForm.controls['nominee_name'];
    this.nominee_relationship = this.registerForm.controls['nominee_relationship'];
    this.nominee_mobile = this.registerForm.controls['nominee_mobile'];
    this.company_name = this.registerForm.controls['company_name'];
    this.nominee_name = this.registerForm.controls['nominee_name'];
    this.gst_number = this.registerForm.controls['gst_number'];
    this.pan = this.registerForm.controls['pan'];
    this.voterid = this.registerForm.controls['voterid'];
    this.rationcard = this.registerForm.controls['rationcard'];
    this.comments = this.registerForm.controls['comments'];

    this.marital_status = this.registerForm.controls['marital_status'];
    this.spouse_name = this.registerForm.controls['spouse_name'];
    this.spouse_dob = this.registerForm.controls['spouse_dob'];
 //   this.spouse_wed = this.registerForm.controls['spouse_wed'];
 this.refperson = this.registerForm.controls['refperson'];
 this.refmobile = this.registerForm.controls['refmobile'];
this.is_vip = this.registerForm.controls['is_vip'];



    let loader = this.loadingCtrl.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();

/*     this.common.getcountry().then(data => {
      this.country = data;
      this.common.getstate(this.details['id_country']).then(data => {
        this.registerForm.controls['countryname'].setValue(this.details['countryname']);
        this.registerForm.controls['id_country'].setValue(this.details['id_country']);
        this.state = data;
        this.common.getcity(this.details['id_state']).then(data => {
          this.registerForm.controls['statename'].setValue(this.details['statename']);
          this.registerForm.controls['id_state'].setValue(this.details['id_state']);

          this.registerForm.controls['cityname'].setValue(this.details['cityname']);
          this.registerForm.controls['id_city'].setValue(this.details['id_city']);
          this.city = data;
          loader.dismiss();

        })
      })

    })

    this.common.getVillages().then(data => {
      this.village = data;
      console.log(this.village);
    })
 */

    this.common.getcountry().then(countryData => {
      this.country = countryData;
      let selectedCountryId = this.details['id_country']; // Default to details

      let defaultCountry = this.country.find(c => c.is_default == "1");

      if (defaultCountry) {
        console.log("Default Country ID:", defaultCountry.id_country);
        this.registerForm.controls['countryname'].setValue(defaultCountry.name);
        this.registerForm.controls['id_country'].setValue(defaultCountry.id_country);
        selectedCountryId = defaultCountry.id_country; // Use default country if found
      } else {
        console.log("Using details country ID:", this.details['id_country']);
        this.registerForm.controls['countryname'].setValue(this.details['countryname']);
        this.registerForm.controls['id_country'].setValue(this.details['id_country']);
      }

      console.log("Final id_country for getstate():", selectedCountryId);

      // Ensure valid id_country before calling getstate()
      if (selectedCountryId) {
        this.common.getstate(selectedCountryId).then(stateData => {
          this.state = stateData;
          let selectedStateId = this.details['id_state']; // Default to details

          let defaultState = this.state.find(s => s.is_default == "1");

          if (defaultState) {
            console.log("Default State ID:", defaultState.id_state);
            this.registerForm.controls['statename'].setValue(defaultState.name);
            this.registerForm.controls['id_state'].setValue(defaultState.id_state);
            selectedStateId = defaultState.id_state;
          } else {
            console.log("Using details state ID:", this.details['id_state']);
            this.registerForm.controls['statename'].setValue(this.details['statename']);
            this.registerForm.controls['id_state'].setValue(this.details['id_state']);
          }

          console.log("Final id_state for getcity():", selectedStateId);

          // Ensure valid id_state before calling getcity()
          if (selectedStateId) {
            this.common.getcity(selectedStateId).then(cityData => {
              this.city = cityData;
              let defaultCity = this.city.find(c => c.is_default == "1");

              if (defaultCity) {
                this.registerForm.controls['cityname'].setValue(defaultCity.name);
                this.registerForm.controls['id_city'].setValue(defaultCity.id_city);
              } else {
                this.registerForm.controls['cityname'].setValue(this.details['cityname']);
                this.registerForm.controls['id_city'].setValue(this.details['id_city']);
              }

              loader.dismiss();
            });
          } else {
            console.warn("id_state is empty, cannot fetch cities!");
          }
        });
      } else {
        console.warn("id_country is empty, cannot fetch states!");
      }
    });

  }


  newchild(): FormGroup {
    return this.builder.group({
      'child_name': this.child_name != null ? this.child_name['child_name'] : null,
      'child_dob': this.child_dob != null ? this.child_dob['child_dob'] : null
    })
  }

  add(){
    this.childrendata = this.registerForm.get('childrendata') as FormArray;
    this.childrendata.push(this.newchild());
  }

  delete(i){

    this.childrendata.removeAt(i);

  }

  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    console.log('1111111')
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        // this.errorMessage = 'PasswordMismatch';

        this.pwd = true;
        return passwordConfirmationInput.setErrors({ notEquivalent: true })
      }
      else {
        // this.errorMessage = '';
        this.pwd = false;
        return passwordConfirmationInput.setErrors(null);
      }
    }
  }
  ionViewDidLoad() {

  }
  segmentChanged(e) {
    this.content.scrollToTop();
  }
  next(e) {
    this.type = 'o';
    this.content.scrollToTop();
  }
  validateCaptilize(e, type) {
    console.log(e['value']);
    console.log(type);
    console.log((e['value']).toUpperCase());
    if (type == 'gstno') {
      this.registerForm.controls['gst_number'].setValue(e['value'].toUpperCase());
      if (this.registerForm.controls['gst_number'].value.length > 15) {
        let v:any = this.registerForm.controls['gst_number'].value.slice(0, 15);
        this.registerForm.controls['gst_number'].setValue(v.toUpperCase());

      }
    } else if (type == 'pancard') {
      this.registerForm.controls['pan'].setValue(e['value'].toUpperCase());
      if (this.registerForm.controls['pan'].value.length > 10) {
        let v:any = this.registerForm.controls['pan'].value.slice(0, 10);
        this.registerForm.controls['pan'].setValue(v.toUpperCase());

      }
    } else if (type == 'voter') {
      this.registerForm.controls['voterid'].setValue(e['value'].toUpperCase());

      if (this.registerForm.controls['voterid'].value.length > 10) {
        let v:any = this.registerForm.controls['voterid'].value.slice(0, 10);
        this.registerForm.controls['voterid'].setValue(v.toUpperCase());

      }
      else if (type == 'dl_num') {
        if (this.registerForm.controls['dl_number'].value.length > 15) {
          let v: any = this.registerForm.controls['dl_number'].value.slice(0, 15);
          this.registerForm.controls['dl_number'].setValue(v.toUpperCase());
        }
      }
      else if (type == 'refermob') {
        if (this.registerForm.controls['refmobile'].value.length > 10) {
          let v: any = this.registerForm.controls['refmobile'].value.slice(0, 10);
          this.registerForm.controls['refmobile'].setValue(v.toUpperCase());
        }
      }
    } else {
      if (type == 'ration') {
        this.registerForm.controls['rationcard'].setValue(e['value'].toUpperCase());
      }

    }


  }


  /* for footer as hide in default. it's assigned in app.components.ts */
  ionViewWillEnter() {
    let user = false;
    this.events.publish('user:created', user);
    this.events.publish( 'entered', true );
    this.events.publish( 'pageno', 1 );
  }

  shownewPassword() {
    this.showPassnew = !this.showPassnew;

    if (this.showPassnew) {
      this.typechecknew = 'text';
    } else {
      this.typechecknew = 'password';
    }
  }
  showconfirmPassword() {
    this.showPassconfirm = !this.showPassconfirm;

    if (this.showPassconfirm) {
      this.typecheckconfirm = 'text';
    } else {
      this.typecheckconfirm = 'password';
    }
  }

  birth(type,index) {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(date => {

      var ddd = date.getDate();
      var mmm = date.getMonth() + 1;
      var yy = date.getFullYear();
      //var today = new Date(yy+"-"+mmm+"-"+ddd).toISOString().substring(0, 10);
      var today = date.toISOString().substring(0, 10);
      //this.fromdate= today;
      this.details['date_of_birth'] = yy + "-" + mmm + "-" + ddd;
      this.details['spouse_dob'] = yy + "-" + mmm + "-" + ddd;
      this.details['child_dob'] = yy + "-" + mmm + "-" + ddd;

      if(type =='common'){
        this.registerForm.controls['date_of_birth'].setValue(ddd + "-" + mmm + "-" + yy);
      }else if(type =='spouse'){
        this.registerForm.controls['spouse_dob'].setValue(ddd + "-" + mmm + "-" + yy);
      }else{
        ((this.registerForm.get('childrendata') as FormArray).at(index) as FormGroup).get('child_dob').patchValue(ddd + "-" + mmm + "-" + yy);
      }


      // console.log( this.productdet.due_date)
    });
  }
  wed(type) {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(date => {

      var ddd = date.getDate();
      var mmm = date.getMonth() + 1;
      var yy = date.getFullYear();
      //var today = new Date(yy+"-"+mmm+"-"+ddd).toISOString().substring(0, 10);
      var today = date.toISOString().substring(0, 10);
      //this.fromdate= today;
      this.details.date_of_wed = yy + "-" + mmm + "-" + ddd;
    //  this.details.spouse_wed = yy + "-" + mmm + "-" + ddd;
     // this.registerForm.controls['date_of_wed'].setValue(yy + "-" + mmm + "-" + ddd);
     this.registerForm.controls['date_of_wed'].setValue(ddd + "-" + mmm + "-" + yy);

      // console.log( this.productdet.due_date)
    });
  }

  onSelectChange(selectedValue: any){
    console.log(selectedValue)
    this.selected = selectedValue;
    console.log(this.selected);

  }



  public onSubmit(values: any): void {
    console.log(this.registerForm);
    console.log(values);

    /*     var proceed = (this.branch_settings == 1 && this.is_branchwise_cus_reg == 1) ? true : false;
        console.log(proceed);
     */
if(this.registerForm.get('is_vip').valid){
    if (this.registerForm.get('firstname').valid) {
      if (this.registerForm.get('email').valid) {
      if (this.registerForm.get('mobile').valid) {
        // if (this.registerForm.get('passwd').valid && this.registerForm.get('cpasswd').valid && this.registerForm.controls['passwd'].value == this.registerForm.controls['cpasswd'].value) {

        if (this.registerForm.controls['pincode'].valid) {
          if (this.registerForm.controls['address1'].valid) {
            if(this.registerForm.controls['passport'].valid){
          if (this.registerForm.controls['gst_number'].valid) {
            if (this.registerForm.controls['pan'].valid) {
              if (this.registerForm.controls['voterid'].valid) {
                if (this.registerForm.controls['rationcard'].valid) {
                  this.errorMessage = 'Doing Register...';
                  this.isDisabled = true;
                  let loader = this.loadingCtrl.create({
                    content: 'Please Wait',
                    spinner: 'bubbles',
                  });
                  loader.present();
                  let postData = Object.assign({}, values);
                  console.log(JSON.stringify(postData));

                  this.commonservice.createCustomer(JSON.stringify(postData)).then(res => {
                    if (res) {
                      console.log(res);

                      if (res['status']) {
                        let toast = this.toastCtrl.create({
                          message: res.msg,
                          duration: 6000
                        });
                        toast.present();
                                    this.viewCtrl.dismiss(res.response);
                      } else {
                        let toast = this.toastCtrl.create({
                          message: res.msg,
                          duration: 6000
                        });
                        toast.present();

                        this.errorMessage = res.msg;
                        this.isDisabled = false;
                      }
                      loader.dismiss();
                    }
                  }, error => {
                    this.isDisabled = false;
                    loader.dismiss();
                  });
                }
                else {
                  console.log('ration');
                  let toast = this.toastCtrl.create({
                    message: 'Please Enter Correct RationCard',
                    position: 'bottom',

                    duration: 6000
                  });
                  toast.present();
                }
              }
              else {
                console.log('voter id');
                let toast = this.toastCtrl.create({
                  message: 'Please Enter Correct VoterCard',
                  position: 'bottom',

                  duration: 6000
                });
                toast.present();
              }
            }
            else {
              console.log('pan');
              let toast = this.toastCtrl.create({
                message: 'Please Enter Correct PanCard',
                position: 'bottom',

                duration: 6000
              });
              toast.present();
            }
          }
          else {
            console.log('gst');
            let toast = this.toastCtrl.create({
              message: 'Please Enter Correct Gst Number',
              position: 'bottom',

              duration: 6000
            });
            toast.present();
          }
        }else{
          console.log('passport');
          let toast = this.toastCtrl.create({
            message: 'Please Enter Passport Details',
            position: 'bottom',

            duration: 6000
          });
          toast.present();
        }
          }
          else {
            console.log('village');
            let toast = this.toastCtrl.create({
              message: 'Please Enter Address',
              position: 'bottom',

              duration: 6000
            });
            toast.present();
          }
        }

        else {
          console.log('tc');
          let toast = this.toastCtrl.create({
            message: 'Enter Valid Pincode',
            position: 'bottom',

            duration: 6000
          });
          toast.present();
        }



        // }
        // else {

        //   if (this.registerForm.controls['passwd'].value != this.registerForm.controls['cpasswd'].value) {

        //     let toast = this.toastCtrl.create({
        //       message: 'Password and Confirm Password Mismatch',
        //       position: 'bottom',

        //       duration: 6000
        //     });
        //     toast.present();
        //   }
        //   else {


        //     let toast = this.toastCtrl.create({
        //       message: 'Minimum 8 to 16 Characters Only Allowed',
        //       position: 'bottom',

        //       duration: 6000
        //     });
        //     toast.present();
        //   }

        // }

      }
      else {
        let toast = this.toastCtrl.create({
          message: ' Enter Valid Mobile Number',
          position: 'bottom',

          duration: 6000
        });
        toast.present();

      }
      }
      else {
        let toast = this.toastCtrl.create({
          message: 'Enter Valid Email Id',
          position: 'bottom',

          duration: 6000
        });
        toast.present();
      }
    }
    else {
      let toast = this.toastCtrl.create({
        message: 'FirstName Must Contain Alphabets Only',
        position: 'bottom',

        duration: 6000
      });
      toast.present();
    }
  }else{
       let toast = this.toastCtrl.create({
        message: 'Please Select VIP',
        position: 'bottom',

        duration: 6000
      });
      toast.present();
  }
  }

  scrollToTop() {
    this.content.scrollToTop();
  }
  close(){

        this.viewCtrl.dismiss();
      }
  getmodal(name, details) {
    let mod = this.modal.create(CountrymodelPage, { data: details, name: name })
    mod.present();
    mod.onDidDismiss((dataa, name) => {
      if (dataa != undefined) {
        let loader = this.loadingCtrl.create({
          content: 'Please Wait',
          spinner: 'bubbles',
        });
        loader.present();
        if (name == 'Country') {
          this.common.getstate(dataa['id_country']).then(data => {
            this.registerForm.controls['countryname'].setValue(dataa['name']);
            this.registerForm.controls['id_country'].setValue(dataa['id_country']);
            this.state = data;
            loader.dismiss();
          })
        }
        if (name == 'State') {
          this.common.getcity(dataa['id_state']).then(data => {
            this.registerForm.controls['statename'].setValue(dataa['name']);
            this.registerForm.controls['id_state'].setValue(dataa['id_state']);
            this.registerForm.controls['cityname'].setValue('');
            this.registerForm.controls['id_city'].setValue('');
            this.city = data;
            loader.dismiss();

          })
        }
        if (name == 'City') {
          this.registerForm.controls['cityname'].setValue(dataa['name']);
          this.registerForm.controls['id_city'].setValue(dataa['id_city']);
          loader.dismiss();
        }

        if (name == 'Village') {
          this.registerForm.controls['village_name'].setValue(dataa['village_name']);
          this.registerForm.controls['id_village'].setValue(dataa['id_village']);
          loader.dismiss();
        }
      }

    });

  }
  goto() {

    this.nav.setRoot(HomePage);
  }
  typecheck() {
    if (this.registerForm.controls["cus_type"].value == '2') {
      this.registerForm.controls["gst_number"].setValidators([Validators.required, Validators.pattern(this.gstPattern)]);
      this.registerForm.controls['gst_number'].updateValueAndValidity();
    }
    else if (this.registerForm.controls["cus_type"].value == '1') {
      // this.registerForm.controls['gst_number'].clearValidators();
      this.registerForm.controls["gst_number"].setValidators([Validators.pattern(this.gstPattern)]);

      this.registerForm.controls['gst_number'].updateValueAndValidity();

    }

  }
  checkseg() {
    if (this.type == 'o') {
      this.registerForm.controls['cus_type'].setValue(2);
      this.typecheck();
    }
    else {
      this.registerForm.controls['cus_type'].setValue(1);
      this.typecheck();

    }
  }
  texto(event){
    console.log(event)

   const NUMBER_REGEXP = /^[a-zA-Z ]*$/;
   let newValue = event.target.value;
   let regExp = new RegExp(NUMBER_REGEXP);
    console.log(regExp)
    var withNoDigits = event.target.value.replace(/[0-9]/g, '');

    this.registerForm.controls['firstname'].setValue(withNoDigits);
  //  if (!regExp.test(newValue)) {
  //   let v:any = this.registerForm.controls['firstname'].value.slice(0, -1);
  //   this.registerForm.controls['firstname'].setValue(v);
  //  }

  }
  ionViewWillLeave(){
    this.events.publish( 'entered', false );

    }
    pinserch(e) {
      console.log(e.length);
      this.registerForm.controls['id_village'].setValue('');
      this.registerForm.controls['village_name'].setValue('');
      if (e != '' && e.length == 6) {
        var post = {
          'pin_code': e
        }
        this.common.getarea(post).then(data => {
          this.pincode_show = true
          this.village = data;
          console.log(this.village);
        })
  
  
      } else {
        this.pincode_show = false
        // let toast = this.toastCtrl.create({
        //   message: 'Please Enter Correct Pincode',
        //   position: 'bottom',
        //   duration: 1000
        // });
        // toast.present();
      }
    }

}
