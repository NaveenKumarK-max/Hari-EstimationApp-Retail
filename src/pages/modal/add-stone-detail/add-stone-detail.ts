import { Component } from "@angular/core";
import {
  Events,
  IonicPage,
  NavParams,
  ViewController,
  LoadingController,
  ToastController,
  ModalController,
} from "ionic-angular";
import { CommonProvider } from "../../../providers/common";
import { RetailProvider } from "../../../providers/retail";
import { filter } from "rxjs/operators";
import { StonesearchPage } from "../../stonesearch/stonesearch";
import { LoginPage } from "../../login/login";

/**
 * Generated class for the AddStoneDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: "page-add-stone-detail",
  templateUrl: "add-stone-detail.html",
  providers: [CommonProvider, RetailProvider],
})
export class AddStoneDetailPage {

  empData = JSON.parse(localStorage.getItem('empDetail'));
  stoneData: any = [
    {
      stone_cal_type: '',
      uom_id: '',
      is_apply_in_lwt: 0,
      lwt: false,
      stone_id: 0,
      stone_pcs: "",
      stone_wt: "",
      stone_price: "",
    },
  ];
  stoneSelected = { rate_type: "1" };
  old_stone_settings: any = 0;

  tagstoneData: any = [
    {
      amount: "",
      is_apply_in_lwt: 0,
      pieces: "",
      rate_per_gram: 0,
      stone_cal_type: '',
      stone_id: 0,
      stone_type: 0,
      tag_id: 0,
      uom_id: '',
      wt: "",
      lwt: false,

    },
  ];

  fixed_rate_type: any = "";
  action: any;
  page: any;
  stoneMasData = [];
  stones = [];
  uom = [];
  cut = [];
  clarity = [];
  color = [];
  shape = [];
  errorMsg: any;
  stnErrMsg: any = '';
  proceedSave = false;
  ptype: any = "";
  gross: any = 0;
  ctype = [
    { name: "By Wt", stone_cal_type: "1" },
    { name: "By Pcs", stone_cal_type: "2" },
  ];
  // gtype = [{'name':'Carat','uom_id':'2'},{'name':'Gram','uom_id':'1'}];
  gtype = [];
  totalvalue: any = 0
  totalgram: any = 0;
  totalct: any = 0;
  stoneMasTypes = [];
  gtype_filter = [];

  uomtype: any = [];
  tag_data: any;
  hm_type: any;
  stone_type_data: any;

  constructor(
    public modal: ModalController,
    private events: Events,
    public toast: ToastController,
    public load: LoadingController,
    public retail: RetailProvider,
    public common: CommonProvider,
    public viewCtrl: ViewController,
    public navParams: NavParams
  ) {
    console.log(this.tagstoneData);
    this.tag_data = this.navParams.get("tagData");
    console.log(this.tag_data, 'tag data');


    this.retail.getAllStoneTypes({ "id_branch": this.empData['id_branch'] }).then(data => {
      this.stoneMasTypes = data;
    })

    this.common.getuom().then((data) => {
      this.gtype_filter = data;
      console.log('UOM : ', this.gtype_filter);

      // loader.dismiss();

      this.page = this.navParams.get("page");
      this.ptype = this.navParams.get("ptype");
      this.gross = this.navParams.get("gross");
      this.hm_type = this.navParams.get('is_partial')
      console.log(this.gross);
      console.log(this.ptype);

      // if(this.hm_type == 1){
      // this.ptype = 'tag';
      // this.tag_data['is_partial'] = 1
      // }

      // this.stoneMasTypes = this.navParams.get('stoneMasTypes');
      console.log(this.stoneMasTypes, 'ppppppppp');

      this.stoneMasData = this.navParams.get("stoneMasData");
      if (this.stoneMasData) {
        this.stones = this.stoneMasData;
        this.uom = this.stoneMasData;
        this.cut = this.stoneMasData;
        this.clarity = this.stoneMasData;
        this.color = this.stoneMasData;
        this.shape = this.stoneMasData;
      }
      console.log(this.stoneMasData);

      console.log(this.navParams.get("stone_details"));

      console.log(this.ptype, 'ptyeeeeeee');

      if (this.navParams.get("stone_details").length > 0 && this.ptype == "tag") {
        this.tagstoneData = this.navParams.get("stone_details");
        console.log('taggggggggggggg');

        this.get_total()
        this.uomchange()
        this.tagstoneData.forEach((element, index) => {
          this.tagstoneData[index]["lwt"] = this.tagstoneData[index]["is_apply_in_lwt"] == 1 ? true : false;
          let tr: any[] = this.stones.filter((data) => data["stone_id"] == element["stone_id"]);

          this.tagstoneData[index]["stone_name"] = tr.length > 0 ? tr[0]["stone_name"] : [];
          this.tagstoneData[index]["show"] = true

          this.tag_stoneamount_calc(index);

        });
      } else if (this.navParams.get("stone_details").length > 0 && this.ptype != "tag") {
        this.stoneData = this.navParams.get("stone_details");
        console.log('stoneeeeeeeeeeeeeeeee');

        this.get_total();
        this.uomchange()
        this.stoneData.forEach((element, index) => {
          this.stoneData[index]["lwt"] = this.stoneData[index]["is_apply_in_lwt"] == 1 ? true : false;
          let tr: any[] = this.stones.filter((data) => data["stone_id"] == element["stone_id"]);
          this.stoneData[index]["stone_name"] = tr.length > 0 ? tr[0]["stone_name"] : [];

        });
      }
      if (this.stoneMasData) {
        this.stones = this.stoneMasData;
        this.uom = this.stoneMasData;
        this.cut = this.stoneMasData;
        this.clarity = this.stoneMasData;
        this.color = this.stoneMasData;
        this.shape = this.stoneMasData;
      }
      this.action = this.navParams.get("action");
    });



  }

  dismiss() {
    this.viewCtrl.dismiss();
  }



  updateStone(submitType) {
    if (this.ptype == "tag") {
      //  this.viewCtrl.dismiss(this.tagstoneData);
      this.viewCtrl.dismiss({
        data: this.tagstoneData,
        old_stone_settings: this.old_stone_settings,
      });
    } else {
      this.viewCtrl.dismiss({
        data: this.stoneData,
        old_stone_settings: this.old_stone_settings,
      });
    }

    // Alert Message Timeout
    setTimeout(() => {
      this.errorMsg = "";
    }, this.common.msgTimeout);
  }

/*   addStone(submitType) {
    console.log(this.stoneData);
    console.log(this.gross, '1111111');

    if (this.ptype != "tag") {
      console.log(this.stoneData, '22222222');

      for (let index = 0; index < this.stoneData.length; index++) {
        this.stone_type_data = this.stoneMasTypes.find(s => s.stone_type === this.stoneData[index]['stone_type']);

        this.get_stone_price_valid(index, this.stoneData[index]['rate'])
        if (this.stnErrMsg == "") {
          const stone = this.stoneData[index];

          // ✅ Field validation (inline)
          if (
            !stone.stone_cal_type ||
            !stone.uom_id ||
            stone.stone_id <= 0 ||
            stone.stone_pcs === null || stone.stone_pcs === undefined || stone.stone_pcs === '' ||
            stone.stone_wt === null || stone.stone_wt === undefined || stone.stone_wt === '' ||
            stone.stone_price === null || stone.stone_price === undefined || stone.stone_price === ''
          ) {
            let ctrl = this.toast.create({
              message: "* All fields in stone row are mandatory.",
              duration: this.common.toastTimeout,
              position: "bottom",
            });
            ctrl.present();
            break;
          }

          // ✅ Process stone data
          let stData = this.calcStoneDetail();
          console.log(stData["comparestone_wt"], "333333333333");

          if (stData["comparestone_wt"] < this.gross) {
            if (this.stoneData.length - 1 == index) {
              if (this.ptype == "tag") {
                this.viewCtrl.dismiss({
                  data: this.tagstoneData,
                  old_stone_settings: this.old_stone_settings,
                });
              } else {
                this.viewCtrl.dismiss({
                  data: this.stoneData,
                  old_stone_settings: this.old_stone_settings,
                  type: this.ptype,
                });
              }
            }
          } else {
            let ctrl = this.toast.create({
              message: "Please Enter Valid Stone Weight",
              duration: this.common.toastTimeout,
              position: "bottom",
            });
            ctrl.present();
            break;
          }

        } else {
          let ctrl = this.toast.create({
            message: this.stnErrMsg,
            duration: this.common.toastTimeout,
            position: "bottom",
          });
          ctrl.present();
          break;
        }
      }


      // Alert Message Timeout
      setTimeout(() => {
        this.errorMsg = "";
      }, this.common.msgTimeout);




    }

    if (this.ptype == "tag") {
      console.log(this.tagstoneData, 'pppppppppppp');

      if (this.tagstoneData.length != 0) {


        for (let index = 0; index < this.tagstoneData.length; index++) {
          console.log(this.tagstoneData[index]);
          this.stone_type_data = this.stoneMasTypes.find(s => s.stone_type === this.tagstoneData[index]['stone_type']);


          // if (this.tagstoneData[index]['is_avail_Stone_Rate_Settings'] == 1) {
          //   this.get_stone_price_valid(index, this.tagstoneData[index]['rate_per_gram'])
          // }

          if (this.stnErrMsg == "") {
            const stone = this.tagstoneData[index];

            // ✅ Field validation (inline)
            if (!stone.stone_cal_type || !stone.uom_id || !stone.stone_id || stone.pieces === null || stone.pieces === undefined || stone.pieces === '' || stone.wt === null || stone.wt === undefined || stone.wt === '' || stone.amount === null || stone.amount === undefined || stone.amount === '') {
              let ctrl = this.toast.create({
                message: "* All fields in stone row are mandatory.",
                duration: this.common.toastTimeout,
                position: "bottom",
              });
              ctrl.present();
              break;
            }

            // if (this.tagstoneData[index].stone_id > 0 && this.tagstoneData[index].pieces > 0 && this.tagstoneData[index].amount > 0 && this.tagstoneData[index].wt > 0) {
            let stData = this.calcStoneDetail();
            if (stData["comparestone_wt"] < this.gross) {
              if (this.tagstoneData.length - 1 == index) {
                if (this.ptype == "tag") {
                  // this.viewCtrl.dismiss(this.tagstoneData);
                  this.viewCtrl.dismiss({
                    data: this.tagstoneData,
                    old_stone_settings: this.old_stone_settings,
                    type: this.ptype
                  });
                } else {
                  console.log(this.stoneData);
                  this.viewCtrl.dismiss({
                    data: this.stoneData,
                    old_stone_settings: this.old_stone_settings,
                  });
                }
              }
            } else {
              let ctrl = this.toast.create({
                message: "Please Enter Valid Stone Weight ",
                duration: this.common.toastTimeout,
                position: "bottom",
              });
              ctrl.present();
              break;
            }

          } else {
            let ctrl = this.toast.create({
              message: this.stnErrMsg,
              duration: this.common.toastTimeout,
              position: "bottom",
            });
            ctrl.present();
            break;
          }

        }
      } else {

        this.viewCtrl.dismiss({
          data: this.tagstoneData,
          old_stone_settings: this.old_stone_settings,
          type: this.ptype
        });
      }


      // Alert Message Timeout
      setTimeout(() => {
        this.errorMsg = "";
      }, this.common.msgTimeout);
    }
  }
 */
