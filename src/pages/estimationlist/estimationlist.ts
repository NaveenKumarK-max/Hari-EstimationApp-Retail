import { filter } from 'rxjs/operators';
import { Component } from '@angular/core';
import { Events,IonicPage, NavController, NavParams,LoadingController, ToastController, ModalController, Platform } from 'ionic-angular';
import { CommonProvider } from '../../providers/common';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { RetailProvider } from '../../providers/retail';
import { HomePage } from '../home/home';
import { BluetoothPage } from '../bluetooth/bluetooth';
import { Printer, PrintOptions } from '@ionic-native/printer';
import { CusupdatePage } from '../cusupdate/cusupdate';
import { EstiPage } from '../estimation/estimation';
import { AndroidPermissions } from '@ionic-native/android-permissions';

// import { CusupdatePage } from '../cusupdate/cusupdate';

/**
 * Generated class for the EstimationlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-estimationlist',
  templateUrl: 'estimationlist.html',
  providers: [CommonProvider, RetailProvider]

})
export class EstimationlistPage {

  fileTransfer: FileTransferObject = this.transfer.create();

  empData = JSON.parse(localStorage.getItem('empDetail'));
  estiDetail = {};
  loggedInBranch :any;
  list:any[] = [];
  slist:any[] = [];

  estno:any = '';

  constructor(private androidPermissions: AndroidPermissions,private events: Events,private printer : Printer,public retail:RetailProvider,public navParams: NavParams, private navCtrl: NavController, public load:LoadingController, private nav: NavController, private commonservice: CommonProvider, private toast: ToastController, public modal: ModalController, public common: CommonProvider,private fileOpener: FileOpener,private transfer: FileTransfer,public file:File,private filePath: FilePath, private fileChooser: FileChooser,public  platform: Platform) {


    console.log(this.empData['id_branch'])
    console.log(this.empData['uid'])
    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();
    this.commonservice.getlist({'id_branch':this.empData['id_branch'],'id_emp':this.empData['uid'],'type':this.navParams.get('dd')}).then(res => {

      this.list = res['estdetails'];
      this.slist = res['estdetails'];

      loader.dismiss();
    },err=>{
      loader.dismiss();
    });
  }

  edit(data){

    this.navCtrl.push(CusupdatePage,{'id':data})
  }

  edittag(data){
    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();
    console.log(data['estimation_id'])
    this.commonservice.getedit(data['estimation_id']).then(res => {

      let tag = res.hasOwnProperty('tag_details') ? res['tag_details']: [];
      let non_tag = res.hasOwnProperty('non_tag_details') ? res['non_tag_details'] : [];
      let home_bill = res.hasOwnProperty('est_home_bill') ? res['est_home_bill'] : [];
      let old_metal = res.hasOwnProperty('old_metal') ? res['old_metal'] :[];


      console.log(tag)
      loader.dismiss();
      // this.navCtrl.push(EstiPage,{'tag':temp});
      this.nav.push(EstiPage,{'estimation':res['estimation'],'old_metal':old_metal,'home_bill':home_bill,'non_tag':non_tag,'tag':tag,"page_type" : 'create','empname':this.empData['username'],'empid':this.empData['uid'],'bname':'','bid':this.empData['id_branch']});

    },err=>{
      loader.dismiss();
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad EstimationlistPage');
  }
  print(data){
    this.nav.push(BluetoothPage,{'file':data})

  }
  ionViewWillLeave(){
    this.events.publish( 'entered', false );

    }
  ionViewWillEnter(){

  this.events.publish( 'entered', true );
  this.events.publish( 'pageno', 1 );

  }
  searchesti(){

  this.list = this.slist.filter(data =>
  data['esti_no'].toLowerCase().includes(this.estno.toLowerCase()) ||
  data['mobile'].toLowerCase().includes(this.estno.toLowerCase()) ||
  data['firstname'].toLowerCase().includes(this.estno.toLowerCase())
);
  }
  getEstiByEstiNo(no){
    if(no != ''){
      let loader = this.load.create({
        content: 'Please Wait',
        spinner: 'bubbles',
      });
      loader.present();
      this.retail.getEstiPrintURL({
        "esti_no": no,
        "id_branch": this.empData['id_branch']
      } ).then(data=>{
        if(data.status){
          if(data.printURL != ''){
            console.log(data.printURL);
            this.downloadfile(data.printURL,data.esti_name);
          }
        }
        loader.dismiss();
        let toastMsg = this.toast.create({
          message: data.msg,
          duration: this.common.toastTimeout,
          position: 'center'
        });
        toastMsg.present();
      })
    }else{
      let toastMsg = this.toast.create({
        message: "Enter valid estimation number",
        duration: this.common.toastTimeout,
        position: 'center'
      });
      toastMsg.present();
    }
  }

  // downloadfile(url,name) {
  //   console.log(url)
  //   var date = new Date();
  //   date.setDate(date.getDate());
  //   console.log(date.toISOString().split('T')[0])
  //   this.platform.ready().then(() =>{
  //     console.log("Platform ready");
  //     if(this.platform.is('android')) {
  //       console.log("Platform Android");
  //       this.file.checkDir(this.file.externalDataDirectory, this.common.cmpShortName).then((data) => {
  //         console.log("Check directory IDO");
  //         this.file.checkDir(this.file.externalDataDirectory+''+this.common.cmpShortName+'/', date.toISOString().split('T')[0]).then(_ => {
  //           console.log("Check directory IDO "+date.toISOString().split('T')[0]);
  //           this.viewFile(url,name);
  //         }).catch(er => {
  //             this.file.createDir(this.file.externalDataDirectory+''+this.common.cmpShortName+'/', date.toISOString().split('T')[0],false).then(_ => {
  //               console.log("Create directory IDO "+date.toISOString().split('T')[0]);
  //               this.viewFile(url,name);
  //             }).catch(err => {
  //               console.log(err);
  //               console.log('Couldn\'t create directory')
  //             });
  //         });
  //       }).catch(err => {
  //         this.file.createDir(this.file.externalDataDirectory, this.common.cmpShortName,false).then(_ => {
  //           console.log('Create directory IDO')
  //           this.file.createDir(this.file.externalDataDirectory+''+this.common.cmpShortName+'/', date.toISOString().split('T')[0],false).then(_ => {
  //             console.log('Create directory IDO / '+date.toISOString().split('T')[0]);
  //             this.viewFile(url,name);
  //           }).catch(err1 => {
  //           console.log(err1);
  //           console.log('Couldn\'t create directory')
  //           });
  //         }).catch(err2 =>{
  //           console.log(err2);
  //           console.log('Couldn\'t create directory')});
  //       });
  //     }
  //   });
  // }

  downloadfile(url,name) {
    console.log(url)
    var date = new Date();
    date.setDate(date.getDate());
    console.log(date.toISOString().split('T')[0])
    this.platform.ready().then(() =>{
      console.log("Platform ready");
      if(this.platform.is('android')) {
        console.log("Platform Android");
        this.file.checkDir(this.file.externalDataDirectory, this.common.cmpShortName).then((data) => {
          console.log("Check directory IDO");
          this.file.checkDir(this.file.externalDataDirectory+''+this.common.cmpShortName+'/', date.toISOString().split('T')[0]).then(_ => {
            console.log("Check directory IDO "+date.toISOString().split('T')[0]);
            this.viewFile(url,name);
          }).catch(er => {
              this.file.createDir(this.file.externalDataDirectory+''+this.common.cmpShortName+'/', date.toISOString().split('T')[0],false).then(_ => {
                console.log("Create directory IDO "+date.toISOString().split('T')[0]);
                this.viewFile(url,name);
              }).catch(err => {
                console.log(err);
                console.log('Couldn\'t create directory')
              });
          });
        }).catch(err => {
          this.file.createDir(this.file.externalDataDirectory, this.common.cmpShortName,false).then(_ => {
            console.log('Create directory IDO')
            this.file.createDir(this.file.externalDataDirectory+''+this.common.cmpShortName+'/', date.toISOString().split('T')[0],false).then(_ => {
              console.log('Create directory IDO / '+date.toISOString().split('T')[0]);
              this.viewFile(url,name);
            }).catch(err1 => {
            console.log(err1);
            console.log('Couldn\'t create directory')
            });
          }).catch(err2 =>{
            console.log(err2);
            console.log('Couldn\'t create directory')});
        });
      }
    });
  }

  viewFile(url: string, name: string): Promise<void> {
    const date = new Date();
    const dateDir = date.toISOString().split('T')[0];
    const dirPath = this.file.dataDirectory + this.common.cmpShortName + '/' + dateDir;

    return new Promise((resolve, reject) => {
        this.platform.ready().then(() => {
            this.checkPermissions().then(() => {
                this.file.resolveDirectoryUrl(dirPath)
                    .catch(() => this.file.createDir(this.file.dataDirectory, `${this.common.cmpShortName}/${dateDir}`, true))
                    .then(() => this.file.checkFile(dirPath, name))
                    .then(() => {
                        const filePath = dirPath + '/' + name;
                        console.log("Opening existing file:", filePath);
                        return this.fileOpener.open(decodeURI(filePath), 'application/pdf').then(() => resolve());
                    })
                    .catch(() => {
                        const loader = this.load.create({
                            content: 'Please wait...',
                            spinner: 'bubbles',
                        });
                        loader.present();

                        const targetPath = dirPath + '/' + name;
                        return this.fileTransfer.download(url, targetPath, true).then(entry => {
                            loader.dismiss();
                            console.log("Download complete:", entry.nativeURL);

                            // Check if the file exists before opening
                            this.file.resolveLocalFilesystemUrl(entry.nativeURL).then(fileEntry => {
                                console.log("File exists, opening:", fileEntry.nativeURL);

                                setTimeout(() => {
                                    this.fileOpener.open(decodeURI(fileEntry.nativeURL), 'application/pdf')
                                        .then(() => console.log(" File opened successfully"))
                                        .catch(err => console.error(" FileOpener Error:", err));
                                }, 2000);

                            }).catch(() => {
                                console.error(" File does NOT exist at expected location:", entry.nativeURL);
                            });

                        }).catch(error => {
                            loader.dismiss();
                            console.error(" Download error:", error);
                            reject(error);
                        });
                    });
            }).catch(err => reject(err));
        });
    });
}



checkPermissions(): Promise<void> {
  return this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
    result => result.hasPermission ? Promise.resolve() : this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE, this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE])
  );
}

  // viewFile(url,name){
  //   var date = new Date();
  //   date.setDate(date.getDate());
  //   console.log(date);
  //   console.log(date.toISOString().split('T')[0])
  //   this.platform.ready().then(() => {
  //     console.log('platform ready viewFile')
  //     this.file.resolveDirectoryUrl(this.file.externalDataDirectory+''+this.common.cmpShortName+'/'+date.toISOString().split('T')[0]).then((resolvedDirectory) => {
  //       console.log(resolvedDirectory);
  //       console.log("resolved  directory: " + resolvedDirectory.nativeURL);
  //       this.file.checkFile(resolvedDirectory.nativeURL, name).then((data) => {
  //         console.log(data)
  //         console.log(resolvedDirectory.nativeURL+name)
  //         this.fileOpener.open(resolvedDirectory.nativeURL+name, 'application/pdf')
  //         .then(() => console.log('File is opened'))
  //         .catch(e => console.log('Error opening file', e));
  //         // this.printEsti(resolvedDirectory.nativeURL+name,name);

  //       },err=>{
  //         console.log(err)
  //         let loader = this.load.create({
  //           content: 'Please Wait',
  //           spinner: 'bubbles',
  //         });
  //         loader.present();

  //         var targetPath = this.file.externalDataDirectory+''+this.common.cmpShortName+'/'+date.toISOString().split('T')[0]+'/'+name;
  //         this.fileTransfer.download(url, targetPath,true).then((entry) => {
  //           console.log('download complete: ' + entry.toURL());
  //           loader.dismiss();
  //           this.fileOpener.open(entry.toURL(), 'application/pdf')
  //           .then(() => console.log('File is opened'))
  //           .catch(e => console.log('Error opening file', e));
  //           // this.printEsti(entry.toURL(),name);

  //         }, (error) => {
  //           loader.dismiss();
  //           console.log(error)
  //         });
  //       });
  //     },err=>{
  //       console.log(err)
  //     });
  //   });
  // }
  goto(){

    this.navCtrl.setRoot(HomePage);
  }
  printEsti(content,ename){
    console.log(content);
    console.log(ename);


    this.printer.isAvailable().then(onSuccess =>{
      console.log("isAvailable - Success");
    },
    onError => {
      console.log(onError);
      console.log("isAvailable - Error");
    });

    let options: PrintOptions = {
        name: ename,
        //printerId: 'printer007',
        //duplex: true,
        //landscape: true,
        grayscale: true
      };

    this.printer.print(content, options).then(onSuccess =>{
      console.log("print - Success");
    },
    onError => {
      console.log("print - Error");
    });

  }
}
