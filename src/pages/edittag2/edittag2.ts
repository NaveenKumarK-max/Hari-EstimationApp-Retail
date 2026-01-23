import { Component ,ChangeDetectorRef} from '@angular/core';
import { Events,IonicPage, NavController, NavParams,LoadingController,ActionSheetController,Platform,ToastController,AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { CommonProvider ,BaseAPIURL} from '../../providers/common';
import { RatioCrop, RatioCropOptions } from 'ionic-cordova-plugin-ratio-crop';
import { File } from '@ionic-native/file';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { RetailProvider } from '../../providers/retail';
import { ImagePicker } from '@ionic-native/image-picker';
import {NgxImageCompressService} from 'ngx-image-compress';

/**
 * Generated class for the CreatestockPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
 declare var cordova: any;

// @IonicPage()
@Component({
  selector: 'page-edittag2',
  templateUrl: 'edittag2.html',
  providers: [CommonProvider,RetailProvider]

})
export class Edittag2Page {


  loader: any;
  empData = JSON.parse(localStorage.getItem('empDetail'));
  code:any = '';
  image:any = '';
  imageid:any = '';
  imagename:any = '';
  stockcodes:any[] = [];
  searchcodes:any[] = [];
  images:any[] = [];

  createstock :any = false;
  loggedInBranch :any;
  public input: string = '';
  whole : any;
  progress:any= 0;
  show = false;
  tagMsg = "";
  tagErrorMsg = "";
  esti = {"cus_id": "", "customer" : "", "id_branch" : "", "id_employee" : "", "emp_name" : "","is_tag": false, "is_non_tag": false, "is_home_bill": false, "is_old_metal": false, "tag":[], "non_tag":[], "home_bill":[], "old_metal":[]};
  scannerOn = false;
  metalRate:any;
  taxGroupItems:any;
  dataCheckList  = {"empData" : false, "taxGroup" : false, "branch" : false, "settings" : false};
  settings = [];
  ret_settings = [];
  tag_code:any = '';
  tagData = {'fin_year':'',"order_id":"","tag_code":"","tag_code1":"","tag_code2":"","is_partial":0,"stone_details":[]};
  checkold =false;

  constructor(private events: Events,public cd:ChangeDetectorRef,public imageCompress: NgxImageCompressService,public alertCtrl:AlertController,private imagePicker: ImagePicker,public retail:RetailProvider,public barcodeScanner:BarcodeScanner,public toast:ToastController,public file:File,public crop:RatioCrop,public filePath:FilePath,public platform:Platform,public comman:CommonProvider,public transfer1:Transfer,public actionSheetCtrl:ActionSheetController,public camera:Camera,public load:LoadingController,public navCtrl: NavController, public navParams: NavParams) {

    // this.whole = this.navParams.get('data');
    // this.image = this.whole['default_image']
    // this.images = this.whole['img_details']
    // var y:any[] = Object.assign({}, this.images);
    // this.images.reverse();
    this.loggedInBranch = this.empData['id_branch'];



    let loader4 = this.load.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader4.present();


    this.retail.getAllTaxGroupItems().then(data=>{
      this.taxGroupItems = data;
      this.events.publish('taxGroup:loaded', true);
      this.dataCheckList['taxGroup'] = true;
      this.comman.getCurrencyAndSettings({"id_branch":this.esti['id_branch']}).then(data=>{
        this.metalRate = data.metal_rates;
        this.settings = data.settings;
        this.ret_settings = data.ret_settings;
        this.events.publish('settings:loaded', true);
        this.events.publish('ret_settings:loaded', true);
        this.dataCheckList['settings'] = true;
        loader4.dismiss();
      })
    })

  }
  ionViewWillEnter(){
    this.list();
    this.events.publish( 'entered', true );
    this.events.publish( 'pageno', 1 );
  }
  ionViewWillLeave(){
    this.events.publish( 'entered', false );

    }

  list(){
    // let loader = this.load.create({
    //   content: 'Please Wait',
    //   spinner: 'bubbles',
    // });
    // loader.present();


    // this.comman.getstocklist().then(data=>{

    //   this.stockcodes = data['stockcodes'];
    //   this.searchcodes = data['stockcodes'];

    //   loader.dismiss();
    // },err=>{
    //   loader.dismiss();

    // });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreatestockPage');
  }
  create(){

    if(this.createstock == false){

      this.createstock = true;
    }
    else{
      this.createstock = false;

    }
  }
  public presentActionSheet(data) {
    let actionSheet = this.actionSheetCtrl.create( {
        title: 'Select Image Source',
        buttons: [
             {
                 text: 'Load from Gallery',
                 handler: () => {
                   if(data == 'default'){
                  this.takePicture( this.camera.PictureSourceType.PHOTOLIBRARY);

                   }
                   else{

                  let options = {
                    maximumImagesCount: 2,
                    quality: 100,

                   };

                this.imagePicker.getPictures(options).then(results => {
                  if(results.length > 0){
                    this.loading();

                  }

                        console.log('111111111111111');
                        for(var i=0; i < results.length;i++){

                          console.log(results[i])
                          var documentURL = decodeURIComponent(results[i]);
                          console.log(documentURL)

                          results[i] = documentURL;
                          console.log(results[i])

                                var temp = results.length - 1 == i ? true : false;
                                 let correctPath = results[i].substr( 0, results[i].lastIndexOf( '/' ) + 1 );
                                 let currentName = results[i].substr( results[i].lastIndexOf( '/' ) + 1 );
                                 this.copyFileToLocalDir( correctPath, currentName, this.createFileName(),temp,'gal');

                        };


                       });

                  }
                }
             },
            {
                text: 'Take Picture',
                handler: () => {
                    this.takePicture( this.camera.PictureSourceType.CAMERA);
                }
            },
            {
                text: 'Cancel',
                role: 'cancel'
            }
        ]
    } );
    actionSheet.present();
  }

  public takePicture( sourceType ) {

    // Create options for the Camera Dialog
    var options = {
    quality: 100,
    sourceType: sourceType,
    saveToPhotoAlbum: false,
    correctOrientation: true,

    // allowEdit:true

    };
    var cropOptions = {
      quality: 100,
      widthRatio: -1,
      heightRatio: -1
    }
  this.loading();
    // Get the data of an image
    this.camera.getPicture( options ).then(( imagePath ) => {
      console.log(imagePath);

     if ( this.platform.is( 'android' ) && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY ) {
       console.log(imagePath)
       this.crop.ratioCrop(imagePath, cropOptions).then(out => {

         this.filePath.resolveNativePath( out )
             .then( filePath => {
              console.log(filePath)
              console.log(333333333333333)

                 let correctPath = filePath.substr( 0, filePath.lastIndexOf( '/' ) + 1 );
                //  let currentName = imagePath.substring( imagePath.lastIndexOf( '/' ) + 1, imagePath.lastIndexOf( '?' ) );
                let currentName = filePath.substring( filePath.lastIndexOf( '/' ) + 1);
                // this.dismissLoader();

                 this.copyFileToLocalDir( correctPath, currentName, this.createFileName(),'','cam' );
    // this.uploadImage();
             },err=>{
              this.dismissLoader();

             } );
            },err=>{
              this.dismissLoader();

            } );


     } else {
      this.crop.ratioCrop(imagePath, cropOptions).then(out => {

        this.filePath.resolveNativePath( out )
            .then( filePath => {
             console.log(filePath)
    var currentName = filePath.substr( filePath.lastIndexOf( '/' ) + 1 );
    var correctPath = filePath.substr( 0, filePath.lastIndexOf( '/' ) + 1 );
    // this.dismissLoader();

    this.copyFileToLocalDir( correctPath, currentName, this.createFileName(),'','cam' );
    // this.uploadImage();
  } ,err=>{
    this.dismissLoader();

  } );
  },err=>{
    this.dismissLoader();

  } );

    }

    }, ( err ) => {
      this.dismissLoader();
  console.log(err);
    console.log( 'Error while selecting image.' );
    } );

    }
    public pathForImage( img ) {
    if ( img === null ) {
        return '';
    } else {
        return cordova.file.dataDirectory + img;
    }
    }
    // Create a new name for the image
    private createFileName() {
    var d = new Date(),
        n = d.getTime(),
        newFileName = n + ".jpg";
    return newFileName;
    }

 // Copy the image to a local folder
 private copyFileToLocalDir( namePath, currentName, newFileName,index,type ) {
  this.file.copyFile( namePath, currentName, cordova.file.dataDirectory, newFileName ).then( success => {

    console.log(this.pathForImage(newFileName));

    var orientation = -1;

    this.imageCompress.compressFile(this.pathForImage(newFileName), orientation, 100, 100).then(async result=>{

      this.writeFile(result,this.createFileName(),index,type);

    },err=>{
      console.log(err)

    });


  }, error => {

      console.log( error);
  } );
  }
  public uploadImage(name) {

    console.log(this.images);

    let imgs:any[] =  this.images.filter(data=>!data.hasOwnProperty('id_desmap_img'));

    if(imgs.length > 0){
    // let loader = this.load.create( {
    //   content: "Uploading..."
    // } );
    // loader.present();
    this.show = true;
    console.log(imgs);
    imgs.forEach(async (element,index) => {



      await new Promise<void>( next=>{

      // Destination URL
      var url = BaseAPIURL+'admin_app_api/uploadTagimage';
      var d = new Date(),
      n = d.getTime()
    // File for Upload
    var targetPath = element['image_name']  + '?nocache=' + n;

    // File name only
    var filename = name;
    var options = {
      fileKey: "name",
      fileName: element['name'],
      chunkedMode: false,
      mimeType: "image/jpeg",
      params: {
        fileName: element['name'],
        default: element['is_default'],
        branch_id:this.empData['id_branch'],
        tagid:this.esti['tag'][0]['tag_id'],
        // imgid : this.images[index]['id_tag_img']
      }
    };




    const fileTransfer: TransferObject = this.transfer1.create();



    console.log(targetPath)
    console.log(encodeURI(url))
    console.log(options)
    console.log(url)

    // Use the FileTransfer to upload the image
    fileTransfer.upload( targetPath, encodeURI(url), options ).then(( data ) => {
      console.log(data);
      if(index == imgs.length - 1){
        setTimeout(() => {

      let result = JSON.parse( data.response );
      console.log(result);
      console.log(result['imageid'])
      // loader.dismissAll();
      // this.image = this.pathForImage(name);
      // this.imageid = result['imageid'];
      let check:any = this.images.findIndex(data => data['image_name'] ==  element['image_name']);
      this.images[check]['id_desmap_img'] = result['imageid'];
      // this.esti['tag'][0]['img_details'][index]['id_tag_img'] = result['imageid'];

      let toastMsg = this.toast.create({
        message: "Image succesfully uploaded.",
        duration: this.comman.toastTimeout,
        position: 'center'
      });
      toastMsg.present();
       this.esti['tag'] = [];
             this.image = '';
            this.images = [];
            this.show = false;

      // this.navCtrl.pop();
    }, 3000);

    }
    next();

    }, err => {
      // loader.dismissAll()
      console.log(err);
       let toastMsg = this.toast.create({
        message: "Error while uploading Image.",
        duration: this.comman.toastTimeout,
        position: 'center'
      });
      toastMsg.present();
      next();

    } );

    fileTransfer.onProgress((data) => {
      console.log(data)

      this.progress = Math.round((data.loaded/data.total) * 100) ;
      this.refresh();
      console.log(this.progress)

    });
  } );
// },err=>{
//   console.log(err);
// });
} );
    }
    else{
      this.navCtrl.pop();
    }
  }
  loading(){

    this.loader = this.load.create( {
        content: "Please Wait..."
    });
    this.loader.present();
  }
  dismissLoader() {
    this.loader.dismiss();
  }
  submit(){
    let check:any = this.images.findIndex(data => data['is_default'] == 1);

    if(this.imagename != '' || check >= 0){
      this.uploadImage(this.imagename)

    }else{
      let toastMsg = this.toast.create({
        message: "Please Upload Default Image.",
        duration: this.comman.toastTimeout,
        position: 'center'
      });
      toastMsg.present();
    }
  }


  search() {



    this.stockcodes = this.searchcodes.filter(item => item['stock_code'].toUpperCase().includes(this.input.toUpperCase()));
  }
  deletePhoto( index,data ) {
    // ${data}
    let confirm = this.alertCtrl.create( {
        title: `Sure you want to delete this image? There is no undo!`,
        message: '',
        buttons: [
            {
                text: 'No',
                handler: () => {
                    console.log( 'Disagree clicked' );
                }
            }, {
                text: 'Yes',
                handler: () => {
                    console.log( 'Agree clicked' );

                  if(this.images[index].hasOwnProperty('id_desmap_img')){
                      let loader = this.load.create({
                        content: 'Please Wait',
                        spinner: 'dots',
                      });
                      loader.present();

                      // let temp = {'empcode':this.empData['uid'],'id_design':this.whole['id_design'],id_design_mapping:this.whole['id_design_mapping'],'id_desmap_img':this.whole['img_details'][index]['id_desmap_img']}
                      var postData = {"tagid":this.esti['tag'][0]['tag_id'],"imgid":this.esti['tag'][0]['img_details'][index]['id_tag_img']};

                      this.retail.deletetagimage(postData).then(data=>{
                        let toast = this.toast.create({
                          message: data['message'],
                          duration: 3000,
                          position: 'bottom'
                        });
                        loader.dismiss();
                        toast.present();
                        this.images.splice(index,1);

                        let check:any = this.images.findIndex(data => data['is_default'] == 1);
    if(check < 0){

      this.imagename = '';
      this.image = '';
    }
    else{

    }
                      },err=>{
                        loader.dismiss();

                      });

                    }
                    else{
                      this.images.splice(index,1);

                      let check:any = this.images.findIndex(data => data['is_default'] == 1);
  if(check < 0){

    this.imagename = '';
    this.image = '';
  }
  else{

  }
                    }

                }
            }
        ]
    } );
    confirm.present();
  }
  checkdefault(index){
    console.log(this.images[index])
    if(this.images[index].hasOwnProperty('id_desmap_img')){
      let loader = this.load.create({
        content: 'Please Wait',
        spinner: 'dots',
      });
      loader.present();
      if(this.images[index]['is_default'] == 0){
        this.images[index]['is_default'] = 1;
        this.image = this.images[index]['image_name'];
        this.images.forEach((element,i) => {

          if(index == i){

          }
          else{
            this.images[i]['is_default'] = 0;

          }
        });
      }
      else{
        this.images[index]['is_default'] = 0;
        this.image = '';
        this.imagename = '';
      }

      let temp = {'empcode':this.empData['uid'],"tagid":this.esti['tag'][0]['tag_id'],"imgid":this.esti['tag'][0]['img_details'][index]['id_tag_img'],'is_default':this.images[index]['is_default']}

      this.comman.updatedefaulttag(temp).then(data=>{
        let toast = this.toast.create({
          message: 'Default Image Updated Successfully',
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
        loader.dismiss();
      });
    }
    else{
    if(this.images[index]['is_default'] == 0){
      this.images[index]['is_default'] = 1;
      this.image = this.images[index]['image_name'];
      this.images.forEach((element,i) => {

        if(index == i){

        }
        else{
          this.images[i]['is_default'] = 0;

        }
      });
    }
    else{
      this.images[index]['is_default'] = 0;
      this.image = '';
      this.imagename = '';
    }
  }
  }

 //here is the method is used to write a file in storage
 writeFile(base64Data: any, fileName: any,index,type) {
  let contentType = this.getContentType(base64Data);
  let DataBlob = this.base64toBlob(base64Data, contentType);
  // here iam mentioned this line this.file.externalRootDirectory is a native pre-defined file path storage. You can change a file path whatever pre-defined method.
  var filePath = cordova.file.dataDirectory;

  this.file.writeFile(filePath, fileName, DataBlob, contentType).then((success) => {
      console.log(success['nativeURL'])
      var currentName = success['nativeURL'].substr(success['nativeURL'].lastIndexOf('/') + 1);
      var correctPath = success['nativeURL'].substr(0, success['nativeURL'].lastIndexOf('/') + 1);

      console.log("File Writed Successfully", success);
      console.log(currentName)
      console.log(correctPath)
      // this.targetPaths.push( success['nativeURL'])
      // this.filenames.push( currentName );

      // this.copyFileToLocalDir( correctPath, currentName, this.createFileName() );
      // this.uploadImage(currentName)
      if(type == 'gal'){
        this.images.push({'image_name':success['nativeURL'],'is_default':0,'name':currentName});

        var y:any[] = Object.assign({}, this.images);
        this.images.reverse();

        if(index == true){
          this.dismissLoader();
        }
      }else{

          this.images.forEach((element,i) => {

              this.images[i]['is_default'] = 0;

          });
          this.imagename = currentName;
          this.image = success['nativeURL'];
          this.images.push({'image_name':this.image,'is_default':1,'name':currentName});
               var y:any[] = Object.assign({}, this.images);
        this.images.reverse();
          this.dismissLoader();

      }

  }).catch((err) => {
      console.log("Error Occured While Writing File", err);
  })
}

//here is the method is used to get content type of an bas64 data
public getContentType(base64Data: any) {
  let block = base64Data.split(";");
  let contentType = block[0].split(":")[1];
  return contentType;
}

//here is the method is used to convert base64 data to blob data
public base64toBlob(b64Data, contentType) {
  contentType = contentType || '';
  var sliceSize = 512;
  let byteCharacters =  atob(b64Data.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
  let byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);
      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
  }
  let blob = new Blob(byteArrays, {
      type: contentType
  });
  return blob;
}

refresh() {
  console.log('refresheed')
  this.cd.detectChanges();
}

closeScanner(){
  this.scannerOn = false;
  // this.scanSub.unsubscribe();
  // this.qrScanner.hide().then();
  // this.qrScanner.destroy().then();
}

openQRScanner(){
  this.scannerOn = true;

  console.log("QR Scanner");
  this.barcodeScanner.scan().then((barcodeData) => {

    this.scannerOn = false;
          if(barcodeData['text'] != ''){
            this.getTagByID(barcodeData['text']);
          }
        },err=>{
          this.scannerOn = false;

          console.log(err)
        });
  // console.log("QR Scanner");
  // // Optionally request the permission early
  // this.qrScanner.prepare()
  // .then((status: QRScannerStatus) => {
  //   console.log("Then");
  //   if (status.authorized) {
  //     console.log("authorized");
  //     // start scanning
  //     this.scannerOn = true;
  //     this.qrScanner.show().then();
  //     this.scanSub = this.qrScanner.scan().subscribe((text: string) => {
  //       console.log('Scanned something', text);
  //       // Hide and unsubscribe from scanner
  //       this.qrScanner.hide().then();
  //       this.qrScanner.destroy().then();
  //       this.scanSub.unsubscribe();
  //       this.scannerOn = false;
  //       if(text != ''){
  //         this.getTagByID(text);
  //       }
  //     });
  //   }
  //   else if (status.denied) {
  //     console.log("camera permission was permanently denied");
  //     // camera permission was permanently denied
  //     // you must use QRScanner.openSettings() method to guide the user to the settings page
  //     // then they can grant the permission from there
  //     this.qrScanner.openSettings();
  //   }
  //   else {
  //     console.log("Camera Access permission denied. Kindly enable to Scan QR");
  //     // permission was denied, but not permanently. You can ask for permission again at a later time.
  //     alert('Camera Access permission denied. Kindly enable to Scan QR.');
  //   }
  // })
  // .catch((e: any) => console.log('Error is', e));
}
 // Tag Item

 append(event){
console.log(event)

  var one:any = (<HTMLInputElement>document.getElementById('one')).value.toUpperCase();
  var two:any = (<HTMLInputElement>document.getElementById('two')).value.toUpperCase();

  this.tagData['tag_code1'] = this.tagData['tag_code1'].toUpperCase();
  this.tagData['tag_code2'] = this.tagData['tag_code2'].toUpperCase();
  console.log(one)
  console.log(two)

    this.tagData['tag_code'] = one+'-'+two;

    // let test:any = new String(two);
    // if(test.length == 5 && one != ''){
    //   console.log(test.length)

    //   this.getTagByID(this.tagData['tag_code']);
    //   this.tagData['tag_code'] = '';
    //   this.tagData['tag_code1'] = '';
    //   this.tagData['tag_code2'] = '';

    // }
    if(event.keyCode == 13){
      this.getTagData(this.tagData['tag_code'])
    }

}

 getTagData(tagData){

    // Search Tag
    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();

    if(tagData != ''){
      var istagId = (tagData.search("/") > 0 ? true : false);
      var isTagCode = (tagData.search("-") > 0 ? true : false);
      if(istagId){
        var tId   = tagData.split("/");
        var searchTxt = (tId.length >= 2 ? tId[0] : "");
        var searchField  = this.checkold == true ? "old_tag_id" : "tag_id";
      }
      else if(isTagCode){
        var searchTxt = tagData;
        var searchField  = this.checkold == true ? "old_tag_id" : "tag_code";
      }
    }

    var postData = {"type":'EstiTag',"searchTxt":searchTxt,"searchField":searchField,"id_branch":this.loggedInBranch};
    this.retail.getTagData(postData).then(data=>{
      if(data.status){
          this.tagMsg = data.msg;
          this.tagErrorMsg = "";
          setTimeout(()=>{
                this.tagMsg = "";
          },this.comman.msgTimeout);
          data.tagData['actual_gross_wt'] = data.tagData['gross_wt'];
          data.tagData['actual_less_wt'] = data.tagData['less_wt'];
          data.tagData['actual_net_wt'] = data.tagData['net_wt'];
          let detail = {itemData : data.tagData, metalRate : this.metalRate, tax_details : this.taxGroupItems, item_type : "tag"};
          let tagItem = this.retail.calculateSaleValue(detail);
          let addItem = true;
          this.esti['tag'].forEach(item => {
              if(item.tag_id == tagItem.tag_id){
                this.tagMsg = "";
                addItem = false;
                this.tagErrorMsg = "Tag Already exist..";
                setTimeout(()=>{
                      this.tagErrorMsg = "";
                },this.comman.msgTimeout);
              }
          })
          if(addItem){
             this.esti['is_tag'] = true;
             this.esti['tag'] = [];
             this.esti['tag'].push(tagItem);
             this.image = tagItem['default_image'];
            this.images = tagItem['img_details'];

            var y:any[] = Object.assign({}, this.images);
            this.images.reverse();
           }
          // copy x
// let y:any = Object.assign({}, this.esti['tag']);
// console.log(y);

// this.esti['tag'].reverse();
console.log(this.esti['tag']);

      }else{
        this.tagMsg = "";
        this.tagErrorMsg = data.msg;
        setTimeout(()=>{
              this.tagErrorMsg = "";
        },this.comman.msgTimeout);
      }

      loader.dismiss();
    },err=>{
      loader.dismiss();

    })

}

getTagByID(tagData){
  if(tagData != ''){
   var istagId = (tagData.search("/") > 0 ? true : false);
   var isTagCode = (tagData.search("-") > 0 ? true : false);
   if(istagId){
     var tId   = tagData.split("/");
     var searchTxt = (tId.length >= 2 ? tId[0] : "");
     var searchField  = "tag_id";
   }
   else if(isTagCode){
     var searchTxt = tagData;
     var searchField  = "tag_code";
   }
   // Search Tag
   let loader = this.load.create({
     content: 'Please Wait',
     spinner: 'bubbles',
   });
   loader.present();
   var postData = {"searchTxt":searchTxt,"searchField":searchField,"id_branch":this.loggedInBranch};
   this.retail.getTagData(postData).then(data=>{
     if(data.status){
         this.tagMsg = data.msg;
         this.tagErrorMsg = "";
         setTimeout(()=>{
               this.tagMsg = "";
         },this.comman.msgTimeout);
         data.tagData['actual_gross_wt'] = data.tagData['gross_wt'];
         data.tagData['actual_less_wt'] = data.tagData['less_wt'];
         data.tagData['actual_net_wt'] = data.tagData['net_wt'];
         let detail = {itemData : data.tagData, metalRate : this.metalRate, tax_details : this.taxGroupItems, item_type : "tag"};
         let tagItem = this.retail.calculateSaleValue(detail);
         let addItem = true;
         this.esti['tag'].forEach(item => {
             if(item.tag_id == tagItem.tag_id){
               this.tagMsg = "";
               addItem = false;
               this.tagErrorMsg = "Tag Already exist..";
               setTimeout(()=>{
                     this.tagErrorMsg = "";
               },this.comman.msgTimeout);
             }
         })
         if(addItem){
            this.esti['is_tag'] = true;
            this.esti['tag'] = [];
            this.esti['tag'].push(tagItem);
            this.image = tagItem['default_image'];
            this.images = tagItem['img_details'];
            var y:any[] = Object.assign({}, this.images);
            this.images.reverse();
          }
          // let y:any = Object.assign({}, this.esti['tag']);
          // console.log(y);

          // this.esti['tag'].reverse();
          // console.log(this.esti['tag']);

     }else{
       this.tagMsg = "";
       this.tagErrorMsg = data.msg;
       setTimeout(()=>{
             this.tagErrorMsg = "";
       },this.comman.msgTimeout);
     }

     loader.dismiss();
   },err=>{
    loader.dismiss();

   })
  }
}


}
