import { Component, ViewChild } from '@angular/core';
import { NavController, Keyboard, ModalController, Events, LoadingController, Content, NavParams, ViewController, Platform, AlertController, ActionSheetController, ToastController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common'; 
import { RetailProvider } from '../../providers/retail';
import { AddQuickCus } from '../modal/add-quick-cus/add-quick-cus';
import { WishlistPage } from '../wishlist/wishlist';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
///import { Transfer, TransferObject } from '@ionic-native/transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http'; 
import { EditorPage } from '../../pages/img-editor/editor';
import { CusSearchPage } from '../modal/customer/customer';
import { CartPage } from '../cart/cart';
import { DatePicker } from '@ionic-native/date-picker';

declare var cordova: any;
declare let window: any;
declare var require: any;

@Component({
  selector: 'page-customorder',
  templateUrl: 'customorder.html',
    providers: [RetailProvider]

})
export class CustomorderPage {
  
    item = [];  
    customData = [];  
    wishlistData = {};
    empData = JSON.parse(localStorage.getItem('empDetail'));
    proceedWishlist = false;
    hideAddToWishlist = false; 
    hideUpdateItem = true;
    showDesignDet = false;
    enable_customize = true;
    showCustomize = true;
    inpErrorMsg = {"weight" : "", "width" : "", "dia" : "", "len" : "", "purity" : "" };
    // Sample Image
    public targetPaths: any[] = [];
    public filenames = [];
    deletephotos: any[] = [];
    lastImage: string = null;
    showedit:any = false; 
    loader: any;
    design_no:any;

    id_ret_category:any =  this.navParams.get('id_category');
    id_product:any = this.navParams.get('id_product');
    id_sub_design:any =  this.navParams.get('id_sub_design');

    constructor(private datePicker: DatePicker,public common: CommonProvider, public keyboard: Keyboard, public view: ViewController, public platform: Platform, public navParams: NavParams, public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, private  modal: ModalController, public toast: ToastController, private events: Events, private loadingCtrl: LoadingController, private retail: RetailProvider, private camera: Camera,  private ftransfer: FileTransfer, private file: File, public http: Http, private filePath: FilePath, private alertCtrl: AlertController ) {
     

     console.log(this.empData)
      let type = this.navParams.get('type');
      if(type == 'view_only'){
        this.hideAddToWishlist = true;
        this.showDesignDet = true;
        this.enable_customize = false;
      }
      else if(type == 'edit'){
        this.hideAddToWishlist = true;
        this.hideUpdateItem = false;
        this.proceedWishlist = true;
      } 
      // Set design number
      if(this.navParams.get('design_no')){
        this.id_ret_category = this.navParams.get('id_category');
        this.id_product = this.navParams.get('id_product');
        this.design_no = this.navParams.get('design_no');
        this.id_sub_design = this.navParams.get('id_sub_design');

        localStorage.setItem( 'last_cat_no', this.id_ret_category );
        localStorage.setItem( 'last_pro_no', this.id_product );
        localStorage.setItem( 'last_design_no', this.design_no );
        localStorage.setItem( 'last_subdesign_no', this.id_sub_design );
      }else{
        this.id_ret_category = localStorage.getItem( 'last_cat_no');
        this.id_product = localStorage.getItem( 'last_pro_no');
        this.design_no = localStorage.getItem( 'last_design_no');
        this.id_sub_design = localStorage.getItem( 'last_subdesign_no');
      }
      let customData = this.navParams.get('item');
      console.log("Design Number : "+customData);

      if(customData){
        this.customData = customData;
      } 
      let loader = this.loadingCtrl.create({
        content: 'Please Wait',
        spinner: 'bubbles',
      });
      loader.present();
      this.retail.getDesignById({'id_category': this.id_ret_category,'id_product': this.id_product,"design_no" : this.design_no,'id_sub_design':this.id_sub_design}).then(result => { 
        this.item = result;
        if(!customData){

        this.customData = result;

        }
        if(this.customData['stones']){
          this.item['stones'].forEach((value, key) => {
            let stone = this.customData['stones'].filter( i => i.stone_id === value.stone_id );
            if(stone.length > 0){
              this.item['stones'][key]['selected'] = true;
            }
            console.log(key);
            console.log(this.item['stones']);
          });
        }
        loader.dismiss();
      });
    }

    ionViewDidLoad() { 
    }

    ionViewWillEnter(){
      this.events.publish( 'entered', true );						
this.events.publish( 'pageno', 1 );	
      console.log("ionViewWillEnter : Keyboard isOpen "+ +this.keyboard.isOpen());  
      if(localStorage.getItem('dip') != ''){
        var path :any = JSON.parse(localStorage.getItem('dip'))
        var name :any = JSON.parse(localStorage.getItem('din')) 
        console.log("dip : "+path+" -- "+"din : "+name)
      }    
      if(path != null && path != undefined && path != '' && this.navParams.get('state') == true){
        this.targetPaths.push(path);
        this.showedit = true;
        console.log(this.targetPaths)
        this.filenames.push(name);   
        console.log(this.filenames)
        this.customData['sample_images'] = this.filenames;
      }
      this.events.subscribe('img', (userEventData) => {
      // this.customData['sample_images'] = userEventData;
      });
      this.events.subscribe('tar', (userEventData) => {
        console.log(userEventData)
        this.targetPaths.pop();  
        this.targetPaths.push(userEventData);
        this.showedit = true;
        console.log(this.targetPaths)
      });
      this.events.subscribe('file', (userEventData) => {
        console.log(userEventData)  
        this.filenames.pop();  
        this.filenames.push(userEventData);   
        console.log(this.filenames)
        this.customData['sample_images'] = this.filenames;  
      });
      this.events.subscribe('err', (userEventData) => {
        this.targetPaths.splice( userEventData, 1 );
      });
      this.events.subscribe('errr', (userEventData) => {
        this.filenames.splice( userEventData, 1 );
      });
      console.log(this.customData);
      console.log(this.targetPaths)
    } 

    validateFields(){   
      console.log(this.inpErrorMsg);
      if(this.inpErrorMsg['weight'] == "Invalid" || this.inpErrorMsg['purity'] == "Invalid" ){
        this.proceedWishlist = false;
      }else{
        if(this.inpErrorMsg['weight'] == "Valid" && this.inpErrorMsg['purity'] == "Valid"){
          this.proceedWishlist = true;
        }
      }
    }

    customInputChanged(field,val){
      let value = parseFloat(val);
      if(field == "weight"){  
        this.proceedWishlist = false;
        if(this.item['min_weight'] > 0 || this.item['max_weight'] > 0){
          if( value >= this.item['min_weight'] && value <= this.item['max_weight'] ){
            this.inpErrorMsg['weight'] = "Valid";
            this.validateFields();
          }         
          else if( value < this.item['min_weight']){
            this.inpErrorMsg['weight'] = "Invalid";
          } 
          else if( value > this.item['max_weight'] ){
            this.inpErrorMsg['weight'] = "Invalid";
          }
        }else{
          if( value > 0 ){
            this.inpErrorMsg['weight'] = "Valid";
            this.validateFields();
          } 
        }           
      }
      else if(field == "len"){        
        if(this.item['min_length'] > 0 || this.item['max_length'] > 0){
          if( value >= this.item['min_length'] && value <= this.item['max_length'] ){
            this.inpErrorMsg['len'] = "Valid";
            this.validateFields();
          }         
          else if( value < this.item['min_length']){
            this.inpErrorMsg['len'] = "Invalid";
          } 
          else if( value > this.item['max_length'] ){
            this.inpErrorMsg['len'] = "Invalid";
          }
        }else{
          if( value > 0 ){
            this.inpErrorMsg['len'] = "Valid";
            this.validateFields();
          } 
        }      
      }
      else if(field == "width"){        
        if(this.item['min_width'] > 0 || this.item['max_width'] > 0){
          if( value >= this.item['min_width'] && value <= this.item['max_width'] ){
            this.inpErrorMsg['width'] = "Valid";
            this.validateFields();
          }         
          else if( value < this.item['min_width']){
            this.inpErrorMsg['width'] = "Invalid";
          } 
          else if( value > this.item['max_width'] ){
            this.inpErrorMsg['width'] = "Invalid";
          }
        }else{
          if( value > 0 ){
            this.inpErrorMsg['width'] = "Valid";
            this.validateFields();
          } 
        }      
      }
      else if(field == "dia"){        
        if(this.item['min_dia'] > 0 || this.item['max_dia'] > 0){
          if( value >= this.item['min_dia'] && value <= this.item['max_dia'] ){
            this.inpErrorMsg['dia'] = "Valid";
            this.validateFields();
          }         
          else if( value < this.item['min_dia']){
            this.inpErrorMsg['dia'] = "Invalid";
          } 
          else if( value > this.item['max_dia'] ){
            this.inpErrorMsg['dia'] = "Invalid";
          }
        }else{
          if( value > 0 ){
            this.inpErrorMsg['dia'] = "Valid";
            this.validateFields();
          } 
        }      
      }
    }


    toggle(block) {
      if(block == 'desDetail')
        this.showDesignDet = (this.showDesignDet == true ? false : true ); 
      if(block == 'customize')
        this.showCustomize = (this.showCustomize == true ? false : true ); 
    }

    setPurity(data,name){
      this.inpErrorMsg['purity'] = "Valid";
      this.customData['id_purity'] = data; 
      this.validateFields();
    }

    changeImaged( image ) {
      this.item['defaultImage'] = image;
    }

    ngAfterViewInit() {
    }

    proceedToWishlist(){
      // let currentCustomer = localStorage.getItem( 'currentCustomer' );
      // if ( currentCustomer != null ) {
      //   this.addToWishlist();        
      // }else{
      //   this.openAddQuickCus();
      // }
      console.log(this.customData)

      if(this.customData['id_purity'] == '' || this.customData['weight'] == '' || this.customData['pcs'] == '' || this.customData['due_date'] == ''  ){
       console.log(this.customData)
        if(this.customData['id_purity'] == ''){
          this.common.presentToast( 'Please Select Purity *',1000 );

        }
        else if(this.customData['weight'] == ''){
          this.common.presentToast( 'Please Enter Weight *',1000 );

        }
        else if(this.customData['pcs'] == ''){
          this.common.presentToast( 'Please Enter Pieces *',1000);

        }
        else if(this.customData['due_date'] == ''){
          this.common.presentToast( 'Please Select Date *',1000);

        }
      }else{
        this.openAddQuickCus();

      }
    }

    openWishlist(){
      this.navCtrl.push(WishlistPage);
    }

    stoneChaned(value,idx){
      console.log(value+' '+idx);
      console.log(this.item['stones']);
    }

    addToWishlist(){ 
      // this.loader = this.loadingCtrl.create( {
      //   content: "Please wait...",
      //   spinner: 'bubbles',
      // } );
      // this.loader.present();
      // console.log(this.item['stones']);
      // let cusData = JSON.parse( localStorage.getItem( 'currentCustomer' ) );
      // let empData = JSON.parse(localStorage.getItem('empDetail'));
      // console.log(empData);
      // console.log(this.empData);

      // this.wishlistData = {
      //                       'id_customer'     : cusData['id_customer'],
      //                       'id_branch'       : empData['id_branch'],
      //                       'id_employee'     : empData['id_employee'],
      //                       'item_type'       : 3, // E-catalog
      //                       'is_customized'   : 1,
      //                       'id_product'      : this.item['pro_id'],
      //                       'design_no'       : this.item['design_no'],
      //                       'id_sub_design'   : this.item['id_sub_design'],
      //                       'wast_percent'    : 1,
      //                       'id_mc_type'      : this.item['mc_type'],
      //                       'mc'              : this.item['mc_value'],
      //                       'stn_amt'         : 0,
      //                       'due_date'        : this.customData['due_date'],
      //                       'length'          : this.customData['len'],
      //                       'width'           : this.customData['width'],
      //                       'dia'             : this.customData['dia'],
      //                       'weight'          : this.customData['weight'],
      //                       'id_size'            : this.customData['id_size'],
      //                       'pcs'             : this.customData['pcs'],
      //                       'id_purity'       : this.customData['id_purity'],
      //                       'hook_type'       : this.customData['hook_type'],
      //                       'sample_details'  : this.customData['sample_details'],
      //                       'sample_images'   : this.customData['sample_images'],
      //                       'stones'          : this.item['stones'],
      //                       'status'          : 1,
      //                       'id_wishlist'     : this.customData['id_wishlist'],
      //                     };
      //                     this.retail.addToCart({"id_branch" : empData['id_branch'], "id_employee" : empData['id_employee'], "id_customer" : cusData['id_customer'], "status" : 1,"items" :[this.wishlistData]}).then(result => { 
      //                       this.loader.dismiss();
      //   this.common.presentToast( result.msg,'' );
      //   if(result.status){ 
      //     this.hideAddToWishlist = true;
      //     this.navCtrl.setRoot(CartPage);
      //   }
      //   if(result.status){ 
      //     this.hideAddToWishlist = true;
      //   }
      // });



      // let cusData = JSON.parse( localStorage.getItem( 'currentCustomer' ) );
      let empData = JSON.parse(localStorage.getItem('empDetail'));
      console.log(empData);
      console.log(this.empData);

      this.wishlistData = {
                            'id_customer'     : '',
                            'id_branch'       : empData['id_branch'],
                            'id_employee'     : empData['id_employee'],
                            'item_type'       : 3, // E-catalog
                            'is_customized'   : 1,
                            'id_product'      : this.item['pro_id'],
                            'design_no'       : this.item['design_no'],
                            'id_sub_design'   : this.item['id_sub_design'],
                            'wast_percent'    : 1,
                            'id_mc_type'      : this.item['mc_type'],
                            'mc'              : this.item['mc_value'],
                            'stn_amt'         : 0,
                            'due_date'        : this.customData['due_date'],
                            'length'          : this.customData['len'],
                            'width'           : this.customData['width'],
                            'dia'             : this.customData['dia'],
                            'weight'          : this.customData['weight'],
                            'id_size'            : this.customData['id_size'],
                            'pcs'             : this.customData['pcs'],
                            'id_purity'       : this.customData['id_purity'],
                            'hook_type'       : this.customData['hook_type'],
                            'sample_details'  : this.customData['sample_details'],
                            'image': this.item['defaultImage'],
                            'sample_images'   : this.customData['sample_images'],
                            'stones'          : this.item['stones'],
                            'status'          : 1,
                            'id_wishlist'     : this.customData['id_wishlist'],
                            'sub_design_name' : this.item['sub_design_name'],
                            'design_name' : this.item['design_name'],
                            'product_name' : this.item['product_name'],
                            'id_category': this.id_ret_category,
                          };
                           if(localStorage.getItem('carts') == null){
                            localStorage.setItem('carts', JSON.stringify({"id_branch" : empData['id_branch'], "id_employee" : empData['id_employee'], "id_customer" : '', "status" : 1,"items" :[this.wishlistData]}));
                           }
                           else{

                            let local :any[] = JSON.parse(localStorage.getItem('carts'))['items'] ;
                            console.log(local)
                            local.push(this.wishlistData);
                            console.log(local)
                            localStorage.setItem('carts', JSON.stringify({"id_branch" : empData['id_branch'], "id_employee" : empData['id_employee'], "id_customer" : '', "status" : 1,"items" :local}));

                           }

                            // this.loader.dismiss();
        this.common.presentToast( "Product added to cart successfully",'' );
        this.navCtrl.setRoot(CartPage);
    }

    updateWishlist(){
      this.loader = this.loadingCtrl.create( {
        content: "Please wait...",
        spinner: 'bubbles',
      } );
      this.loader.present(); 
      let cusData = JSON.parse( localStorage.getItem( 'currentCustomer' ) );
      let empData = JSON.parse(localStorage.getItem('empDetail'));
      this.wishlistData = {
                            'id_customer'     : cusData['id_customer'],
                            'id_branch'       : empData['id_branch'],
                            'id_employee'     : empData['id_employee'],
                            'item_type'       : 3, // E-catalog
                            'is_customized'   : 1,
                            'id_product'      : this.item['pro_id'],
                            'design_no'       : this.item['design_no'],
                            'id_sub_design'   : this.item['id_sub_design'],

                            'wast_percent'    : 1,
                            'id_mc_type'      : this.item['mc_type'],
                            'mc'              : this.item['mc_value'],
                            'stn_amt'         : 0,
                            'length'          : this.customData['len'],
                            'due_date'        : this.customData['due_date'],

                            'width'           : this.customData['width'],
                            'dia'             : this.customData['dia'],
                            'weight'          : this.customData['weight'],
                            'size'            : this.customData['size'],
                            'pcs'             : this.customData['pcs'],
                            'id_purity'       : this.customData['id_purity'],
                            'hook_type'       : this.customData['hook_type'],
                            'sample_details'  : this.customData['sample_details'],
                            'sample_images'   : this.customData['sample_images'],
                            'stones'          : this.item['stones'],
                            'status'          : this.customData['status']
                          };
      this.retail.addToCart({"id_branch" : empData['id_branch'], "id_employee" : empData['id_employee'], "id_customer" : cusData['id_customer'], "status" : 1,"items" :[this.wishlistData]}).then(result => { 
        this.loader.dismiss();
        this.common.presentToast( result.msg,'' );
        if(result.status){ 
          this.hideUpdateItem = true;
          this.navCtrl.pop();
        }
      });
    }

    openAddQuickCus() {
      // let modal = this.modal.create(AddQuickCus, {"page":"design-detail"}, {enableBackdropDismiss: false})
      // modal.present();
      // modal.onDidDismiss(mData => {
      //   if(mData != null){
      //     localStorage.setItem( 'currentCustomer', JSON.stringify( mData ) );
      //     this.addToWishlist();   
      //   }
      // });
    //   let modal = this.modal.create(CusSearchPage,{'show':'true',"page":"design-detail"}, {enableBackdropDismiss: false})
    //   modal.present();
    //   modal.onDidDismiss(mData => {
    //     console.log(mData)
    //     if(mData != null){
    //       localStorage.setItem( 'currentCustomer', JSON.stringify( mData ) );
    //       this.addToWishlist();
    // }else{
          
    //     }
    //   });
    this.addToWishlist();

    } 

    // Sample image
    deletePhoto( index ) {
      let confirm = this.alertCtrl.create( {
          title: 'Do you want to delete the image?',
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
                      this.targetPaths.splice( index, 1 );
                      this.filenames.splice( index, 1 );
                      this.deletephotos.push(this.filenames[index])
                      this.lastImage == '';
                  }
              }
          ]
      } );
      confirm.present();
  }

  public presentActionSheet() {
      let actionSheet = this.actionSheetCtrl.create( {
          title: 'Select Image Source',
          buttons: [
               {
                   text: 'Load from Gallery',
                   handler: () => {
                      this.takePicture( this.camera.PictureSourceType.PHOTOLIBRARY );
                  }
               },
              {
                  text: 'Take Picture',
                  handler: () => {
                      this.takePicture( this.camera.PictureSourceType.CAMERA );
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
    console.log(sourceType);
    // this.navCtrl.push(EditorPage,{images:'assets/img/earings.jpg'});
    // Create options for the   Dialog
    var options = {
        quality: 75,
        sourceType: sourceType,
        saveToPhotoAlbum: false,
        correctOrientation: true,
      // allowEdit:true
    };
    console.log(options);
    // Get the data of an image
    this.camera.getPicture( options ).then(( imagePath ) => { 
      console.log("getPicture");
      this.loader = this.loadingCtrl.create( {
          content: "Fetching...",
          spinner: 'bubbles',
      } );
      this.loader.present();
      console.log("imagePath : "+imagePath);
      if ( this.platform.is( 'android' ) && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY ) {
          this.filePath.resolveNativePath( imagePath )
              .then( filePath => {
                  console.log('ttttttttttt',this.filePath)
                  let correctPath = filePath.substr( 0, filePath.lastIndexOf( '/' ) + 1 );
                  let currentName = imagePath.substring( imagePath.lastIndexOf( '/' ) + 1, imagePath.lastIndexOf( '?' ) );
                  this.copyFileToLocalDir( correctPath, currentName, this.createFileName() );
                  // this.uploadImage();
              } );
      } 
      else {
          var currentName = imagePath.substr( imagePath.lastIndexOf( '/' ) + 1 );
          var correctPath = imagePath.substr( 0, imagePath.lastIndexOf( '/' ) + 1 );
          this.copyFileToLocalDir( correctPath, currentName, this.createFileName() );
          // this.uploadImage();
        
      }
    }, ( err ) => {
        console.log(err)
        this.common.presentToast( 'Error while selecting image.','' );
    })

  }

  // Create a new name for the image
  private createFileName() {
      var d = new Date(),
          n = d.getTime(),
          newFileName = n + ".jpg";
      return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir( namePath, currentName, newFileName ) {
    console.log("#### copyFileToLocalDir ####");
    console.log("namePath/correctPath : "+namePath);
    console.log("currentName : "+currentName);
    console.log("createdFileName : "+newFileName);
    console.log("Directory : "+cordova.file.dataDirectory);
      this.file.copyFile( namePath, currentName, cordova.file.dataDirectory, newFileName ).then( success => {
        console.log("#### copyFile -- Success ####");
        console.log(success);
          this.lastImage = newFileName;
          var targetPath = this.pathForImage( newFileName );
          this.targetPaths.push( targetPath );
          this.filenames.push( this.lastImage );
          // this.uploadImage();
          this.loader.dismiss();
          console.log(targetPath);
          console.log(this.filenames);
          this.navCtrl.push(EditorPage,{"images":targetPath,"design_no":this.design_no})

      }, error => {
          this.common.presentToast( 'Error while storing file.','' );
      } );
  }

  // Always get the accurate path to your apps folder
  public pathForImage( img ) {
    if ( img === null ) {
        return '';
    } else {
        return cordova.file.dataDirectory + img;
    }
  }

  show(){
    // this.keyboard.close();
    this.datePicker.show({
        date: new Date(),
        mode: 'date',
        androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
      }).then(date =>{	
        /*date => console.log('Got date: ', date),
        err => console.log('Error occurred while getting date: ', err),*/
        /*console.log('Got date: '+ date);
        var curDate = new Date();
        curDate.setDate(curDate.getDate() - 10);*/
        var ddd = date.getDate();
        var mmm = date.getMonth() + 1;
        var yy = date.getFullYear();
        //var today = new Date(yy+"-"+mmm+"-"+ddd).toISOString().substring(0, 10);
        var today = date.toISOString().substring(0, 10);
        //this.fromdate= today;
        this.customData['due_date'] = yy+"-"+mmm+"-"+ddd;
        console.log( this.customData['due_date']);
      });
}
ionViewWillLeave(){
  this.events.publish( 'entered', false );						

  }

}