// -----------------------------
// addStone() (use this in your component)
// -----------------------------
addStone(submitType) {
  // reset global error
  this.stnErrMsg = '';

  // ---------- NON-TAG FLOW ----------
  if (this.ptype != "tag") {
    for (let index = 0; index < this.stoneData.length; index++) {
      const stone = this.stoneData[index];

      // ensure stone_type_data is set for the current stone
      this.stone_type_data = this.stoneMasTypes.find(s => String(s.stone_type) === String(stone['stone_type']));

      // Step 1: Validate stone rate if required
      if (String(stone['is_avail_Stone_Rate_Settings']) === "1") {
        const ok = this.get_stone_price_valid(index, stone['rate']);
        if (!ok) {
          // get_stone_price_valid already returns false and may have updated stone.rate -> show toast from here
          let ctrl = this.toast.create({
            message: this.stnErrMsg || 'Invalid stone rate.',
            duration: this.common.toastTimeout,
            position: "bottom",
          });
          ctrl.present();
          return; // stop entire save
        }
      }

      // Step 2: Field validation
      if (
        !stone.stone_cal_type ||
        !stone.uom_id ||
        stone.stone_id <= 0 ||
        stone.stone_pcs === null || stone.stone_pcs === undefined || stone.stone_pcs === '' ||
        stone.stone_wt === null || stone.stone_wt === undefined || stone.stone_wt === '' ||
        stone.stone_price === null || stone.stone_price === undefined || stone.stone_price === ''
      ) {
        this.toast.create({
          message: "* All fields in stone row are mandatory.",
          duration: this.common.toastTimeout,
          position: "bottom",
        }).present();
        return;
      }

      // Step 3: weight compare
      let stData = this.calcStoneDetail();
      if (!(stData["comparestone_wt"] < this.gross)) {
        this.toast.create({
          message: "Please Enter Valid Stone Weight",
          duration: this.common.toastTimeout,
          position: "bottom",
        }).present();
        return;
      }

      // if last index and all ok -> dismiss
      if (index === this.stoneData.length - 1) {
        this.viewCtrl.dismiss({
          data: this.stoneData,
          old_stone_settings: this.old_stone_settings,
          type: this.ptype,

        });
        return;
      }
    }
  }

  // ---------- TAG FLOW ----------
  if (this.ptype == "tag") {
    if (!this.tagstoneData || this.tagstoneData.length === 0) {
      this.viewCtrl.dismiss({
        data: this.tagstoneData,
        old_stone_settings: this.old_stone_settings,
        type: this.ptype
      });
      return;
    }

    for (let index = 0; index < this.tagstoneData.length; index++) {
      const stone = this.tagstoneData[index];

      // ensure stone_type_data is set for the current stone
      this.stone_type_data = this.stoneMasTypes.find(s => String(s.stone_type) === String(stone['stone_type']));

      // Step 1: Validate stone rate if required
      if (String(stone['is_avail_Stone_Rate_Settings']) === "1") {
        const ok = this.get_stone_price_valid(index, stone['rate_per_gram']);
        if (!ok) {
          let ctrl = this.toast.create({
            message: this.stnErrMsg || 'Invalid stone rate.',
            duration: this.common.toastTimeout,
            position: "bottom",
          });
          ctrl.present();
          return; // stop save
        }
      }

      // Step 2: Field validation
      if (
        !stone.stone_cal_type ||
        !stone.uom_id ||
        !stone.stone_id ||
        stone.pieces === null || stone.pieces === undefined || stone.pieces === '' ||
        stone.wt === null || stone.wt === undefined || stone.wt === '' ||
        stone.amount === null || stone.amount === undefined || stone.amount === ''
      ) {
        this.toast.create({
          message: "* All fields in stone row are mandatory.",
          duration: this.common.toastTimeout,
          position: "bottom",
        }).present();
        return;
      }

      // Step 3: weight compare
      let stData = this.calcStoneDetail();
      if (!(stData["comparestone_wt"] < this.gross)) {
        this.toast.create({
          message: "Please Enter Valid Stone Weight",
          duration: this.common.toastTimeout,
          position: "bottom",
        }).present();
        return;
      }

      console.log('tag : ',this.tagstoneData);
      

      // if last and all ok -> dismiss
      if (index === this.tagstoneData.length - 1) {
        this.viewCtrl.dismiss({
          data: this.tagstoneData,
          old_stone_settings: this.old_stone_settings,
          type: this.ptype,
          tot_stone_value: this.totalvalue
        });
        return;
      }
    }
  }
}

