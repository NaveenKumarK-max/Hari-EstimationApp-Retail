import { Component, ChangeDetectorRef } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common';
import { SubdesignPage } from '../subdesign/subdesign';
import { SupsubdesignPage } from '../supsubdesign/supsubdesign';

/**
 * Generated class for the EcomfilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-avrsearch',
  templateUrl: 'avrsearch.html',
  providers: [CommonProvider]

})
export class AvrsearchPage {

  empData = JSON.parse(localStorage.getItem('empDetail'));

  showLevel1 = null;
  showLevel2 = null;
  pages: any[] = []
  cat: any[] = [];
  remove: any[] = []
  category: any[] = []
  all: any[] = []
  all2: any[] = []

  reset: any[] = [{ 'name': 'Foods', 'id': 1, 'status': false }, { 'name': 'Beverages', 'id': 1, 'status': false }, { 'name': 'Sakthi', 'id': 2, 'status': false }, { 'name': 'Slice', 'id': 2, 'status': false }, { 'name': '₹100 - ₹200', 'id': 3, 'status': false }, { 'name': '1 Kg', 'id': 4, 'status': false }, { 'name': '2 Pcs', 'id': 5, 'status': false }]
  items: any[] = []
  one = null;
  ind = 0;
  checkm = null;
  subscription: any;
  whole: any = '';
  featurename = '';
  rupees: any = { 'min': 0, 'max': 0 };
  temp: any = {};
  temptwo: any[] = [];
  styleExp: any = window.innerHeight - 50;
  whole2: any = '';
  public input: string = '';
  pro = {
    "UserId": "LOGIMAX",
    "Password": "123",
    "Branch": "",
    "Metal": "",
    "Product": 0,
    "SubProduct": 0,
    "TagNo": "",
    "FromWt": 0,
    "ToWt": 0,
    "FromPrice": 0,
    "ToPrice": 0
  }
  constructor(private events: Events, public cd: ChangeDetectorRef, public load: LoadingController, public comman: CommonProvider, public viewctrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {


    let loader = this.load.create({
      // content: 'Please Wait',
      // spinner: 'dots',
    });
    loader.present();

    // this.comman.getfilter().then(data=>{
    var check = this.navParams.get('supplier') == true ? true : false;

    console.log(check)
    if (check != true) {

      if (JSON.parse(localStorage.getItem('predata')) != null && this.navParams.get('supplier') != true) {

        var data: any = JSON.parse(localStorage.getItem('predata'));

        console.log(data);


        var check = this.navParams.get('supplier') == true ? true : false;

        this.category = Object.keys(data);
        localStorage.setItem('predata', JSON.stringify(data))
        this.whole = data;
        this.whole2 = data;

        console.log(localStorage.getItem('apply'))
        if (localStorage.getItem('apply') != null && localStorage.getItem('apply') != 'reset') {

          let test = Object.keys(JSON.parse(localStorage.getItem('apply')));
          let testo = JSON.parse(localStorage.getItem('apply'));
          this.temp = JSON.parse(localStorage.getItem('apply'));
          test.forEach((element, i) => {
            console.log(element)
            if (this.checking(this.whole[element])) {
              let tem = this.whole[element];


          
            
              testo[element].forEach(e => {

                var index = tem.findIndex(data => data['name'] == e['name']);
                console.log(index)
                if (index != -1) {
                  this.whole[element][index]['status'] = true;
                  this.temptwo.push(e);
                }
              });
            }
            else {
              this.whole[element] = testo[element];

            }
            console.log('final', i)

          });
          console.log('close');

          this.getitems1('', 0);
          loader.dismiss();
        }
        else {
          this.getitems('', 0);
          console.log('erftgyhujij : ');
          
          loader.dismiss();
        }

      }
      else {


        this.comman.getfilter(check).then(data => {

          console.log(data);

          this.category = Object.keys(data['ReturnObject']);
          localStorage.setItem('predata', JSON.stringify(data['ReturnObject']))
          this.whole = data['ReturnObject'];
          this.whole2 = data['ReturnObject'];

          console.log(localStorage.getItem('apply'))
          if (localStorage.getItem('apply') != null && localStorage.getItem('apply') != 'reset') {

            let test = Object.keys(JSON.parse(localStorage.getItem('apply')));
            let testo = JSON.parse(localStorage.getItem('apply'));
            this.temp = JSON.parse(localStorage.getItem('apply'));
            test.forEach((element, i) => {
              console.log(element)
              if (this.checking(this.whole[element])) {
                let tem = this.whole[element];

                testo[element].forEach(e => {

                  var index = tem.findIndex(data => data['name'] == e['name']);
                  console.log(index)
                  if (index != -1) {
                    this.whole[element][index]['status'] = true;
                    this.temptwo.push(e);
                  }
                });
              }
              else {
                this.whole[element] = testo[element];

              }
              console.log('final', i)

            });
            console.log('close');

            this.getitems1('', 0);
            loader.dismiss();
          }
          else {
            this.getitems('', 0);
            loader.dismiss();
          }

        });
      }
    }


    if (check == true) {
      console.log('trueeeeeeeeeeee : ');


      if (JSON.parse(localStorage.getItem('spredata')) != null && this.navParams.get('supplier') == true) {

        var data: any = JSON.parse(localStorage.getItem('spredata'));

        console.log(data);

        this.category = Object.keys(data);
        localStorage.setItem('spredata', JSON.stringify(data))
        this.whole = data;
        this.whole2 = data;

        console.log(localStorage.getItem('sapply'))
        if (localStorage.getItem('sapply') != null && localStorage.getItem('sapply') != 'reset') {

          let test = Object.keys(JSON.parse(localStorage.getItem('sapply')));
          let testo = JSON.parse(localStorage.getItem('sapply'));
          this.temp = JSON.parse(localStorage.getItem('sapply'));
          test.forEach((element, i) => {
            console.log(element)
            if (this.checking(this.whole[element])) {
              let tem = this.whole[element];

              testo[element].forEach(e => {

                var index = tem.findIndex(data => data['name'] == e['name']);
                console.log(index)
                if (index != -1) {
                  this.whole[element][index]['status'] = true;
                  this.temptwo.push(e);
                }
              });
            }
            else {
              this.whole[element] = testo[element];

            }
            console.log('final', i)

          });
          console.log('close');

          this.getitems1('', 0);
          loader.dismiss();
        }
        else {
          this.getitems('', 0);
          loader.dismiss();
        }

      }
      else {


        this.comman.getfilter(check).then(data => {

          console.log(data);

          this.category = Object.keys(data['ReturnObject']);
          localStorage.setItem('spredata', JSON.stringify(data['ReturnObject']))
          this.whole = data['ReturnObject'];
          this.whole2 = data['ReturnObject'];

          console.log(localStorage.getItem('sapply'))
          if (localStorage.getItem('sapply') != null && localStorage.getItem('sapply') != 'reset') {

            let test = Object.keys(JSON.parse(localStorage.getItem('sapply')));
            let testo = JSON.parse(localStorage.getItem('sapply'));
            this.temp = JSON.parse(localStorage.getItem('sapply'));
            test.forEach((element, i) => {
              console.log(element)
              if (this.checking(this.whole[element])) {
                let tem = this.whole[element];

                testo[element].forEach(e => {

                  var index = tem.findIndex(data => data['name'] == e['name']);
                  console.log(index)
                  if (index != -1) {
                    this.whole[element][index]['status'] = true;
                    this.temptwo.push(e);
                  }
                });
              }
              else {
                this.whole[element] = testo[element];

              }
              console.log('final', i)

            });
            console.log('close');

            this.getitems1('', 0);
            loader.dismiss();
          }
          else {
            this.getitems('', 0);
            loader.dismiss();
          }

        });
      }
    }

    // });


  }

  ionViewDidLoad() {

  }


  isLevel1Shown(idx) {

    return this.showLevel1 === idx;
  };

  isLevel2Shown(idx) {

    return this.showLevel2 === idx;
  };

  open(e) {

    console.log(e);

    this.viewctrl.dismiss(e)
    // this.navCtrl.push(ProductsPage,{'data':e})

  }
  child(e) {

    console.log(e);

    this.viewctrl.dismiss(e)
    // this.navCtrl.push(ProductsPage,{'data':e})

  }

  close() {

    this.viewctrl.dismiss();
  }
  manu(index) {

    if (this.checkm != index + 'idx') {
      this.checkm = index + 'idx';
    }
    else {
      this.checkm = null;
    }

    console.log(this.checkm);
  }
  gett(f, e) {


    console.log(this.temptwo)
    console.log(f)
    console.log(this.temp);
    console.log(e);
    console.log(JSON.parse(localStorage.getItem('predata')));



    if (e['status'] == true) {
      console.log(e);

      this.temptwo.push(e);
      console.log(this.temptwo);

      if (!this.temp.hasOwnProperty(f)) {
        this.temp[f] = this.temptwo;
        this.cd.detectChanges();

        console.log(this.temp);

      }
      else {
        this.temp[f].push(e);
        // this.temp[f].pop(e);
        let newArray = [];

        let uniqueObject = {};

        for (let i in this.temp[f]) {

          let objTitle = this.temp[f][i]['name'];

          uniqueObject[objTitle] = this.temp[f][i];
        }

        for (let i in uniqueObject) {
          newArray.push(uniqueObject[i]);
        }

        console.log(newArray);

        this.temp[f] = newArray;
        this.cd.detectChanges();


        console.log(this.temp);

      }

    }
    else {
      var index = this.temp[f].findIndex(data => e['name'] == data['name']);
      console.log(index)
      if (index != -1) {
        this.temp[f].splice(index, 1);
        console.log(this.temp);

      }
      if (this.temp[f].length == 0) {
        delete this.temp[f];
        console.log(this.temp);

      }
      this.cd.detectChanges();

      console.log(this.temp);

    }
  }
  fixprice(data) {

    return parseFloat(data).toFixed(2);
  }
  getitems(i, idx) {
    console.log(i);
    console.log(idx);
    console.log(JSON.parse(localStorage.getItem('predata')));
   console.log(this.whole[this.category[idx]]);
   
         
   if(i == 'Branch'){
    this.whole[this.category[idx]].forEach(e => {
      if (e['id_branch'] == this.empData['id_branch']) {
        var branch = e
        e.status = true
        console.log(branch);
        this.gett(i,e)
      }
  
    })
  }

    this.temptwo = [];
    this.ind = idx;
    this.all = this.whole[this.category[idx]];
    this.all2 = this.whole[this.category[idx]];

    this.featurename = this.category[this.ind];
    console.log(this.all)
    console.log(this.featurename)

    console.log(this.category[this.ind]);
    // this.cd.detectChanges();
    // this.items = this.all.filter(item=>item['id']==i['id']);



  }
  getitems1(i, idx) {

    this.ind = idx;
    this.all = this.whole[this.category[idx]];
    this.all2 = this.whole[this.category[idx]];

    this.featurename = this.category[this.ind];
    console.log(this.all)
    console.log(this.featurename)

    console.log(this.category[this.ind]);
    // this.cd.detectChanges();
  }
  resetvalue() {

    this.temptwo = [];
    this.temp = {};

    this.category = Object.keys(this.whole2);

    var check = this.navParams.get('supplier') == true ? true : false;

    if (check != true) {
      this.whole = JSON.parse(localStorage.getItem('predata'));

    }
    else if (check == true) {
      this.whole = JSON.parse(localStorage.getItem('spredata'));

    }
    // this.pro['FromWt'] = 0;
    // this.pro['ToWt'] = 0;
    // this.pro['FromPrice'] = 0;
    // this.pro['ToPrice'] = 0;
    localStorage.setItem('apply', 'reset');

    this.getitems('', 0);

  }
  apply() {

    // console.log(this.pro['FromWt'])
    // if(this.pro['FromWt'] != 0){

    //   this.temp['From Weight'] = this.pro['FromWt'];
    // }
    // if(this.pro['ToWt'] != 0){
    //   this.temp['To Weight'] =  this.pro['ToWt'];

    // }
    // if(this.pro['FromPrice'] != 0){
    //   this.temp['From Price'] =  this.pro['FromPrice'];

    // }
    // if(this.pro['ToPrice'] != 0){
    //   this.temp['To Price'] =  this.pro['ToPrice'];

    // }
    this.category.forEach((element, i) => {
      if (!this.checking(this.whole[element])) {
        this.temp[element] = this.whole[element];
      }

    });
    let check = this.navParams.get('supplier') == true ? true : false;

    console.log(this.temp);

    if (check) {
      localStorage.setItem('sapply', JSON.stringify(this.temp));
      this.viewctrl.dismiss(this.temp);
      this.navCtrl.push(SupsubdesignPage, { 'filter': this.temp, 'collect': 'tt' });

    }
    else {
      localStorage.setItem('apply', JSON.stringify(this.temp));
      this.viewctrl.dismiss(this.temp);
      this.navCtrl.push(SubdesignPage, { 'filter': this.temp, 'collect': 'tt' });

    }
  }

  search() {


    this.all = this.all2.filter(item => item['name'].toUpperCase().includes(this.input.toUpperCase()));


  }
  checking(value) {
    console.log(value)

    if (value instanceof Array) {
      console.log(true)

      return true
    } else {
      console.log(false)

      return false
    }

  }
  ionViewWillLeave() {
    this.events.publish('entered', false);

  }
  ionViewWillEnter() {

    this.events.publish('entered', true);
    this.events.publish('pageno', 5);

  }
}
