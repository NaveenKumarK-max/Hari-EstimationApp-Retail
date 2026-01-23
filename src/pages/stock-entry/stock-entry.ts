import { Component, Pipe, PipeTransform, trigger, state, style, transition, animate, keyframes, ElementRef ,ViewChild   } from '@angular/core';
import { NavController, Events, LoadingController, ToastController, ModalController, Platform, NavParams   } from 'ionic-angular';
import { DecimalPipe } from '@angular/common';
// import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { Printer, PrintOptions } from '@ionic-native/printer';
import { CommonProvider } from '../../providers/common';
import { RetailProvider } from '../../providers/retail';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { HomePage } from '../home/home';

/*
  Generated class for the StockCodeEntry page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-stock-entry',
  templateUrl: 'stock-entry.html',
  providers: [CommonProvider, RetailProvider]

})

export class StockCodeEntryPage {    
  fileTransfer: FileTransferObject = this.transfer.create();
  empData = JSON.parse(localStorage.getItem('empDetail'));
  scannerOn = false;
  loggedInBranch :any;
  settings = [];
  ret_settings = [];
  stock = [];
  tags = [];
  tagMsg = "";
  tagErrorMsg = "";
  tag_code = "";

  constructor(public navParams: NavParams, private navCtrl: NavController, public load:LoadingController, private printer : Printer, private nav: NavController, private events: Events, private commonservice: CommonProvider, public retail:RetailProvider, private toast: ToastController, private event: Events, public modal: ModalController, public common: CommonProvider,private fileOpener: FileOpener,private transfer: FileTransfer,public file:File,private filePath: FilePath, private fileChooser: FileChooser,public  platform: Platform) {
    this.nav = nav; 
    this.loggedInBranch = this.empData['id_branch'];
  } 

  ionViewDidLoad() { 
      let loader = this.load.create({
        content: 'Please Wait',
        spinner: 'bubbles',
      });
      loader.present();
      this.common.getCurrencyAndSettings({"id_branch":this.loggedInBranch}).then(data=>{
        this.settings = data.settings;
        this.ret_settings = data.ret_settings;
        this.events.publish('settings:loaded', true);
        this.events.publish('ret_settings:loaded', true);
        loader.dismiss();
      })   
  }

  /* for footer as hide in default. it's assigned in app.components.ts */
  
  
  getTagData(tag_code){
    if (tag_code.length > 0) {
      let loader = this.load.create({
        content: 'Please Wait',
        spinner: 'bubbles',
      });
      loader.present();
      var postData = {"type":'stockEntry',"searchTxt":tag_code,"searchField":"tag_code"};
      this.retail.getTagData(postData).then(data=>{
        if(data.status){
            var tagAvailable = false;
			this.tags.forEach(function (tag) {
			  if(tag.tag_code == data.tagData.tag_code){
				  tagAvailable = true;
			  }
			}); 
			if(tagAvailable){
				let toastMsg = this.toast.create({
					message: data.msg,
					duration: this.common.toastTimeout,
					position: 'center'
				  });
				  toastMsg.present();
			}else{
				this.tags.push(data.tagData);			
			}
        }else{
          this.tags = [];
          let toastMsg = this.toast.create({
			message: data.msg,
			duration: this.common.toastTimeout,
			position: 'center'
		  });
		  toastMsg.present();
        }
        loader.dismiss();
      })
    }else{
      let toastMsg = this.toast.create({
						message: "Enter Tag Code",
						duration: this.common.toastTimeout,
						position: 'center'
					  });
	  toastMsg.present(); 
    }
  }
  
  deleteItem(item_type, idx){
	let loader = this.load.create({
	content: 'Please Wait',
	spinner: 'bubbles',
	}); 
	this.tags.splice(idx, 1);
	let toastMsg = this.toast.create({
			message: "Tag removed from list",
			duration: this.common.toastTimeout,
			position: 'center'
		  });
	toastMsg.present();  
    loader.dismiss();
  }

  ionViewWillLeave(){
    this.events.publish( 'entered', false );						
  
    }
  ionViewWillEnter(){
  
  this.events.publish( 'entered', true );						
  this.events.publish( 'pageno', 1 );	
  
  }
}
