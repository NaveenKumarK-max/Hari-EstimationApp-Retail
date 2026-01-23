import { Component } from '@angular/core';
import { ActionSheetController, IonicPage, LoadingController, ModalController, NavController, NavParams, ToastController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common';
import { StatusViewPage } from '../status-view/status-view';
import { EmpSearchPage } from '../modal/employee/employee';
import { OrderStatusViewPage } from '../order-status-view/order-status-view';
import { DatePicker } from '@ionic-native/date-picker';
import { RetailProvider } from '../../providers/retail';
import { HomePage } from '../home/home';
import { CartPage } from '../cart/cart';
import { NgZone } from '@angular/core';


/**
 * Generated class for the OrderStatusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-order-status',
  templateUrl: 'order-status.html',
  providers: [RetailProvider]

})
export class OrderStatusPage {

  empData = JSON.parse(localStorage.getItem('empDetail'));
  whole: any[] = [];
  ind: any = '';
  swhole: any[] = [];
  non_filter: any = []
  page_no: any = 1;
  id_employee: any;
  whole1: any[] = [];
  branch: any = []

  order: any = []

  employee: any = []

  select_order: any
  select_branch: any
  select_emp: any

  from: any;
  to: any;
  branfrom: any;
  branto: any;
  type: any = 1;
  view_type: any = 1;
  date_option:any
from_frm:any
to_frm:any
from_to:any
to_to:any
  constructor(private zone: NgZone,private datePicker: DatePicker, public actionSheetCtrl: ActionSheetController, public loadingCtrl: LoadingController, public common: CommonProvider, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, private toastCtrl: ToastController) {
    this.date_option = "intial"
    this.type = this.navParams.get('type')
    if (this.type == 2) {
      this.view_type = 2
    }
    var date = new Date();
    var ddd = date.getDate();
    var mmm = date.getMonth() + 1;
    var yy = date.getFullYear();
    // var today = date.toISOString().substring(0, 10);
    this.to = yy + "-" + mmm + "-" + ddd;
    this.branto = this.to


    var ddd = date.getDate();
    var mmm = date.getMonth() == 0 ? 12 : date.getMonth();
    var yy = date.getMonth() == 0 ? date.getFullYear() - 1 : date.getFullYear();
    // var today = date.toISOString().substring(0, 10);
    this.from = yy + "-" + mmm + "-" + ddd;
     date.setDate(date.getDate() - 7); // this line fetchecd only 7 days data .
     this.from = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    this.branfrom = this.from
    console.log(this.branfrom);

    let loader = this.loadingCtrl.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();

    var postData = {
      'id_employee': this.empData != null ? this.empData['uid'] : null,
      'page_no': this.page_no,
      'id_branch': this.empData['id_branch'],
      "from_date": this.from,
      "to_date": this.to,
      'filter_by': 1
    }
    console.log(postData);


    this.common.get_order_list(postData).then(data => {
      this.whole = data;
      this.non_filter = data;
      console.log(this.whole, '11111111111');

      this.swhole = data;


      data.forEach(element => {

        element['tog'] = 'View More';
      });
      loader.dismiss();
    }, err => {
      loader.dismiss();

    })

    this.common.getbranch().then(data => {
      this.branch = data;  
      var branch1 = this.branch.filter(data=>data['id_branch'] == this.empData['id_branch']) 
      this.select_branch = branch1[0]

    })

    this.common.getBranchEmployees(this.empData['id_branch']).then(data => {
      this.employee = data;
      var empname = this.employee.filter(data=>data['id_employee'] == this.empData['uid'])
      this.select_emp = empname[0]['emp_name'];
      this.id_employee =  empname[0].id_employee

      
    })

    this.common.getOrder_status().then(data => {
      this.order = data['order_status'];
    });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotconvertedPage');
  }
  open(i) {

    if (this.whole[i]['tog'] == 'View More') {
      this.whole[i]['tog'] = 'View Less';
    }
    else {
      this.whole[i]['tog'] = 'View More';
    }
    console.log(this.ind)

  }



  fromdate() {
    this.date_option = "from"
    this.datePicker.show({
      date: new Date(this.from),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(date => {

      var ddd = date.getDate();
      var mmm = date.getMonth() + 1;
      var yy = date.getFullYear();
      //var today = new Date(yy+"-"+mmm+"-"+ddd).toISOString().substring(0, 10);
      var today = date.toISOString().substring(0, 10);
      //this.fromdate= today;
      this.from = yy + "-" + mmm + "-" + ddd;

      var fromdate = new Date(this.from);
      var todate = new Date();

      var old = new Date(this.from);
      var now = new Date('2014-01-01');
      this.from_frm =  this.from 
      this.to_frm = this.to
      if (old >= now) {
        if (fromdate <= todate) {

          let loader = this.loadingCtrl.create({
            content: 'Please Wait',
            spinner: 'bubbles',
          });
          loader.present();
          var postData = {
            'id_employee': this.empData != null ? this.empData['uid'] : null,
            'page_no': this.page_no,
            'id_branch': this.empData['id_branch'],
            "from_date": this.from,
            "to_date": this.to,
            'filter_by': 1
          }
          console.log(postData);
          this.common.get_order_list(postData).then(data => {
            this.whole = data;
            this.non_filter = data;
            console.log(this.whole, '11111111111');

            this.swhole = data;


            data.forEach(element => {

              element['tog'] = 'View More';
            });
            loader.dismiss();
          }, err => {
            loader.dismiss();

          })

        }
        else {
          let toast = this.toastCtrl.create({
            message: 'Orders Not Available For Future Dates',
            position: 'bottom',

            duration: 6000
          });
          toast.present();

        }
      }
      else {
        let toast = this.toastCtrl.create({
          message: 'Please Select Date After 2014-01-01',
          position: 'bottom',

          duration: 6000
        });
        toast.present();

      }


    });
  }


  todate() {
    this.date_option = "to"
    this.datePicker.show({
      date: new Date(this.to),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(date => {

      var ddd = date.getDate();
      var mmm = date.getMonth() + 1;
      var yy = date.getFullYear();
      //var today = new Date(yy+"-"+mmm+"-"+ddd).toISOString().substring(0, 10);
      var today = date.toISOString().substring(0, 10);
      //this.fromdate= today;
      this.to = yy + "-" + mmm + "-" + ddd;
      var fromdate = new Date(this.to);
      var todate = new Date();


      var old = new Date(this.to);
      var now = new Date('2014-01-01');
      this.from_to =  this.from 
      this.to_to = this.to
      if (old >= now) {
        if (fromdate <= todate) {

          let loader = this.loadingCtrl.create({
            content: 'Please Wait',
            spinner: 'bubbles',
          });
          loader.present();
          var postData = {
            'id_employee': this.empData != null ? this.empData['uid'] : null,
            'page_no': this.page_no,
            'id_branch': this.empData['id_branch'],
            "from_date": this.from,
            "to_date": this.to,
            'filter_by': 1
          }
          console.log(postData);
          this.common.get_order_list(postData).then(data => {
            this.whole = data;
            this.non_filter = data;
            console.log(this.whole, '11111111111');
            this.swhole = data;
            data.forEach(element => {
              element['tog'] = 'View More';
            });
            loader.dismiss();
          }, err => {
            loader.dismiss();
          })
        }
        else {
          let toast = this.toastCtrl.create({
            message: 'Orders Not Available For Future Dates',
            position: 'bottom',
            duration: 6000
          });
          toast.present();

        }
      }
      else {
        let toast = this.toastCtrl.create({
          message: 'Please Select Date After 2014-01-01',
          position: 'bottom',

          duration: 6000
        });
        toast.present();

      }

    });

  }



  openModal(data) {
    this.navCtrl.push(OrderStatusViewPage, { 'item': data });
    // const modal = this.modalCtrl.create(StatusViewPage,{'item':data});
    // modal.present();
  }

  filterValue: any;
  filterNumbers() {
    let loader = this.loadingCtrl.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();

    this.page_no = this.page_no + 1;
    var postData = {
      'id_employee': this.empData['uid'] != null ? this.empData['uid'] : null,
      'id_branch': this.empData['id_branch'],
      "from_date": '',
      "to_date": '',
      'filter_by': 1,
      'order_no': this.filterValue
    }
    this.common.get_order_list(postData).then(data => {
      this.whole = data;
      this.whole1 = data;
      this.non_filter = data;
      console.log(this.whole, '11111111111');
      this.swhole = data;
      loader.dismiss();
      // this.from = ''
      // this.to = ''
      // this.select_emp = '';
      // this.select_branch = '';
    }, err => {
      loader.dismiss();

    })
  }

  order_filter_empty(e) {
   
    if(e._value.length == 0){
      var date = new Date();
      var ddd = date.getDate();
      var mmm = date.getMonth() + 1;
      var yy = date.getFullYear();
      // var today = date.toISOString().substring(0, 10);
      this.to = yy + "-" + mmm + "-" + ddd;
      this.branto = this.to
  
  
      var ddd = date.getDate();
      var mmm = date.getMonth() == 0 ? 12 : date.getMonth();
      var yy = date.getMonth() == 0 ? date.getFullYear() - 1 : date.getFullYear();
      // var today = date.toISOString().substring(0, 10);
      this.from = yy + "-" + mmm + "-" + ddd;
      // date.setDate(date.getDate() - 7); // this line fetchecd only 7 days data .
      // this.from = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      this.branfrom = this.from
      console.log(this.branfrom);
      let loader = this.loadingCtrl.create({
        content: 'Please Wait',
        spinner: 'bubbles',
      });
      loader.present();
      var postData = {
        'id_employee': this.empData != null ? this.empData['uid'] : null,
        'page_no': this.page_no,
        'id_branch': this.empData['id_branch'],
        "from_date": this.from,
        "to_date": this.to,
        'filter_by': 1
      }
      console.log(postData);
  
  
      this.common.get_order_list(postData).then(data => {
        this.whole = data;
        this.non_filter = data;
        console.log(this.whole, '11111111111');
  
        this.swhole = data;
  
  
        data.forEach(element => {
  
          element['tog'] = 'View More';
        });
        loader.dismiss();
      }, err => {
        loader.dismiss();
  
      })
    }
    this.filterValue = e._value.toUpperCase()
    this.whole = this.non_filter
  }

  handleFilter(change_event) {
    let loader = this.loadingCtrl.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();
    this.get_date()
  
    var order_id = (this.select_order != '' && this.select_order != undefined) ? this.select_order['id_order_msg'] : null

    if (change_event == 'branch') {
      this.select_emp = '';
      this.id_employee = '';
      this.select_order = ''
      order_id = ''
      var branch_id = (this.select_branch != '' && this.select_branch != undefined) ? this.select_branch['id_branch'] : this.empData['id_branch']
      var id_employee = (this.id_employee != '' && this.id_employee != undefined) ? this.id_employee : null

      var postData = {
        'id_employee': id_employee,
        'page_no': this.page_no,
        'id_branch': branch_id,
        "from_date":this.from,
        "to_date": this.to,
        'filter_by': 1,
        'orderstatus': order_id
      }
      this.common.get_order_list(postData).then(data => {
        if(data != null){
          loader.dismiss();
          this.whole = data;
        }
      },)
      this.common.getBranchEmployees(branch_id).then(data => {
        this.employee = data;
        console.log(this.employee, 'lllllllllll');
      })
    } else if (change_event == 'employee') {
      order_id = '';
      this.select_order = '';
      var branch_id = (this.select_branch != '' && this.select_branch != undefined) ? this.select_branch['id_branch'] : this.empData['id_branch']
      var id_employee = (this.id_employee != '' && this.id_employee != undefined) ? this.id_employee : null
      

      var postData = {
        'id_employee': id_employee,
        'page_no': this.page_no,
        'id_branch': branch_id,
        "from_date": this.from,
        "to_date": this.to,
        'filter_by': 1,
        'orderstatus': order_id
      }
      this.common.get_order_list(postData).then(data => {
        this.whole = data;
      },)

      loader.dismiss();

    } else if (change_event == 'status') {
      this.from = ''
      this.to = ''
      console.log('bran : ',this.select_branch);
      console.log(this.select_branch['id_branch'] );
      console.log(this.empData['id_branch'],'id_branch');
      console.log(this.id_employee);
      
      // var branch_id = ( select_branch != '' &&  select_branch != undefined) ? select_branch : this.empData['id_branch']
      var branch_id = (this.select_branch != '' && this.select_branch != undefined) ? this.select_branch['id_branch'] : this.empData['id_branch']
      var id_employee = (this.id_employee != '' && this.id_employee != undefined) ? this.id_employee : this.empData['id_employee']
 
      // console.log(this.select_order.id_order_msg,'status');
   
      var postData = {
        'id_employee': id_employee,
        'page_no': this.page_no,
        'id_branch': branch_id,
        "from_date": null,
        "to_date": null,
        'filter_by': 1,
        'orderstatus': order_id
      }
      this.common.get_order_list(postData).then(data => {
        loader.dismiss();
        this.whole = data;
      },)


    }

  }

  get_date(){
    console.log(this.date_option);
    if(this.date_option == 'intial'){
      var date = new Date();
      var ddd = date.getDate();
      var mmm = date.getMonth() + 1;
      var yy = date.getFullYear();
      // var today = date.toISOString().substring(0, 10);
      this.to = yy + "-" + mmm + "-" + ddd;
      this.branto = this.to
  
  
      var ddd = date.getDate();
      var mmm = date.getMonth() == 0 ? 12 : date.getMonth();
      var yy = date.getMonth() == 0 ? date.getFullYear() - 1 : date.getFullYear();
      // var today = date.toISOString().substring(0, 10);
      this.from = yy + "-" + mmm + "-" + ddd;
       date.setDate(date.getDate() - 7); // this line fetchecd only 7 days data .
       this.from = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  
    }else if(this.date_option == 'from'){
      this.from =  this.from_frm 
      this.to = this.to_frm
    }else if(this.date_option == 'to'){
      this.from =  this.from_to 
      this.to = this.to_to
    }
  }

  // naveen
  openEmpModal() {
    console.log(this.select_branch);
    let modal = this.modalCtrl.create(EmpSearchPage, { "empData": this.employee })
    modal.present();
    modal.onDidDismiss(data => {
      if (data != null) {
        this.select_emp = data.emp_name;
        this.id_employee = data.id_employee
        this.handleFilter('employee');
      }
    });

  }



  doInfinite(infiniteScroll: any) {
    this.page_no = this.page_no + 1;

    // let loader = this.loadingCtrl.create({
    // 	content: 'Please Wait',
    // 	spinner: 'bubbles',
    //   });
    //   loader.present();

    var order_id = (this.select_order != '' && this.select_order != undefined) ? this.select_order['id_order_msg'] : null

    var postData = {
      'id_employee': (this.id_employee != '' && this.id_employee != undefined) ? this.id_employee : this.empData['id_employee'],
      'page_no': this.page_no,
      'id_branch': (this.select_branch != '' && this.select_branch != undefined) ? this.select_branch['id_branch'] : this.empData['id_branch'],
      "from_date": this.from,
      "to_date": this.to,
      'filter_by': 1,
      'orderstatus': order_id
      
    }
    this.common.get_order_list(postData).then(data => {
      console.log(data)
      for (let index = 0; index < data.length; index++) {
        data[index]['tog'] = 'View More';
        this.whole.push(data[index])
        // this.whole1.push(data[index])
        // this.non_filter.push(data[index])
        // this.swhole.push(data[index])
      }
      infiniteScroll.complete();
      // loader.dismiss();
    })
  }

  redirect() {
    if (this.type == undefined) {
      this.type = 1
    }
    if (this.type == 1 || this.type == 2) {
      this.navCtrl.setRoot(HomePage)

    } 
    // else if (this.type == 2) {
    //   this.navCtrl.push(CartPage)
    // }
  }

 

  refresh(){
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }
  



}