get_stone_price_valid(index, rate_per_gram) {
  const stone = this.ptype == "tag" ? this.tagstoneData[index] : this.stoneData[index];
  const stoneRate = Math.round(parseFloat(rate_per_gram)); // ✅ Force whole number
  const stoneWt = parseFloat(stone['wt'] || stone['stone_wt']) || 0;
  const stonePcs = parseInt(stone['pieces'] || stone['stone_pcs']) || 0;
  const stoneCentWt = stonePcs > 0 ? parseFloat(((stoneWt / stonePcs) * 100).toFixed(3)) : 0;

  this.stnErrMsg = ""; // reset error
  const settings = (this.stone_type_data && this.stone_type_data.stone_rate_masters)
    ? this.stone_type_data.stone_rate_masters
    : [];

  let foundSetting = false;
  let isValid = false;

  // ✅ If no validation needed, allow directly
  if (String(stone['is_avail_Stone_Rate_Settings']) === "0") {
    stone['rate_per_gram'] = stoneRate; // ensure stored as whole number
    return true;
  }

  settings.forEach(item => {
    if (
      stone['stone_type'] == item.stone_type &&
      stone['stone_id'] == item.stone_id &&
      stone['uom_id'] == item.uom_id &&
      (stone['quality_id'] == item.quality_id || item.quality_id == '')
    ) {
      foundSetting = true;

      // ✅ Range check
      if (stoneCentWt > 0) {
        if (stoneCentWt >= parseFloat(item.from_cent) && stoneCentWt <= parseFloat(item.to_cent)) {
          if (stoneRate >= parseFloat(item.min_rate) && stoneRate <= parseFloat(item.max_rate)) {
            isValid = true;
          } else {
            this.stnErrMsg = `Entered Stone Rate must be within ${item.min_rate} and ${item.max_rate}!`;
          }
        }
      } else {
        if (stoneRate >= parseFloat(item.min_rate) && stoneRate <= parseFloat(item.max_rate)) {
          isValid = true;
        } else {
          this.stnErrMsg = `Entered Stone Rate must be within ${item.min_rate} and ${item.max_rate}!`;
        }
      }
    }
  });

  if (!foundSetting) {
    this.stnErrMsg = "No valid stone rate setting found for this stone.";
  }

  // ✅ Always store rate as integer (no decimals)
  stone['rate_per_gram'] = isNaN(stoneRate) ? 0 : parseInt(String(stoneRate), 10);

  return isValid;
}




