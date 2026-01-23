import { Component, Pipe, PipeTransform, trigger, state, style, transition, animate, keyframes, ElementRef ,ViewChild   } from '@angular/core';
import { NavController, Platform, MenuController, Events, LoadingController, ToastController, ModalController,Content ,NavParams  } from 'ionic-angular';
import { Toast, Diagnostic, NativeStorage } from 'ionic-native';
import { FormGroup, AbstractControl, FormBuilder, Validators,FormArray } from '@angular/forms';
import { CommonProvider } from '../../providers/common';
import { DatePicker } from '@ionic-native/date-picker';

import { CountrymodelPage } from '../modal/countrymodel/countrymodel';
import { HomePage } from '../home/home';



/*
  Generated class for the Register page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-cusupdate',
  templateUrl: 'cusupdate.html',
  providers: [CommonProvider]

})
export class CusupdatePage {
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
//  public spouse_wed: AbstractControl;

   public child_name: AbstractControl;
  public child_dob: AbstractControl;
  public date_of_birth: AbstractControl;
  public date_of_wed: AbstractControl;

  public relation_type: AbstractControl;
  public religion: AbstractControl;
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
  adhar_pattern =  "^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$";
  pwd: any = false;
  accept: any = false;
  deviceid = JSON.parse(localStorage.getItem('DeviceData'));
  branch_name: any = '';
  branchid: any = '';
  branch_settings: any = '';
  is_branchwise_cus_reg: any = '';
  id_branch: any = '';
  details: any = { 'countryname': '', 'id_country': '', 'statename': '', 'id_state': '', 'cityname': '', 'id_city': '' };
  country: any[] = [];
  state: any = [];
  city: any = [];
  village: any = [];
  address1: any = '';
  address2: any = '';
  passport:any='';
  dl_number:any='';
  aadharid:any='';
  pincode: any = [];
  // religion: any = [];
  gender: any = [];
  cus_type: any = [];
  active:any=[];
  // date_of_birth: any = [];
  // date_of_wed: any = [];
  empData = JSON.parse(localStorage.getItem('empDetail'));
  typec = '';
  searchdata:any = '';

  selected =0;
  showinput:any = false;
  childrendata: FormArray;
  pincode_show: any = false;

  constructor(public navparam:NavParams,private datePicker: DatePicker, private platform: Platform, private builder: FormBuilder, private nav: NavController, private events: Events, private menu: MenuController, private commonservice: CommonProvider, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private event: Events, public modal: ModalController, public common: CommonProvider,) {

    console.log(this.empData);
    console.log(this.empData['id_branch']);
    this.nav = nav;
    this.menu = menu;
    this.platform = platform;
    this.registerForm = builder.group({
      'is_vip': [0, Validators.compose([Validators.required])],
      'firstname': ['', Validators.compose([Validators.required])],
      'relation_name': [''],
      'relation_type': [''],
      'mobile': ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      'email': ['', Validators.compose([ Validators.pattern(this.emailPattern)])],
      // 'passwd': ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(16)])],
      // 'cpasswd': ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(16)])],
      'address1':['', Validators.compose([Validators.required]), this.address1 != null ? this.address1['address1'] : null],
      'address2': this.address2 != null ? this.address1['address2'] : null,
      'passport':['',Validators.compose([Validators.pattern(this.passportPattern)])],
      'dl_number':[''],
      'aadharid':['',Validators.compose([Validators.pattern(this.adhar_pattern)])],
      'pincode': ['', Validators.compose([Validators.required,Validators.minLength(6)]), this.pincode != null ? this.pincode['pincode'] : null],
      'religion': this.religion != null ? this.religion['religion'] : null,
       'gender': this.gender != null ? this.gender['gender'] : null,
      'cus_type': this.cus_type != null ? this.cus_type['cus_type'] : null,
      'active': this.active != null ? this.active['active'] : null,
      'date_of_birth': this.date_of_birth != null ? this.date_of_birth['date_of_birth'] : null,
      'date_of_wed': this.date_of_wed != null ? this.date_of_wed['date_of_wed'] : null,
      'countryname': this.details['countryname'],
      'id_country': this.details['id_country'],
      'statename': this.details['statename'],
      'id_state': this.details['id_state'],
      'cityname': this.details['cityname'],
      'id_city': this.details['id_city'],
      'id_customer':this.navparam.get('id'),
      'village_name': ['', this.village_name != null ? this.village_name['village_name'] : null],
      'id_village': this.details['id_village'],
      //  'branchname': ['', Validators.compose([Validators.required]), this.branchname != null ? this.branchname['branchname'] : null],
      'id_branch': this.empData['id_branch'] != null ? this.empData['id_branch'] : null,
      'id_employee': this.empData['uid'],
      // 'nominee_name': this.nominee_name != null ? this.nominee_name['nominee_name'] : null,
      // 'nominee_relationship': this.nominee_relationship != null ? this.nominee_relationship['nominee_relationship'] : null,
      // 'nominee_mobile': this.nominee_mobile != null ? this.nominee_mobile['nominee_mobile'] : null,
      'company_name': this.company_name != null ? this.company_name['company_name'] : null,
      'gst_number': ['', Validators.compose([ Validators.pattern(this.gstPattern)]),this.gst_number != null ? this.gst_number['gst_number'] : null],
      // 'gst_number': ['',this.gst_number != null ? this.gst_number['gst_number'] : null],

      'pan': ['', Validators.compose([ Validators.pattern(this.panPattern)]),this.pan != null ? this.pan['pan'] : null],
      // 'voterid': ['', Validators.compose([ Validators.pattern(this.votterPattern)]),this.voterid != null ? this.voterid['voterid'] : null],
      // 'rationcard': ['', Validators.compose([ Validators.pattern(this.rationPattern)]),this.rationcard != null ? this.rationcard['rationcard'] : null],

      //'pan': this.pan != null ? this.pan['pan'] : null,
      'voterid': this.voterid != null ? this.voterid['voterid'] : null,
      //'rationcard': this.rationcard != null ? this.rationcard['rationcard'] : null,
      // 'comments': this.comments != null ? this.comments['comments'] : null,

      'marital_status': this.marital_status != null ? this.marital_status['marital_status'] : null,
      'spouse_name': this.spouse_name != null ? this.spouse_name['spouse_name'] : null,
      'spouse_dob': this.spouse_dob != null ? this.spouse_dob['spouse_dob'] : null,
    //  'spouse_wed': this.spouse_wed != null ? this.spouse_wed['spouse_wed'] : null,

     'childrendata': new FormArray([]),
     'refperson': this.details['refperson'],
     'refmobile': this.details['refmobile'],

    },

      // { validator: this.checkIfMatchingPasswords('passwd', 'cpasswd') }
    );
  //  this.add();

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
    this.aadharid = this.registerForm.controls['aadharid'];
    this.pincode = this.registerForm.controls['pincode'];
    this.religion = this.registerForm.controls['religion'];
     this.gender = this.registerForm.controls['gender'];
    this.cus_type = this.registerForm.controls['cus_type'];
    this.active = this.registerForm.controls['active'];
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

    // this.branchname = this.registerForm.controls['branchname'];
    this.id_branch = this.empData['id_branch'];

    // this.nominee_name = this.registerForm.controls['nominee_name'];
    // this.nominee_relationship = this.registerForm.controls['nominee_relationship'];
    // this.nominee_mobile = this.registerForm.controls['nominee_mobile'];
    this.company_name = this.registerForm.controls['company_name'];
    // this.nominee_name = this.registerForm.controls['nominee_name'];
    this.gst_number = this.registerForm.controls['gst_number'];
    this.pan = this.registerForm.controls['pan'];
     this.voterid = this.registerForm.controls['voterid'];
    // this.rationcard = this.registerForm.controls['rationcard'];
    // this.comments = this.registerForm.controls['comments'];

    this.marital_status = this.registerForm.controls['marital_status'];
    this.spouse_name = this.registerForm.controls['spouse_name'];
    this.spouse_dob = this.registerForm.controls['spouse_dob'];
  //  this.spouse_wed = this.registerForm.controls['spouse_wed'];
  this.refperson = this.registerForm.controls['refperson'];
 this.refmobile = this.registerForm.controls['refmobile'];
this.is_vip = this.registerForm.controls['is_vip'];


  this.registerForm.get("marital_status").valueChanges.subscribe(selectedValue  => {
    console.log(' changed')
    this.onSelectChange(selectedValue);
    console.log(selectedValue)
  })
    let loader = this.loadingCtrl.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();



    this.common.getcountry().then(data => {
      this.country = data;
      this.commonservice.getcustomer({'id_cus':this.navparam.get('id')}).then(res => {
        this.registerForm.controls['firstname'].setValue(res['cusdetails']['firstname']);
        this.registerForm.controls['relation_name'].setValue(res['cusdetails']['relation_name']);
        this.registerForm.controls['relation_type'].setValue(res['cusdetails']['relation_type']);
        this.registerForm.controls['email'].setValue(res['cusdetails']['email']);

        this.registerForm.controls['mobile'].setValue(res['cusdetails']['mobile']);
        this.registerForm.controls['address1'].setValue(res['cusdetails']['address1']);
        this.registerForm.controls['address2'].setValue(res['cusdetails']['address2']);
        this.registerForm.controls['passport'].setValue(res['cusdetails']['passport']);
        this.registerForm.controls['dl_number'].setValue(res['cusdetails']['dl_number']);
        this.registerForm.controls['pincode'].setValue(res['cusdetails']['pincode']);
        this.registerForm.controls['cus_type'].setValue(res['cusdetails']['cus_type']);
        this.registerForm.controls['active'].setValue(res['cusdetails']['active']);
        this.registerForm.controls['countryname'].setValue(res['cusdetails']['country']);
        this.registerForm.controls['statename'].setValue(res['cusdetails']['state']);
        this.registerForm.controls['cityname'].setValue(res['cusdetails']['city']);
        this.registerForm.controls['id_country'].setValue(res['cusdetails']['id_country']);
        this.registerForm.controls['id_state'].setValue(res['cusdetails']['id_state']);
        this.registerForm.controls['id_city'].setValue(res['cusdetails']['id_city']);
        this.registerForm.controls['gst_number'].setValue(res['cusdetails']['gst_number']);
        this.registerForm.controls['pan'].setValue(res['cusdetails']['pan']);
        this.registerForm.controls['aadharid'].setValue(res['cusdetails']['aadharid']);

        this.registerForm.controls['gender'].setValue(res['cusdetails']['gender']);
        this.registerForm.controls['spouse_name'].setValue(res['cusdetails']['spouse_name']);
        this.registerForm.controls['spouse_dob'].setValue(res['cusdetails']['spouse_dob']);
        this.registerForm.controls['date_of_birth'].setValue(res['cusdetails']['date_of_birth']);
        this.registerForm.controls['date_of_wed'].setValue(res['cusdetails']['date_of_wed']);
        this.registerForm.controls['religion'].setValue(res['cusdetails']['religion']);

        this.registerForm.controls['marital_status'].setValue(res['cusdetails']['marital_status']);
        this.registerForm.controls['village_name'].setValue(res['cusdetails']['village_name'])
        this.registerForm.controls['id_village'].setValue(res['cusdetails']['id_village'])
        this.registerForm.controls['voterid'].setValue(res['cusdetails']['voterid'])
        this.registerForm.controls['refperson'].setValue(res['cusdetails']['refer_person'])
        this.registerForm.controls['refmobile'].setValue(res['cusdetails']['refer_mobile'])
        this.registerForm.controls['is_vip'].setValue(res['cusdetails']['is_vip'])


        


  // Set village_name from server response if available
  if (this.registerForm.controls['village_name'].value) {
    this.pincode_show = true; // Show the select area field
  }

        // if(res['cusdetails']['marital_status'] != '1'){
        //   // this.add();

        //   if(res['cusdetails']['childrens'].length > 0){
        //     res['cusdetails']['childrens'].forEach(element => {

        //       const childForm = this.builder.group({
        //         'child_name': element['children_name'],
        //         'child_dob':element['children_dob']
        //       });
        //       this.childrendata = this.registerForm.get('childrendata') as FormArray;

        //       this.childrendata.push(childForm);
        //     });
        //   }
        //   else{
        //     this.add();
        //   }

        //   console.log(this.childrendata);
        //   console.log(this.registerForm.value);
        // }

        this.registerForm.controls['spouse_name'].setValue(res['cusdetails']['spouse_name']);
        this.registerForm.controls['spouse_dob'].setValue(res['cusdetails']['spouse_dob']);


          this.common.getstate(res['cusdetails']['id_country']).then(data => {

            this.state = data;
          })
            this.common.getcity(res['cusdetails']['id_state']).then(data => {

            this.city = data;

          })

        loader.dismiss();

      });
    })

/*     this.common.getVillages().then(data => {
      this.village = data;
      console.log(this.village);
    })
 */

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
  typecheck(data){

    this.typec = data;

    // let loader = this.loadingCtrl.create({
    //   content: 'Please Wait',
    //   spinner: 'bubbles',
    // });
    // loader.present();
    // this.commonservice.createCustomer({'search':this.searchdata,'type':data}).then(res => {

    //   loader.dismiss();
    // },err=>{
    //   loader.dismiss();
    // });

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
    } else if(type == 'adhar'){

      if (this.registerForm.controls['aadharid'].value.length > 15) {
        let v:any = this.registerForm.controls['aadharid'].value.slice(0, 15);
        this.registerForm.controls['aadharid'].setValue(v.toUpperCase());

      }
    }
    else if(type == 'pass'){
      this.registerForm.controls['passport'].setValue(e['value'].toUpperCase())
      console.log('000000');

    }
    else if (type == 'dl_num') {
      if (this.registerForm.controls['dl_number'].value.length > 15) {
        let v: any = this.registerForm.controls['dl_number'].value.slice(0, 15);
        this.registerForm.controls['dl_number'].setValue(v.toUpperCase());

      }

    } else if (type == 'refermob') {
      if (this.registerForm.controls['refmobile'].value.length > 10) {
        let v: any = this.registerForm.controls['refmobile'].value.slice(0, 10);
        this.registerForm.controls['refmobile'].setValue(v.toUpperCase());
      }
    }
    else {
      if (type == 'ration') {
        this.registerForm.controls['rationcard'].setValue(e['value'].toUpperCase());
      }

    }


  }


  /* for footer as hide in default. it's assigned in app.components.ts */
  ionViewWillEnter() {
    let user = false;
    this.events.publish('user:created', user);
    this.events.publish('lp', false);

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

  // birth(type,index) {
  //   this.datePicker.show({
  //     date: new Date(),
  //     mode: 'date',
  //     androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
  //   }).then(date => {

  //     var ddd = date.getDate();
  //     var mmm = date.getMonth() + 1;
  //     var yy = date.getFullYear();
  //     //var today = new Date(yy+"-"+mmm+"-"+ddd).toISOString().substring(0, 10);
  //     var today = date.toISOString().substring(0, 10);
  //     //this.fromdate= today;
  //     this.details['date_of_birth'] = yy + "-" + mmm + "-" + ddd;
  //     this.details['spouse_dob'] = yy + "-" + mmm + "-" + ddd;
  //     this.details['child_dob'] = yy + "-" + mmm + "-" + ddd;

  //     if(type =='common'){
  //       this.registerForm.controls['date_of_birth'].setValue(yy + "-" + mmm + "-" + ddd);
  //     }else if(type =='spouse'){
  //       this.registerForm.controls['spouse_dob'].setValue(yy + "-" + mmm + "-" + ddd);
  //     }else{
  //       // this.registerForm.controls['child_dob'].setValue(yy + "-" + mmm + "-" + ddd);
  //       ((this.registerForm.get('childrendata') as FormArray).at(index) as FormGroup).get('child_dob').patchValue(yy + "-" + mmm + "-" + ddd);

  //     }

  //   });
  // }
  // wed(type) {
  //   this.datePicker.show({
  //     date: new Date(),
  //     mode: 'date',
  //     androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
  //   }).then(date => {

  //     var ddd = date.getDate();
  //     var mmm = date.getMonth() + 1;
  //     var yy = date.getFullYear();
  //     //var today = new Date(yy+"-"+mmm+"-"+ddd).toISOString().substring(0, 10);
  //     var today = date.toISOString().substring(0, 10);
  //     this.details.date_of_wed = yy + "-" + mmm + "-" + ddd;
  //   //  this.details.spouse_wed = yy + "-" + mmm + "-" + ddd;
  //    // this.registerForm.controls['date_of_wed'].setValue(yy + "-" + mmm + "-" + ddd);
  //    this.registerForm.controls['date_of_wed'].setValue(yy + "-" + mmm + "-" + ddd);

  //   });
  // }

      birth(type, index) {
  this.datePicker.show({
    date: new Date(),
    mode: 'date',
    androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
  }).then(date => {

    const ddd = ("0" + date.getDate()).slice(-2);   // 01 → 01, 5 → 05
    const mmm = ("0" + (date.getMonth() + 1)).slice(-2); // 01 → 01, 9 → 09
    const yy = date.getFullYear();

    const finalDate = `${yy}-${mmm}-${ddd}`;

    this.details['date_of_birth'] = finalDate;
    this.details['spouse_dob'] = finalDate;
    this.details['child_dob'] = finalDate;

    console.log("DOB: ", finalDate);

    if (type == 'common') {
      this.registerForm.controls['date_of_birth'].setValue(finalDate);
    } else if (type == 'spouse') {
      this.registerForm.controls['spouse_dob'].setValue(finalDate);
    } else {
      ((this.registerForm.get('childrendata') as FormArray)
        .at(index) as FormGroup)
        .get('child_dob')
        .patchValue(finalDate);
    }
  });
}

  wed(type) {
  this.datePicker.show({
    date: new Date(),
    mode: 'date',
    androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
  }).then(date => {

    let dd = ("0" + date.getDate()).slice(-2);       // 01–31
    let mm = ("0" + (date.getMonth() + 1)).slice(-2); // 01–12
    let yy = date.getFullYear();                      // 2025

    let finalDate = `${yy}-${mm}-${dd}`; // yyyy-mm-dd (25-12-2025)

    this.details.date_of_wed = finalDate;
    this.registerForm.controls['date_of_wed'].setValue(finalDate);
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
if(this.registerForm.get('is_vip').valid || this.registerForm.get('cus_type').value == 2){
    if (this.registerForm.get('firstname').valid) {
      if (this.registerForm.get('email').valid) {
        if (this.registerForm.get('mobile').valid) {
                    // if (this.registerForm.get('passwd').valid && this.registerForm.get('cpasswd').valid && this.registerForm.controls['passwd'].value == this.registerForm.controls['cpasswd'].value) {

              if (this.registerForm.controls['pincode'].valid) {
                if (this.registerForm.controls['address1'].valid) {
                  if(this.registerForm.controls['gst_number'].valid){
                    if(this.registerForm.controls['pan'].valid){
                    //   if(this.registerForm.controls['voterid'].valid){
                    //     if(this.registerForm.controls['rationcard'].valid){
                this.errorMessage = 'Doing Register...';
                this.isDisabled = true;
                let loader = this.loadingCtrl.create({
                  content: 'Please Wait',
                  spinner: 'bubbles',
                });
                loader.present();
                let postData = Object.assign({}, values);
                console.log(JSON.stringify(postData));

                this.commonservice.updatecustomer(JSON.stringify(postData)).then(res => {
                  if (res) {
                    console.log(res);

                                            if (res['status']) {
                                              let toast = this.toastCtrl.create({
                                                message: res.msg,
                                                duration: 6000
                                              });
                                              toast.present();
                                              this.nav.pop();
                                              // this.nav.setRoot(HomePage, { data: this.registerForm.value, page: 'new' });
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
              // }
              // else {
              //   console.log('ration');
              //   let toast = this.toastCtrl.create({
              //     message: 'Please Enter Correct RationCard',
              //     position: 'bottom',

              //     duration: 6000
              //   });
              //   toast.present();
              // }
              // }
              // else {
              //   console.log('voter id');
              //   let toast = this.toastCtrl.create({
              //     message: 'Please Enter Correct VoterCard',
              //     position: 'bottom',

              //     duration: 6000
              //   });
              //   toast.present();
              // }
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
            this.registerForm.controls['statename'].setValue('');
            this.registerForm.controls['id_state'].setValue('');
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
  usertypecheck(){
    console.log('******')

    if(this.registerForm.controls["cus_type"].value == '2'){
      console.log(11111)
      this.registerForm.controls["gst_number"].setValidators([Validators.required,Validators.pattern(this.gstPattern)]);
      this.registerForm.controls['gst_number'].updateValueAndValidity();
    }
    else if(this.registerForm.controls["cus_type"].value == '1'){
      console.log(22222)
      // this.registerForm.controls['gst_number'].clearValidators();
      this.registerForm.controls["gst_number"].setValidators([Validators.pattern(this.gstPattern)]);

      this.registerForm.controls['gst_number'].updateValueAndValidity();

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
    this.events.publish('lp', true);

    }

    pinserch(e) {
      console.log("Pincode length:", e.length);
    
      // Reset the village selection when the pincode is edited
      this.pincode_show = false;
      this.registerForm.controls['id_village'].setValue('');
      this.registerForm.controls['village_name'].setValue('');
    
      if (e && e.length == 6) {
        let post = {
          'pin_code': e
        };
    
        this.common.getarea(post).then(data => {
          if (data && data.length > 0) {
            this.pincode_show = true;
            this.village = data;
            console.log("Fetched Villages:", this.village);
          } else {
            this.pincode_show = false;
          }
        });
      }
    }

}
