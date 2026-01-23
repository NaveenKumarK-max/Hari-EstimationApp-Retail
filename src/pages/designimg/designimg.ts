import { Component ,ChangeDetectorRef} from '@angular/core';
import { Events,IonicPage, NavController, NavParams,LoadingController,ActionSheetController,Platform,ToastController,AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { CommonProvider,BaseAPIURL } from '../../providers/common';
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
  selector: 'page-designimg',
  templateUrl: 'designimg.html',
  providers: [CommonProvider,RetailProvider]

})
export class DesignimgPage {


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

  constructor(private events: Events,public cd:ChangeDetectorRef,public imageCompress: NgxImageCompressService,public alertCtrl:AlertController,private imagePicker: ImagePicker,public retail:RetailProvider,public barcodeScanner:BarcodeScanner,public toast:ToastController,public file:File,public crop:RatioCrop,public filePath:FilePath,public platform:Platform,public comman:CommonProvider,public transfer1:Transfer,public actionSheetCtrl:ActionSheetController,public camera:Camera,public load:LoadingController,public navCtrl: NavController, public navParams: NavParams) {

    this.whole = this.navParams.get('data');
    this.image = this.whole['default_image']
    this.images = this.whole['img_details']
    var y:any[] = Object.assign({}, this.images);
    this.images.reverse();
    this.loggedInBranch = this.empData['id_branch'];

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
      var url = BaseAPIURL+'admin_app_api/createDesignImage';
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
        id_design:this.whole['id_design'],
        branch_id:this.empData['id_branch'],
        created_by:this.empData['uid'],
        id_design_mapping:this.whole['id_design_mapping']
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
      let toastMsg = this.toast.create({
        message: "Image succesfully uploaded.",
        duration: this.comman.toastTimeout,
        position: 'center'
      });
      toastMsg.present();
      this.navCtrl.pop();
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

                      let temp = {'empcode':this.empData['uid'],'id_design':this.whole['id_design'],id_design_mapping:this.whole['id_design_mapping'],'id_desmap_img':this.whole['img_details'][index]['id_desmap_img']}

                      this.comman.deletedesgallery(temp).then(data=>{
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

      let temp = {'empcode':this.empData['uid'],'id_design':this.whole['id_design'],id_design_mapping:this.whole['id_design_mapping'],'id_desmap_img':this.whole['img_details'][index]['id_desmap_img'],'is_default':this.images[index]['is_default']}

      this.comman.updatedefaultdes(temp).then(data=>{
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

}