/* old version of stone rate validation function

  get_stone_price_valid(index, data) {
    console.log(this.stone_type_data, 'stone type data');
    console.log(data, 'price');
    console.log('this.tagstoneData[index] : ', this.tagstoneData[index]);

    var rate_per = parseFloat(data);
    if (this.stone_type_data) {
      if (this.stone_type_data['stone_type'] == '1') {

        const wt = this.ptype == 'tag' ? parseFloat(this.tagstoneData[index]['wt']) * 100 : parseFloat(this.stoneData[index]['stone_wt']) * 100;
        console.log(wt, 'weight : ');

        let validRate = false;

        if (this.stone_type_data['stone_rate_masters'].length != 0) {
          this.stone_type_data['stone_rate_masters'].forEach(element => {
            const frm_cent = parseFloat(element['from_cent']);
            const to_cent = parseFloat(element['to_cent']);

            // check if weight falls in the range
            if (wt >= frm_cent && wt <= to_cent) {
              const max_rate = parseFloat(element['max_rate']);
              const min_rate = parseFloat(element['min_rate']);

              if (rate_per >= min_rate && rate_per <= max_rate) {
                validRate = true;
              }
            } else {
              validRate = true;
            }
          });
          // Set error message based on validation
          if (validRate) {
            this.stnErrMsg = '';
          } else {
            this.stnErrMsg = "Please Enter Valid Stone Rate";
          }
        } else {
          this.stnErrMsg = '';
        }

      } else {

        if (this.stone_type_data['stone_rate_masters'].length != 0) {
          this.stone_type_data['stone_rate_masters'].forEach(element => {
            var max_rate = parseFloat(element['max_rate']);
            var min_rate = parseFloat(element['min_rate']);
            if (rate_per <= max_rate && rate_per >= min_rate) {
              this.stnErrMsg = '';
            } else {
              this.stnErrMsg = "Please Enter Valid Stone Rate";
            }

            console.log(this.stnErrMsg, 'error');


          });
        } else {
          this.stnErrMsg = '';
        }

      }


    }
  }
 */
  stoneChanged() {
    // this.stoneData['rate'] = 0;
    // this.stoneData['stone_price'] = 0;
    // if(this.stoneData['stone_id'] > 0){
    //   let filterData =  this.stones.filter((s: any) => s.stone_id == this.stoneData['stone_id']);
    //   this.stoneSelected = filterData[0];
    //   this.stoneData['rate'] = parseFloat(this.stoneSelected['rate_type']) == 1 ? parseFloat(this.stoneSelected['fixed_rate']) : "";
    //   this.fixed_rate_type = parseFloat(this.stoneSelected['fixed_rate_type']) == 1 ? "Per Gram" : (parseFloat(this.stoneSelected['fixed_rate_type']) == 2 ? "Per Piece" : "" );
    // }
  }

  calcStoneValue() {
    // let stn_price:any = 0;
    // if(this.stoneData['stone_id'] > 0 && this.stoneData['stone_pcs'] > 0 && this.stoneData['stone_wt'] > 0 && this.stoneData['stone_price'] > 0  ){
    //   this.proceedSave = true;
    // }else{
    //   this.proceedSave = false;
    // }
    // if(this.stoneData['stone_id'] > 0 && this.stoneData['stone_pcs'] > 0 && this.stoneData['stone_wt'] > 0 && this.stoneData['stone_price'] > 0){
    // let rate_type = parseFloat(this.stoneSelected['rate_type']);
    // let fixed_rate_type = parseFloat(this.stoneSelected['fixed_rate_type']);
    // Rate Type => 1-Fixed, 2 - Rate From Master, 3 - Manual
    // if(rate_type == 1 || rate_type == 3)
    // {
    //   if(fixed_rate_type == 1) //Fixed Rate Type => 1-Per Gram,2-Per Piece
    //   {
    //     stn_price = this.stoneData['rate']*parseFloat(this.stoneData['stone_wt']);
    //   }
    //   else{
    //     stn_price = this.stoneData['rate']*parseFloat(this.stoneData['stone_pcs']);
    //   }
    // }
    // else if(rate_type == 2)
    // {
    //   console.log(this.stoneData['rate_details']);
    //   this.stoneData['rate_details'].forEach( rate => {
    //     if(rate.cent_from <= this.stoneData['stone_wt'] && this.stoneData['stone_wt'] <= rate.cent_to)
    //     {
    //       this.stoneData['rate'] = rate.rate;
    //       stn_price = parseFloat(rate.rate)*parseFloat(this.stoneData['stone_wt']);
    //     }
    //   })
    // }
    // }
    // this.stoneData['stone_price'] = parseFloat(stn_price) + parseFloat(this.stoneData['certif_charge']);
  }
  add() {
    if (this.ptype == "tag") {
      this.tagstoneData.push({
        amount: "",
        is_apply_in_lwt: 0,
        pieces: "",
        rate_per_gram: 0,
        stone_cal_type: "",
        stone_id: 0,
        stone_type: 0,
        tag_id: 0,
        uom_id: "",
        wt: "",
        lwt: false,
        show: false
      });
    } else {
      this.stoneData.push({
        is_apply_in_lwt: 0,
        lwt: false,
        stone_id: 0,
        stone_pcs: "",
        stone_wt: "",
        stone_price: "",
        stone_cal_type: "",
        uom_id: "",
      });
    }
  }
  remove(i) {
    this.totalvalue = 0;
    this.totalgram = 0;
    this.totalct = 0;
    if (this.ptype == "tag") {
      if (this.tagstoneData.length > 1) {
        this.tagstoneData.splice(i, 1);
      } else if (this.tagstoneData.length == 1) {
        this.tagstoneData.splice(i, 1);

        // this.tagstoneData.push({
        //   amount: 0,
        //   is_apply_in_lwt: 0,
        //   pieces: "",
        //   rate_per_gram: 0,
        //   stone_cal_type: "",
        //   stone_id: 0,
        //   stone_type: 0,
        //   tag_id: 0,
        //   uom_id: "",
        //   wt: "",
        //   lwt: false,
        // });
      }

      for (let index = 0; index < this.tagstoneData.length; index++) {
        // this.totalvalue += parseFloat(this.tagstoneData[index].amount)
        console.log(this.totalvalue, 'total value');
        const amt = parseFloat(this.tagstoneData[index].amount);
        if (!isNaN(amt)) {
          this.totalvalue += amt;
        }

        if (this.tagstoneData[index]['uom_id'] == 1) {
          // this.totalgram += parseFloat(this.tagstoneData[index]['wt'] )
          let data: any = Number(this.totalgram) + Number(this.tagstoneData[index]['wt'])
          this.totalgram = data.toFixed(3)
        } else if (this.tagstoneData[index]['uom_id'] == 6) {
          // this.totalct += parseFloat(this.tagstoneData[index]['wt'] )
          let data: any = Number(this.totalct) + Number(this.tagstoneData[index]['wt'])
          this.totalct = data.toFixed(3)
        }
        this.get_stone_price_valid(index, this.tagstoneData[index]['rate_per_gram'])

      }
    } else {
      console.log(this.stoneData);

      if (this.stoneData.length > 1) {
        this.stoneData.splice(i, 1);
      } else if (this.stoneData.length == 1) {
        this.stoneData.splice(i, 1);

        this.stoneData.push({
          is_apply_in_lwt: 0,
          lwt: false,
          stone_id: 0,
          stone_pcs: "",
          stone_wt: "",
          stone_price: 0,
          stone_cal_type: "",
          uom_id: "",
        });
      }
      for (let index = 0; index < this.stoneData.length; index++) {
        // this.totalvalue += parseFloat(this.stoneData[index].stone_price)
        const amt = parseFloat(this.stoneData[index].stone_price);
        if (!isNaN(amt)) {
          this.totalvalue += amt;
        }
        if (this.stoneData[index]['uom_id'] == 1) {
          // this.totalgram += parseFloat(this.stoneData[index]['stone_wt'] )
          let data: any = Number(this.totalgram) + Number(this.stoneData[index]['stone_wt'])
          this.totalgram = data.toFixed(3)
        } else if (this.stoneData[index]['uom_id'] == 6) {
          // this.totalct += parseFloat(this.stoneData[index]['stone_wt'] )
          let data: any = Number(this.totalct) + Number(this.stoneData[index]['stone_wt'])
          this.totalct = data.toFixed(3)
        }
        this.get_stone_price_valid(index, this.stoneData[index]['rate'])
      }

    }
  }
  checkt(index) {
    this.tagstoneData[index]["is_apply_in_lwt"] = this.tagstoneData[index]["lwt"] == true ? 1 : 0;
    console.log('checkbox : ', this.tagstoneData[index]["is_apply_in_lwt"]);
    console.log('LWT :', this.tagstoneData[index]["lwt"]);

  }
  checko(index) {
    this.stoneData[index]["is_apply_in_lwt"] = this.stoneData[index]["lwt"] == true ? 1 : 0;
  }
  oldstone() {
    this.old_stone_settings = this.old_stone_settings == true ? 1 : 0;
    console.log(this.old_stone_settings);
  }
  tot(i) {
    this.tagstoneData[i]["amount"] =
      this.tagstoneData[i]["amount"] * this.tagstoneData[i]["wt"];
  }

  uomchange() {
    this.totalgram = 0;
    this.totalct = 0;
    if (this.ptype == "tag") {
      for (let index = 0; index < this.tagstoneData.length; index++) {

        if (this.tagstoneData[index]['uom_id'] == 1) {
          // this.totalgram += parseFloat(this.tagstoneData[index]['wt'] )
          let data: any = Number(this.totalgram) + Number(this.tagstoneData[index]['wt'])
          this.totalgram = data.toFixed(3)
          console.log(this.totalgram, 'gram');
        } else if (this.tagstoneData[index]['uom_id'] == 6) {
          // this.totalct += parseFloat(this.tagstoneData[index]['wt'] )
          let data: any = Number(this.totalct) + Number(this.tagstoneData[index]['wt'])
          this.totalct = data.toFixed(3)
          console.log(this.totalct, 'cart');
        }
      }
    } else {
      console.log('stone : ', this.stoneData);

      for (let index = 0; index < this.stoneData.length; index++) {

        if (this.stoneData[index]['uom_id'] == 1) {
          // this.totalgram += parseFloat(this.stoneData[index]['stone_wt'] )
          let data: any = Number(this.totalgram) + Number(this.stoneData[index]['stone_wt'])
          this.totalgram = data.toFixed(3)
          console.log(this.totalgram, 'gram');
        } else if (this.stoneData[index]['uom_id'] == 6) {
          // this.totalct += parseFloat(this.stoneData[index]['stone_wt'] )
          let data: any = Number(this.totalct) + Number(this.stoneData[index]['stone_wt'])
          this.totalct = data.toFixed(3)
          console.log(this.totalct, 'cart');
        }
      }

    }
  }

  calcStoneDetail() {
    if (this.ptype == "tag") {
      let data = { wt: 0, amount: 0, "comparestone_wt": 0 };
      this.tagstoneData.forEach((i, index) => {
        if (this.tagstoneData[index]["lwt"]) {
          this.tagstoneData[index]["is_apply_in_lwt"] = 1;
        } else {
          this.tagstoneData[index]["is_apply_in_lwt"] = 0;
        }
        data["wt"] = data["wt"] + Number(i["wt"]);
        data['comparestone_wt'] = data['comparestone_wt'] + (i['uom_id'] == '6' ? Number(i['wt']) / 5 : Number(i['wt']));

        data["amount"] = data["amount"] + Number(i["amount"]);
      });
      return data;
    } else {
      let data = { stone_wt: 0, stone_price: 0, "comparestone_wt": 0 };
      this.stoneData.forEach((i, index) => {
        if (this.stoneData[index]["lwt"]) {
          this.stoneData[index]["is_apply_in_lwt"] = 1;
        } else {
          this.stoneData[index]["is_apply_in_lwt"] = 0;
        }
        data["stone_wt"] = data["stone_wt"] + Number(i["stone_wt"]);
        data['comparestone_wt'] = data['comparestone_wt'] + (i['uom_id'] == '6' ? Number(i['stone_wt']) / 5 : Number(i['stone_wt']));

        data["stone_price"] = data["stone_price"] + Number(i["stone_price"]);
      });
      return data;
    }
  }

  ionViewWillLeave() {
    this.events.publish("entered", false);
  }
  ionViewWillEnter() {
    this.events.publish("entered", true);
    this.events.publish("pageno", 1);

  }

  tag_stoneamount_calc(i) {
    if (this.tagstoneData[i]["stone_cal_type"] == "2") {
      this.tagstoneData[i]["amount"] = (this.tagstoneData[i]["pieces"] * this.tagstoneData[i]["rate_per_gram"]).toFixed(3);
    } else if (this.tagstoneData[i]["stone_cal_type"] == "1") {
      this.tagstoneData[i]["amount"] = (this.tagstoneData[i]["wt"] * this.tagstoneData[i]["rate_per_gram"]).toFixed(3);
    }
  }

  ctypecheck(i,type) {
    // if (this.tagstoneData[i]["stone_cal_type"] == "2") {
    //   this.tagstoneData[i]["amount"] =
    //     this.tagstoneData[i]["pieces"] * this.tagstoneData[i]["rate_per_gram"];

    // } else if (this.tagstoneData[i]["stone_cal_type"] == "1") {
    //   this.tagstoneData[i]["amount"] =
    //     this.tagstoneData[i]["wt"] * this.tagstoneData[i]["rate_per_gram"];
    //     this.uomchange()

    // }

    // if(type == 'rate'){
    //   this.get_total()
    //   }
console.log('111111111111');


 if(type != 'amt') {
  console.log('2222222222222');
  
   if (this.tagstoneData[i]["stone_cal_type"] == "2") {
      this.tagstoneData[i]["amount"] =
        (this.tagstoneData[i]["pieces"] * this.tagstoneData[i]["rate_per_gram"]).toFixed(3);
    } else if (this.tagstoneData[i]["stone_cal_type"] == "1") {
      this.tagstoneData[i]["amount"] =
        (this.tagstoneData[i]["wt"] * this.tagstoneData[i]["rate_per_gram"]).toFixed(3);
    }
        this.uomchange()
   
   }else{
    console.log('3333333333333333');
    
      if (this.tagstoneData[i]["stone_cal_type"] == "2") {
      this.tagstoneData[i]["rate_per_gram"] =
        (this.tagstoneData[i]["pieces"] * this.tagstoneData[i]["amount"]).toFixed(3);
    } else if (this.tagstoneData[i]["stone_cal_type"] == "1") {
      this.tagstoneData[i]["rate_per_gram"] = (this.tagstoneData[i]["amount"] / this.tagstoneData[i]["wt"]).toFixed(3);
    }
   }

    if(type == 'rate' || type == 'amt' || type == 'wt'){
      // this.stone_type_data= this.stoneMasTypes.find(s => s.stone_type === this.tagstoneData[i]['stone_type']);
      //  this.get_stone_price_valid(i,this.tagstoneData[i]["rate_per_gram"])
      this.get_total()
      }

  }
  ctypecheck2(i, type) {

    if (type != 'amt') {
      if (this.stoneData[i]["stone_cal_type"] == "2") {
        this.stoneData[i]["stone_price"] =
          (this.stoneData[i]["stone_pcs"] * this.stoneData[i]["rate"]).toFixed(3);
      } else if (this.stoneData[i]["stone_cal_type"] == "1") {
        this.stoneData[i]["stone_price"] =
          (this.stoneData[i]["stone_wt"] * this.stoneData[i]["rate"]).toFixed(3);
      }
      this.uomchange()

    } else {
      if (this.stoneData[i]["stone_cal_type"] == "2") {
        this.stoneData[i]["rate"] =
          (this.stoneData[i]["stone_pcs"] * this.stoneData[i]["stone_price"]).toFixed(3);
      } else if (this.stoneData[i]["stone_cal_type"] == "1") {
        this.stoneData[i]["rate"] = (this.stoneData[i]["stone_price"] / this.stoneData[i]["stone_wt"]).toFixed(3);
      }

    }

    if (type == 'rate' || type == 'amt' || type == 'wt') {
      //  this.stone_type_data= this.stoneMasTypes.find(s => s.stone_type === this.stoneData[i]['stone_type']);
      //  this.get_stone_price_valid(i,this.stoneData[i]["rate"])
      this.get_total()
    }

  }

  /*  openstoneModal(i){
    let modal = this.modal.create(StonesearchPage,{"empData" : this.stones})
    modal.present();
    modal.onDidDismiss(data => {
      if(data != null){
      this.tagstoneData[i]['stone_id'] = data.stone_id;
      this.tagstoneData[i]['stone_name'] = data.stone_name;
 
      }
    });
    } */

  openstoneModal(i) {
    console.log(this.tagstoneData[i]["stone_name"]);
    if (this.tagstoneData[i]["stone_name"] == undefined) {
      let modal = this.modal.create(StonesearchPage, { empData: this.stones });
      modal.present();
      modal.onDidDismiss((data) => {
        if (data != null) {
          this.tagstoneData[i]["stone_id"] = data.stone_id;
          this.tagstoneData[i]["stone_name"] = data.stone_name;
        }
      });
    }
  }

  openstoneModal2(i) {
    let modal = this.modal.create(StonesearchPage, { empData: this.stones });
    modal.present();
    modal.onDidDismiss((data) => {
      if (data != null) {
        this.stoneData[i]["stone_id"] = data.stone_id;
        this.stoneData[i]["stone_name"] = data.stone_name;
      }
    });
  }
  public onKeyUp(event: any) {
    // let newValue = event.target.value;
    // const charCode = (event.which) ? event.which : event.keyCode;
    // if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    //   event.target.value = newValue.slice(0, -1);
    //   return false;
    // }
    // return true;
  }

  get_total() {

    // console.log(this.stoneData);
    console.log(this.tagstoneData, 'ppppppppppp');
    console.log(this.stoneData, 'ooooooooooo');

    this.totalvalue = 0;
    // this.totalgram = 0;
    // this.totalct = 0;
    if (this.ptype == "tag") {
      for (let index = 0; index < this.tagstoneData.length; index++) {
        console.log(this.tagstoneData[index].amount);
        // this.totalvalue+=parseFloat(this.tagstoneData[index]['amount']);
        const amt = parseFloat(this.tagstoneData[index].amount);
        if (!isNaN(amt)) {
          this.totalvalue = parseFloat((this.totalvalue + amt).toFixed(3));
        }


        // naveen 
        //     if(this.tagstoneData[index]['stone_type'] == 1){ 
        //       this.gtype =[]
        //       this.gtype.push(this.gtype_filter[1])  
        //    }else{
        //       this.uomtype = [];
        //       this.uomtype.push(this.gtype_filter[0]) 

        // }
        // if( this.tagstoneData[index]['uom_id'] == 1){
        //   this.totalgram += parseFloat(this.tagstoneData[index]['wt'] )
        // }else if( this.tagstoneData[index]['uom_id'] == 6){
        //   this.totalct += parseFloat(this.tagstoneData[index]['wt'] )
        // }
      }
    } else {
      for (let index = 0; index < this.stoneData.length; index++) {
        console.log(this.stoneData[index].stone_price);
        // this.totalvalue+=parseFloat( this.stoneData[index]['stone_price']); 
        const amt = parseFloat(this.stoneData[index].stone_price);
        if (!isNaN(amt)) {
          this.totalvalue += amt;
        }
        if (this.stoneData[index]['stone_type'] == 1) {
          this.gtype = []
          this.gtype.push(this.gtype_filter[1])
        } else {
          this.uomtype = [];
          this.uomtype.push(this.gtype_filter[0])

        }
        // if( this.tagstoneData[index]['uom_id'] == 1){
        //   this.totalgram += parseFloat(this.tagstoneData[index]['wt'] )
        // }else if( this.tagstoneData[index]['uom_id'] == 6){
        //   this.totalct += parseFloat(this.tagstoneData[index]['wt'] )
        // }
      }

    }

    //  this.totalvalue =Number(totalvalue1 + totalvalue2) 
    console.log(this.totalvalue);


  }

  typechange(i) {

    if (this.ptype == "tag") {
      console.log(this.tagstoneData[i]['stone_type']);
      this.stones = this.stoneMasData;
      let typestone: any[] = this.stones.filter(data => data['stone_type'] == this.tagstoneData[i]['stone_type'])
      this.stones = typestone;
      console.log(this.stones);
      console.log('1 : ', i);

      // this.get_type(i)
    } else {
      this.stoneData[i]['uom_id'] = '';
      console.log('12 : ', this.stoneData[i]['stone_type']);
      this.stones = this.stoneMasData;
      let typestone: any[] = this.stones.filter(data => data['stone_type'] == this.stoneData[i]['stone_type'])
      this.stones = typestone;
      console.log('13 : ', this.stones);
      console.log('14 : ', i);


      this.get_type(i)
    }


  }


  get_type(i) {
    console.log('15 : ', i);

    for (let index = 0; index < this.gtype_filter.length; index++) {
      if (this.stoneData[i]['stone_type'] == 1) {
        this.gtype = []
        console.log('16 : ', this.gtype);
        this.gtype.push(this.gtype_filter[1])
      } else {
        this.uomtype = [];
        console.log('17 : ', this.gtype);
        this.uomtype.push(this.gtype_filter[0])
      }
    }
  }


}
