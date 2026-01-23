import { Component ,ChangeDetectorRef} from '@angular/core';
import { Events,IonicPage, NavController, NavParams,LoadingController,ActionSheetController,Platform,ToastController,AlertController,ModalController } from 'ionic-angular';
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
import { MasSearchPage } from '../modal/mas-search/mas-search';
import { CusSearchPage } from '../modal/customer/customer';
import { CountrymodelPage } from '../modal/countrymodel/countrymodel';
import { HomePage } from '../home/home';
import { NotconvertedPage } from '../notconverted/notconverted';
import { EmpSearchPage } from '../modal/employee/employee';

/**
 * Generated class for the CreatestockPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
 declare var cordova: any;

// @IonicPage()
@Component({
  selector: 'page-faq',
  templateUrl: 'faq.html',
  providers: [CommonProvider,RetailProvider]

})
export class FaqPage {


  loader: any;
  empData = JSON.parse(localStorage.getItem('empDetail'));
  code:any = '';
  image:any = '';
  imageid:any = '';
  imagename:any = '';
  stockcodes:any[] = [];
  searchcodes:any[] = [];
  images:any[] = [];
  Products:any[] = [];
  Designs:any[] = [];
  subDesigns:any[] = [];

  createstock :any = false;
  loggedInBranch :any;
  public input: string = '';
  whole : any;
  progress:any= 0;
  show = false;
  enquiry : any = {
    'taged':'true',
    'whole':[{'design_no':'','design_name':'','sub_design_no':'','sub_design_name':'','pro_id':'','product_name':'','weight':'','id_weight':'','weight_description':'','reason':'','images':[]}]
  };
  type = 'FactSheet';

  reasons:any[] = [];
  prices:any[] = [];
  weights:any[] = [];
  sweights:any[] = [];

  village:any[] = [];
  checkold =false;
  input2:string= '';
  employees:any[] = [];

  constructor(public modal:ModalController,private events: Events,public cd:ChangeDetectorRef,public imageCompress: NgxImageCompressService,public alertCtrl:AlertController,private imagePicker: ImagePicker,public retail:RetailProvider,public barcodeScanner:BarcodeScanner,public toast:ToastController,public file:File,public crop:RatioCrop,public filePath:FilePath,public platform:Platform,public comman:CommonProvider,public transfer1:Transfer,public actionSheetCtrl:ActionSheetController,public camera:Camera,public load:LoadingController,public navCtrl: NavController, public navParams: NavParams) {

    // this.whole = this.navParams.get('data');
    // this.image = this.whole['default_image']
    // this.images = this.whole['img_details'];
    var y:any[] = Object.assign({}, this.images);
    this.images.reverse();
    this.loggedInBranch = this.empData['id_branch'];
    this.enquiry['empname'] = "";

    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();


this.comman.getVillages().then(data => {
      this.village = data;
      console.log(this.village);
    })

    this.comman.getBranchEmployees(this.empData['id_branch']).then(data=>{
      this.employees = data;
  });

    this.comman.getreasons().then(data=>{

      this.reasons = data['reasons_for_leaving'];
      this.prices = data['price_range'];
      this.weights = data['weight_range'];
      this.sweights = data['weight_range'];

      loader.dismiss();
    },err=>{
      loader.dismiss();

    });

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
  public presentActionSheet(data,iii) {
    let actionSheet = this.actionSheetCtrl.create( {
        title: 'Select Image Source',
        buttons: [
             {
                 text: 'Load from Gallery',
                 handler: () => {
                   if(data == 'default'){
                  this.takePicture( this.camera.PictureSourceType.PHOTOLIBRARY,iii);

                   }
                   else{

                  let options = {
                    maximumImagesCount: 1,
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
                                 this.copyFileToLocalDir( correctPath, currentName, this.createFileName(),temp,'gal',iii);

                        };


                       });

                  }
                }
             },
            {
                text: 'Take Picture',
                handler: () => {
                    this.takePicture( this.camera.PictureSourceType.CAMERA,iii);
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

  public takePicture( sourceType,iii ) {

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

                 this.copyFileToLocalDir( correctPath, currentName, this.createFileName(),'','cam' ,iii);
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

    this.copyFileToLocalDir( correctPath, currentName, this.createFileName(),'','cam',iii );
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
 private copyFileToLocalDir( namePath, currentName, newFileName,index,type,iii ) {
  this.file.copyFile( namePath, currentName, cordova.file.dataDirectory, newFileName ).then( success => {

    console.log(this.pathForImage(newFileName));

    var orientation = -1;

    this.imageCompress.compressFile(this.pathForImage(newFileName), orientation, 100, 100).then(async result=>{

      this.writeFile(result,this.createFileName(),index,type,iii);

      // this.uploadImage(this.imagename)


    },err=>{
      console.log(err)

    });


  }, error => {

      console.log( error);
  } );
  }
  public uploadImage(name,iii) {

    console.log(this.enquiry);
    console.log(this.images);
    console.log('666',iii);

    let imgs:any[] =  this.images

    // if(imgs.length > 0){
    // let loader = this.load.create( {
    //   content: "Uploading..."
    // } );
    // loader.present();
    this.show = true;
    console.log(imgs);
    imgs.forEach(async (element,index) => {



      await new Promise<void>( next=>{

      // Destination URL
      var url = BaseAPIURL+'admin_app_api/createenquiryImage';
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
        // id_design:this.whole['id_design'],
        branch_id:this.empData['id_branch'],
        created_by:this.empData['uid'],
        // id_design_mapping:this.whole['id_design_mapping']
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
                this.show = false;


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
    // }
    // else{
    //   // this.navCtrl.pop();
    // }
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


                      console.log(data);
                      console.log(index);

                      this.images.splice(index,1);
                      if(data != '' ){
                                            console.log('1111',data);

                       this.enquiry['whole'][data].images.splice(index,1)
                      }

                      //if(data != '' && this.enquiry['whole'][data].images.length > 0){

                      //}

  //                     let check:any = this.images.findIndex(data => data['is_default'] == 1);
  // if(check < 0){

  //   this.imagename = '';
  //   this.image = '';
  // }
  // else{

  // }


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

      // this.comman.updatedefaultdes(temp).then(data=>{
      //   let toast = this.toast.create({
      //     message: 'Default Image Updated Successfully',
      //     duration: 3000,
      //     position: 'bottom'
      //   });
      //   toast.present();
      //   loader.dismiss();
      // });
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
 writeFile(base64Data: any, fileName: any,index,type,iii) {
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
      if(type == 'gal'){
        this.images.push({'image_name':success['nativeURL'],'is_default':0,'name':currentName});

              this.enquiry['whole'][iii]['images'].push({'image_name':success['nativeURL'],'is_default':0,'name':currentName});

        var y:any[] = Object.assign({}, this.images);
        this.images.reverse();
        this.uploadImage(currentName,iii)

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
           this.enquiry['whole'][iii]['images'].push({'image_name':this.image,'is_default':1,'name':currentName});
               var y:any[] = Object.assign({}, this.images);
        this.images.reverse();
        this.uploadImage(currentName,iii)

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

openMasSearch(master,ii){
  if(master == 'Product'){
    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();

      if(this.Products.length == 0) {
        this.retail.getProducts({"type":"active", "id_category":"", "last_id":-1}).then(data=>{
          this.Products = data;
          loader.dismiss();
          this.openMasModal({'searchArr' : this.Products, page : master, listType : "normal"}, master,ii);
        })
      }else{
        loader.dismiss();
        this.openMasModal({'searchArr' : this.Products, page : master, listType : "normal"}, master,ii);
      }
    }

  else if(master == 'Design'){
    if(this.enquiry['whole'][ii]['pro_id']){
       this.openMasModal({'searchArr' : this.Designs, page : master, listType : "normal"}, master,ii);
    }
  }
  else if(master == 'subDesign'){
    if(this.enquiry['whole'][ii]['design_no']){
       this.openMasModal({'searchArr' : this.subDesigns, page : master, listType : "normal"}, master,ii);
    }
  }

}


openMasModal(data,master,i){
  let modal = this.modal.create(MasSearchPage,data)
  modal.present();
  modal.onDidDismiss(data => {
    if(data != null){
      if(master == 'Design'){
        this.enquiry['whole'][i]['design_no'] = data.id_design;
        this.enquiry['whole'][i]['design_name'] = data.label;
        this.hbdesignSelected(i)

      }
      else if(master == 'subDesign'){
        this.enquiry['whole'][i]['sub_design_no'] = data.id_sub_design;
        this.enquiry['whole'][i]['sub_design_name'] = data.label;
      }
      else if(master == 'Product'){

          this.enquiry['whole'][i]['pro_id'] = data.pro_id;
          // this.enquiry['metal_type'] = data.metal_type;
          this.enquiry['whole'][i]['product_name'] = (data.parent_prods_name != null ? data.parent_prods_name+','+data.label : data.label);
          this.hbProdSelected(i);

      }

    }
  });
}
hbProdSelected(i){
  // if(this.hbDesigns.length == 0) {
    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();
    this.retail.getDesigns({"type":"active", "id_product":this.enquiry['whole'][i]['pro_id'], "last_id":-1}).then(data=>{
      this.Designs = data;
      loader.dismiss();
    })
  // }

}
hbdesignSelected(i){
  // if(this.hbDesigns.length == 0) {
    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();
    this.comman.getsubdesigns({"id_product":this.enquiry['whole'][i]['pro_id'], "design_no":this.enquiry['whole'][i]['design_no']}).then(data=>{
      this.subDesigns = data;

      loader.dismiss();
    })
  // }

}

setreason(data,i){
  this.enquiry['whole'][i]['reason'] = data;

}
setweight(data,name,i){
  this.enquiry['whole'][i]['id_weight'] = data;
    this.enquiry['whole'][i]['weight_description'] = name;
this.enquiry['whole'][i]['net_wt'] = name;

      this.enquiry['id_weight'] = data;
    this.enquiry['weight_description'] = name;
}
setprice(data){

  this.enquiry['price'] = data;
}


 // Tag Item
 getTagData(tagData){
  if (tagData.length > 0) {
    if(tagData != ''){
      var istagId = (tagData.search("/") > 0 ? true : false);
      // var isTagCode = (tagData.search("-") > 0 ? true : false);
      var isTagCode = ((tagData.search("-") > 0 || tagData.search("-") < 0) ? true : false);
      if(istagId){
        var tId   = tagData.split("/");
        var searchTxt = (tId.length >= 2 ? tId[0] : "");
        var searchField  = this.checkold == true ? "old_tag_id" : "tag_id";
        console.log('1');
        
      }
      else if(isTagCode){
        var searchTxt = tagData;
        var searchField  = this.checkold == true ? "old_tag_id" : "tag_code";
        console.log('2');

      }
      else if (this.checkold) {
        var searchTxt = tagData;
        var searchField = "old_tag_id";
        console.log('3');

      }
    }
    console.log(searchTxt,searchField,'datttaaaaa');
    

    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();    


    var postData = {"type":'EstiTag',"searchTxt":searchTxt,"searchField":searchField,"id_branch":this.empData['id_branch']};
    this.retail.getTagData(postData).then(data=>{
      if(data.status){

          data.tagData['product_name'] = ( data.tagData['parent_prods_name'] != null ? (data.tagData['parent_prods_name']+','+data.tagData['product_name']) : data.tagData['product_name'] );
          // this.enquiry = data.tagData;
          this.enquiry['taged'] = 'true';
          this.enquiry['gettaged'] = 'true';
          this.enquiry['net_wt'] = data.tagData['net_wt'];
          this.enquiry['tag_id'] = data.tagData['tag_id'];

          // this.image = data.tagData['image'];
          this.enquiry['product_name'] = data.tagData['product_name'];
          this.enquiry['design_name'] = data.tagData['design_name'];
          this.enquiry['sub_design_name'] = data.tagData['sub_design_name'];

          this.enquiry['pro_id'] = data.tagData['pro_id'];
          this.enquiry['design_no'] = data.tagData['design_no'];
          this.enquiry['sub_design_no'] = data.tagData['sub_design_no'];

        }else{
      let toastMsg = this.toast.create({
        message: data.msg,
        duration: this.comman.toastTimeout,
        position: 'center'
      });
      toastMsg.present();
      }

      loader.dismiss();
    })
  }else{
    console.log(tagData);
    let toastMsg = this.toast.create({
      message: "Enter Tag Code",
      duration: this.comman.toastTimeout,
      position: 'center'
    });
    toastMsg.present();
  }
}

append(event){

  var one: any = (<HTMLInputElement>document.getElementById('one')).value.toUpperCase();
  var two: any = (<HTMLInputElement>document.getElementById('two')).value.toUpperCase();

  this.enquiry['tag_code1'] = this.enquiry['tag_code1'].toUpperCase();
  this.enquiry['tag_code2'] = this.enquiry['tag_code2'].toUpperCase();
  console.log(one)
  console.log(two)

  if (this.enquiry['tag_code1'] != '' && this.enquiry['tag_code2'] != '') {

    this.enquiry['tag_code'] = one + '-' + two;

  }
  else {
    this.enquiry['tag_code'] = one + two;

  }

  // var one:any = (<HTMLInputElement>document.getElementById('one')).value.toUpperCase();
  // var two:any = (<HTMLInputElement>document.getElementById('two')).value.toUpperCase();

  // this.enquiry['tag_code1'] = this.enquiry['tag_code1'].toUpperCase();
  // this.enquiry['tag_code2'] = this.enquiry['tag_code2'].toUpperCase();
  // console.log(one)
  // console.log(two)

  //   this.enquiry['tag_code'] = one+'-'+two;


    if(event.keyCode == 13){
      this.getTagData(this.enquiry['tag_code']);
    }

}


addWishlist(item){


  let empData = JSON.parse(localStorage.getItem('empDetail'));

    let modal = this.modal.create(CusSearchPage,{'show':'true'})
    modal.present();
    modal.onDidDismiss(mData => {
      console.log(mData)
      if(mData != null){
        // this.idcus = mData['id_customer'];
        this.enquiry['id_customer'] = mData['id_customer'];

        this.enquiry['name'] = mData['firstname'];
        this.enquiry['phone'] = mData['mobile'];
        this.enquiry['area'] = mData['village_name'];


      }else{

      }
    });



}
estiTypeChanged(eve){

  this.enquiry['empname'] = '';

  this.enquiry['whole'] =
  [{'design_no':'','design_name':'','sub_design_no':'','sub_design_name':'','pro_id':'','product_name':'','weight':'','id_weight':'','weight_description':'','reason':'','images':[]}]
  this.enquiry['tag_code'] = '';
  this.enquiry['tag_code1'] = '';
  this.enquiry['tag_code2'] = '';
  this.enquiry['gettaged'] = '';
  this.enquiry['tag_id'] = '';
    this.enquiry['images'] = [];
      this.enquiry['weight'] = '';
          this.images = [];

  this.enquiry['product_name'] = '';
          this.enquiry['design_name'] = '';
          this.enquiry['sub_design_name'] = '';

          this.enquiry['pro_id'] = '';
          this.enquiry['design_no'] ='';
          this.enquiry['sub_design_no'] = '';
          this.enquiry['net_wt'] = '';

  console.log(eve)
}


checkesti(){

  this.enquiry['whole'] =
    [{'design_no':'','design_name':'','sub_design_no':'','sub_design_name':'','pro_id':'','product_name':'','weight':'','id_weight':'','weight_description':'','reason':'','images':[]}]


  if(this.enquiry['taged'] != 'true'){

    this.enquiry['tag_code'] = '';
    this.enquiry['tag_code1'] = '';
    this.enquiry['tag_code2'] = '';
    this.enquiry['gettaged'] = '';
    this.enquiry['tag_id'] = '';


  }
}
submit(){


  let loader = this.load.create({
          content: 'Please Wait',
          spinner: 'bubbles',
        });
        loader.present();

        if(this.enquiry['taged'] != 'true'){

          this.enquiry['tag_code'] = '';
          this.enquiry['tag_code1'] = '';
          this.enquiry['tag_code2'] = '';
          this.enquiry['gettaged'] = '';
          this.enquiry['tag_id'] = '';


        }

        this.enquiry['images'] = this.images;
        this.enquiry['id_employee'] =  this.empData['uid'];
        this.enquiry['id_branch'] = this.empData['id_branch'];

        this.enquiry['type'] = this.type;

        this.retail.addToenquiry(
          this.enquiry).then(data=>{


          let toastMsg = this.toast.create({
            message: data.msg,
            duration: 2000,
            position: 'middle'
          });
          toastMsg.present();

          loader.dismiss();

              this.navCtrl.setRoot(HomePage);

	//this.navCtrl.setRoot(faqpa)
        },err=>{
          let toastMsg = this.toast.create({
            message: "* Fields are required",
            duration: 2000,
            position: 'middle'
          });
          toastMsg.present();
          loader.dismiss();

        })
}



removefield(i){


  let alert = this.alertCtrl.create({
 title: 'Are You Sure Want to Delete?',
 buttons: [
   {
     text: 'No',
     role: 'cancel',
     handler: () => {
       console.log('Cancel clicked');
     }
   },
   {
     text: 'Yes',
     handler: () => {
       console.log('yes clicked');
         this.enquiry['whole'].splice(i,1);
        //  this.ferror = null;
         if(this.enquiry['whole'].length == 0){
          this.enquiry['whole'] = [{'design_no':'','design_name':'','sub_design_no':'','sub_design_name':'','pro_id':'','product_name':''}];
        }

   }
 }
 ]
});
alert.present();


}
addfield(i){
if(this.enquiry['whole'][i]['design_name'] != '' && this.enquiry['whole'][i]['sub_design_name'] != '' && this.enquiry['whole'][i]['product_name'] != ''){
  this.enquiry['whole'].push({'design_no':'','design_name':'','sub_design_no':'','sub_design_name':'','pro_id':'','product_name':'','weight':'','id_weight':'','weight_description':'','reason':'','images':''})
}
else{
  // this.ferror = false;
  let toastMsg = this.toast.create({
    message: "Please Enter Valid Details",
    duration: this.comman.toastTimeout,
    position: 'center'
  });
  toastMsg.present();
}

}
 // Tag Item
 getref(tag_code){
  if (tag_code.length > 0) {
    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();
    var postData = {"type":'EstiTag',"searchTxt":tag_code,"searchField":"ref","id_branch":this.empData['id_branch']};
    this.retail.getref(postData).then(data=>{
      if(data.status){

          // data.tagData['product_name'] = ( data.tagData['parent_prods_name'] != null ? (data.tagData['parent_prods_name']+','+data.tagData['product_name']) : data.tagData['product_name'] );
          this.enquiry = data.tagData;
          this.enquiry['taged'] = 'true';
          this.enquiry['gettaged'] = 'true';
          // this.enquiry['net_wt'] = data.tagData['net_wt'];
          this.enquiry['tag_id'] = data.tagData['tag_id'];
          this.enquiry['tag_code'] = data.tagData['tag_code'];
          this.enquiry['whole'] = [];
          this.enquiry['whole'] = data.tagData['ref_details'];
          this.enquiry['empname'] = '';

          // this.image = data.tagData['image'];


        }else{
      let toastMsg = this.toast.create({
        message: data.msg,
        duration: this.comman.toastTimeout,
        position: 'center'
      });
      toastMsg.present();
      }

      loader.dismiss();
    })
  }else{
    console.log(tag_code);
    let toastMsg = this.toast.create({
      message: "Enter Tag Code",
      duration: this.comman.toastTimeout,
      position: 'center'
    });
    toastMsg.present();
  }
}

getmodal(name, details) {
    let mod = this.modal.create(CountrymodelPage, { data: details, name: name })
    mod.present();
    mod.onDidDismiss((dataa, name) => {
      if (dataa != undefined) {


        if (name == 'Village') {
          this.enquiry['area'] = dataa['village_name'];
          this.enquiry['id_village'] = dataa['id_village'];
        }
      }

    });

  }

  setwei(i,data){

this.enquiry['whole'][i]['net_wt'] = data;

  }
  searchrange() {

    this.weights = this.sweights.filter(item => item['weight_description'].toUpperCase().includes(this.input2.toUpperCase()));
  }
  non(){

  this.navCtrl.push(NotconvertedPage);
  }

  texto(event){
    if(event.keyCode == 13){
      this.getref(this.enquiry['ref_no']);
    }
    console.log(event)
  }

  openEmpModal(){
		let modal = this.modal.create(EmpSearchPage,{"empData" : this.employees})
		modal.present();
		modal.onDidDismiss(data => {
		  if(data != null){

			this.enquiry['empname'] = data.emp_name;
			this.enquiry['id_employee']  = data.id_employee;
		  }
		});
	  }

}
