


import { Component,ViewChild, Renderer,ChangeDetectorRef } from '@angular/core';
import { IonicPage,ViewController ,Keyboard, Events, NavController, NavParams, LoadingController, ToastController, Platform, ActionSheetController, Loading, AlertController } from 'ionic-angular';
import { CommonProvider, BaseAPIURL } from '../../providers/common';
import { RetailProvider } from '../../providers/retail';
import { Toast } from '@ionic-native/toast';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';  
import { FilePath } from '@ionic-native/file-path';
//import { CartPage } from '../../pages/cart/cart';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Crop } from '@ionic-native/crop';
// import interact from 'interactjs'
//import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';
//import { getBase64Strings } from 'exif-rotate-js/lib';

//import { Caman } from '../../assets/edit.js';

import { ImagePicker } from '@ionic-native/image-picker';
import { DesignDetailPage } from '../design-detail/design-detail';
import { ProdetailPage } from '../prodetail/prodetail';

declare var cordova: any;
declare let window: any;
declare var require: any;


/**
 * Generated class for the DesignDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component( {
  selector: 'page-editor',
  templateUrl: 'editor.html',
    providers: [RetailProvider],
} )
export class EditorPage {
    
    @ViewChild('myCanvas') canvas: any;

    canvasElement: any;
    lastX: number;
    lastY: number;
    tt:any = '';
    currentColour: string = '#1abc9c';
    availableColours: any;

    brushSize: number = 5;
    public targetPaths: any[] = [];

    public filenames = [];
    deletephotos: any[] = []; 
    sample_images : any = [];
    proid: any;
    lastImage: string = null;
    public isShown:boolean=false;
    loader: any;
    count = 1;
    date : any= new Date().toISOString(); 
    converted_image: any;
    draw: any = false;
    receive:any = '';
    text:any[] = [];
    temp = 10;
    write:any = false;
    un:any[] = []
    und:any[] = []
    msg:any;
    fshow:any =false;
    cshow:any =false;
    ushow:any =false;
    bshow:any =false;
    rshow:any =false;

    angleInDegrees:any=0;
    scrol:any = false;

    ffile:any = '';
    temp1= 30;
    d:any = false;
    finalimg =  this.navParams.get('images');
    finaldata =  this.navParams.get('productdet');

    progress:any= 0;
    show = false;

    constructor(public cd:ChangeDetectorRef,public keyboard: Keyboard,private key:Keyboard, private viewCtrl: ViewController, public renderer: Renderer,private crop: Crop,private androidPermissions: AndroidPermissions, private imagePicker: ImagePicker, private common: CommonProvider, private retail: RetailProvider, public navCtrl: NavController, public platform: Platform, public navParams: NavParams, private loadingCtrl: LoadingController, private toastCtrl: ToastController, private event: Events, private toast: Toast, public actionSheetCtrl: ActionSheetController, private camera: Camera, private transfer: Transfer, private ftransfer: FileTransfer, private file: File, public http: Http, private filePath: FilePath, private alertCtrl: AlertController ) {
        
        this.d = this.navParams.get('direct')
        console.log(this.d) 
        this.deletephotos = [] 
        localStorage.setItem('dp',null)  
        this.availableColours = [
            // '#1abc9c',
            // '#3498db',
            // '#9b59b6',
            // '#e67e22',
            '#e74c3c'
        ];        

        platform.ready().then(() => {
			platform.registerBackButtonAction(() => {
                this.navCtrl.setRoot(ProdetailPage,{'proid':this.finaldata})
            });
        });
       
        window.addEventListener('keyboardWillHide', (data) => {
            this.fshow = false;
            console.log(data)
            console.log(this.tt)
        });

    }
    
    clean(){
        this.temp1 =30;
        this.text = [];
        let self = this;
        var canvas:any = document.getElementById("canvas");
        let ctx = canvas.getContext('2d');
        var img = new Image();
        canvas.width =  window.innerWidth;

        img.onload = function(){
            var ct = document.getElementById('measure'); 
            ct.appendChild(img);
            var wrh = img.width / img.height;
            var newWidth = canvas.width;
            var newHeight = newWidth / wrh;
            if (newHeight > canvas.height) {
                newHeight = canvas.height;
                newWidth = newHeight * wrh;
            }
            ct.removeChild(img);
            canvas.height = newHeight;
            console.log(canvas.width)
            if(self.navParams.get('direct') == true){
                canvas.height = canvas.width;
                canvas.width = canvas.width;
                ctx.drawImage(img,0,0, canvas.width  , canvas.width);    
            }
            else{
                ctx.drawImage(img,0,0, canvas.width  , newHeight);    
            }
        }
        img.src = this.finalimg;
    }

    rotate(){
        this.fshow = false;
        this.cshow = false;
        this.bshow = false;
        this.ushow = false;
        this.draw = false;
        this.write = false;
        if( this.rshow == false){
            this.rshow = true;
        }
        let self = this;
        this.temp1 =30;
        this.text = [];
        var canvas:any = document.getElementById("canvas");
        let ctx = canvas.getContext('2d');
        var img = new Image();
        img.src = this.finalimg;
            
        self.angleInDegrees+=90;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save(); //save canvas state
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate( self.angleInDegrees * Math.PI / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.restore();

    }

    openk(){
        window.Keyboard.show();
    }

    undo(){
        this.fshow = false;
        this.cshow = false;
        this.bshow = false;
        this.rshow = false;
        this.draw = false;
        if( this.ushow == false){
            this.ushow = true;

        }
        this.temp1 =30;
        this.text = [];
        let self = this;
        var canvas:any = document.getElementById("canvas");
        let ctx = canvas.getContext('2d');
        var img = new Image();
        canvas.width =  window.innerWidth;
        img.onload = function(){
            var ct = document.getElementById('measure'); 
            ct.appendChild(img);
            var wrh = img.width / img.height;
            var newWidth = canvas.width;
            var newHeight = newWidth / wrh;
            if (newHeight > canvas.height) {
                newHeight = canvas.height;
                newWidth = newHeight * wrh;
            }
            ct.removeChild(img);
            canvas.height = newHeight;
            if(self.navParams.get('direct') == true){
                canvas.height = canvas.width;
                canvas.width = canvas.width;
                ctx.drawImage(img,0,0, canvas.width  , canvas.width);
    
            }
            else{
                ctx.drawImage(img,0,0, canvas.width  , newHeight);    
            }        
        }
        console.log(this.un)
        this.un.pop()
        if(this.un.length > 0){
            img.src =this.un[this.un.length - 1];
            console.log(this.un)
        }
        else{
            console.log( this.finalimg)
            img.src = this.finalimg;
        }
    }
    
    ionViewWillLeave() {

        this.event.publish('lp', true);
    }
     
    ionViewWillEnter(){    

        this.event.publish('lp', false);

        console.log('ionViewWillEnter ',this.finalimg)
        this.viewCtrl.showBackButton(false);
        var canvas:any = document.getElementById("canvas");
        let ctx = canvas.getContext('2d');
        var img = new Image();
        img.src = this.finalimg;   
        canvas.width =  window.innerWidth;
        let self = this;
        img.onload = function(){
            var ct = document.getElementById('measure'); 
            ct.appendChild(img);
            var wrh = img.width / img.height;
            var newWidth = canvas.width;
            var newHeight = newWidth / wrh;
            if (newHeight > canvas.height) {
                console.log(333333333333)
                newHeight = canvas.height;
                newWidth = newHeight * wrh;
            }
            ct.removeChild(img);
            console.log(canvas.height)

            console.log(newHeight);
            console.log(newWidth);
            canvas.height = newHeight;
            console.log(newHeight);
            console.log(canvas.width)
            if(self.navParams.get('direct') == true){
                canvas.height = canvas.width;
                canvas.width = canvas.width;
                self.editt();
            }
            else{
                ctx.drawImage(img,0,0, canvas.width  , newHeight);
            }     
        }
        img.src = this.finalimg;
        this.receive = this.finalimg;
    }

    check(value){
        console.log(1111);
        this.msg = value;
        this.tt = value;
        this.write = true;
    }

    find(){
        console.log(22222);
        this.ushow = false;
        this.cshow = false;
        this.bshow = false;
        this.rshow = false;
        this.msg = '';
        if( this.fshow == false){
            this.fshow = true;
        }
        this.write = true;
        this.draw = false;
    }

    settext(){
        var canvas:any = document.getElementById("canvas");
        let ctx = canvas.getContext('2d');
        ctx.save();
        var stringTitle: any= (<HTMLInputElement>document.getElementById('title')).value;
        this.text.push(stringTitle)
        console.log(this.text.length)           
        if(this.text.length > 1){
            console.log(true)
            this.temp1 = this.temp1 + 30;
        }
        ctx.font = '20px sans-serif';
        ctx.fillStyle = '#ff0000';
        var text_title = stringTitle;
        ctx.fillText(stringTitle, this.temp, this.temp1);
        this.key.close();
    }

    Gray(){
        this.draw = false;
        (<HTMLInputElement>document.getElementById('title')).value = '';
        var canvas:any = document.getElementById("canvas");
        let ctx = canvas.getContext('2d');
        var background = new Image();
        background.src = this.receive;
        console.log(canvas.width)
        canvas.height = 420;
        canvas.width =  window.innerWidth;
        console.log(canvas.height)
        // Make sure the image is loaded first otherwise nothing will draw.
        background.onload = function(){
            console.log('ssss')
            ctx.filter = 'grayscale(100%)';
            ctx.drawImage(background,0,0,canvas.width,canvas.height);
        }
    }

    Contrast(){
        this.draw = false;
        (<HTMLInputElement>document.getElementById('title')).value = '';
        var canvas:any = document.getElementById("canvas");
        let ctx = canvas.getContext('2d');
        var background = new Image();
        background.src = this.receive;
        console.log(canvas.width)
        // canvas.width = 700;
        canvas.height = 420;
        canvas.width =  window.innerWidth;
        // canvas.width = 500;
        console.log(canvas.height)
        // Make sure the image is loaded first otherwise nothing will draw.
        background.onload = function(){
            console.log('ssss')
            ctx.filter = 'contrast(200%)';
            ctx.drawImage(background,0,0,canvas.width,canvas.height);
        }
    }

    Blur(){
        this.draw = false;
        (<HTMLInputElement>document.getElementById('title')).value = '';
        var canvas:any = document.getElementById("canvas");
        let ctx = canvas.getContext('2d');
        var background = new Image();
        background.src = this.receive;
        console.log(canvas.width)
        // canvas.width = 700;
        canvas.height = 420;
        canvas.width =  window.innerWidth;
        // canvas.width = 500;
        console.log(canvas.height)
        // Make sure the image is loaded first otherwise nothing will draw.
        background.onload = function(){
            console.log('ssss')
            ctx.filter = 'hue-rotate(90deg)';
            ctx.drawImage(background,0,0,canvas.width,canvas.height);
        }
    }

    Sepia(){
        this.draw = false;
        (<HTMLInputElement>document.getElementById('title')).value = '';
        var canvas:any = document.getElementById("canvas");
        let ctx = canvas.getContext('2d');
        var background = new Image();
        background.src = this.receive;
        console.log(canvas.width)
        // canvas.width = 700;
        canvas.height = 420;
        canvas.width =  window.innerWidth;
        // canvas.width = 500;
        console.log(canvas.height)
        // Make sure the image is loaded first otherwise nothing will draw.
        background.onload = function(){
            console.log('ssss')
            ctx.filter = 'sepia(100%)';
            ctx.drawImage(background,0,0,canvas.width,canvas.height);
        }

    }

    Invert(){
        this.draw = false;
        (<HTMLInputElement>document.getElementById('title')).value = '';
        var canvas:any = document.getElementById("canvas");
        let ctx = canvas.getContext('2d');
        var background = new Image();        
        background.src = this.receive;
        console.log(canvas.width)
        // canvas.width = 700;
        canvas.height = 420;
        canvas.width =  window.innerWidth;
        // canvas.width = 500;
        console.log(canvas.height)
        // Make sure the image is loaded first otherwise nothing will draw.
        background.onload = function(){
            console.log('ssss')
            ctx.filter = 'invert(100%)';
            ctx.drawImage(background,0,0,canvas.width,canvas.height);
        }
    }

    Saturate(){
        this.draw = false;
        (<HTMLInputElement>document.getElementById('title')).value = '';
        var canvas:any = document.getElementById("canvas");
        let ctx = canvas.getContext('2d');
        var background = new Image();
        background.src = this.receive;
        console.log(canvas.width)
        // canvas.width = 700;
        canvas.height = 420;
        canvas.width =  window.innerWidth;
        // canvas.width = 500;
        console.log(canvas.height);
        // Make sure the image is loaded first otherwise nothing will draw.
        background.onload = function(){
            console.log('ssss')
            ctx.filter = 'saturate(8)';
            ctx.drawImage(background,0,0,canvas.width,canvas.height);
        }

    }

    ngAfterViewInit(){
        this.canvasElement = this.canvas.nativeElement;
        this.renderer.setElementAttribute(this.canvasElement, 'width', this.platform.width() + '');
        this.renderer.setElementAttribute(this.canvasElement, 'height', this.platform.height() + '');    
    }

    changeColour(colour){
        this.fshow = false;
        this.cshow = false;
        this.ushow = false;
        this.rshow = false;
        if( this.bshow == false){
            this.bshow = true;

        }
        this.draw = true;
        this.write = false;
        this.currentColour = colour;
    }

    edit(){
        this.fshow = false;
        this.ushow = false;
        this.bshow = false;
        this.rshow = false;
        if( this.cshow == false){
            this.cshow = true;

        }
        let option = {
            quality: 100,
            autoCropArea: 1
            // targetHeight: 800,
            // targetWidth: 800,
          };
        this.crop.crop( this.finalimg, option)
        .then(
          newImage => {
            console.log('0000000000'+newImage)
            console.log('4444444')
            console.log(newImage)
            this.receive = newImage;

            var canvas:any = document.getElementById("canvas");
            let ctx = canvas.getContext('2d');

            var background = new Image();
            background.src = this.receive;
            this.finalimg = this.receive;

            console.log(this.finalimg)
            // console.log(canvas.width)
            // canvas.width = 700;
            // canvas.height = 420;

            canvas.width =  window.innerWidth;
            console.log(canvas.height)
            console.log(canvas.width)
            let self = this;
            // Make sure the image is loaded first otherwise nothing will draw.
            background.onload = function(){
                console.log('ssss')
                if(self.navParams.get('direct') == true){
                    canvas.height = canvas.width;
                    canvas.width = canvas.width;
                    ctx.drawImage(background,0,0, canvas.width  , canvas.width);
                }
                else{
                    ctx.drawImage(background,0,0,canvas.width,canvas.height);
                }
            } 
            console.log('new image path is: ' + newImage)
        },
          error => console.error('Error cropping image', error)
        );
    }

    editt(){
        this.fshow = false;
        this.ushow = false;
        this.bshow = false;
        this.rshow = false;

        if( this.cshow == false){
            this.cshow = true;

        }
        let option = {
            quality: 100,
            autoCropArea: 1
            // targetHeight: 800,
            // targetWidth: 800,
          };
        this.crop.crop( this.finalimg, option)
        .then(
          newImage => {
              console.log('0000000000'+newImage)
        //     this.filePath.resolveNativePath( newImage )
        //  .then( filePath => {
             console.log('4444444')
             console.log(newImage)
             this.receive = newImage;

        var canvas:any = document.getElementById("canvas");
        let ctx = canvas.getContext('2d');

        var background = new Image();
        background.src = this.receive;
        this.finalimg = this.receive;
        console.log(this.finalimg)
        // console.log(canvas.width)
        // canvas.width = 700;
        // canvas.height = 420;

        canvas.width =  window.innerWidth;
        console.log(canvas.height)
        console.log(canvas.width)
        let self = this;
        // Make sure the image is loaded first otherwise nothing will draw.
        background.onload = function(){
            console.log('ssss')

            if(self.navParams.get('direct') == true){
            canvas.height = canvas.width;
            canvas.width = canvas.width;
            ctx.drawImage(background,0,0, canvas.width  , canvas.width);

            }
            else{
            ctx.drawImage(background,0,0,canvas.width,canvas.height);

            }
        }


        //  } );  
        console.log('new image path is: ' + newImage)
        },
        (error) =>{
            this.navCtrl.setRoot(ProdetailPage,{'proid':this.finaldata});
            console.error('Error cropping image', error)
        } 
        );
    }

    save(){
        this.converted_image = this.canvasElement.toDataURL('image/png');
        this.writeFile(this.converted_image,this.createFileName());  
    }

    //here is the method is used to write a file in storage  
    writeFile(base64Data: any, fileName: any) {  
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
            this.targetPaths.push( success['nativeURL'])
            this.filenames.push( currentName );

            // this.copyFileToLocalDir( correctPath, currentName, this.createFileName() );
            this.uploadImage(currentName)

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

    changeSize(size){
        this.brushSize = size;
    }

    handleStart(ev){
        console.log(ev);
        console.log(this.draw)
        console.log(this.write)
        console.log( (<HTMLInputElement>document.getElementById('title')).value)

        if(this.draw == false){
            console.log('insideone')

            if((<HTMLInputElement>document.getElementById('title')).value){
                console.log('insidetwo')

            var canvasPosition = this.canvasElement.getBoundingClientRect();
    
            this.lastX = ev.touches[0].pageX - canvasPosition.x;
            this.lastY = ev.touches[0].pageY - canvasPosition.y;
            var canvas:any = document.getElementById("canvas");
            let ctx = canvas.getContext('2d');
            ctx.save();
            console.log( (<HTMLInputElement>document.getElementById('title')).value)
            var stringTitle: any= (<HTMLInputElement>document.getElementById('title')).value;
            this.text.push(stringTitle)
            console.log(canvas.width)
            var array = stringTitle.split(" ");
                console.log(array)
            // if(this.text.length > 1){
            //     console.log(true)
            //     this.temp1 = this.temp1 + 30;
            // }

                ctx.font = 'bold 20px sans-serif';
                ctx.fillStyle = '#ff0000'
                var text_title = stringTitle;
                for (var i = 0; i < array.length; i++) {
                    if(i ==0){
                        console.log('insidethree')

                ctx.fillText(array[i], this.lastX, this.lastY);
                (<HTMLInputElement>document.getElementById('title')).value = '';
                this.tt = '';
                this.msg = '';
                    }
                    else{
                        console.log('insidefour')

                        this.lastY = this.lastY + 20;
                        ctx.fillText(array[i], this.lastX, this.lastY);
                        (<HTMLInputElement>document.getElementById('title')).value = '';
                        this.tt = '';

                        this.msg = '';

                    }
                }
                // array = '';
                // (<HTMLInputElement>document.getElementById('title')).value = '';
                this.write = false;

                // ctx.restore();
            
            this.key.close();
            this.un.push(this.canvasElement.toDataURL('image/png'))

            }
        }
        if(this.draw == true){
        var canvasPosition = this.canvasElement.getBoundingClientRect();
 
        this.lastX = ev.touches[0].pageX - canvasPosition.x;
        this.lastY = ev.touches[0].pageY - canvasPosition.y;
        }
    }

    end(ev){
        var test:any = (<HTMLInputElement>document.getElementById('title')).value;
        if( this.draw == true){
            this.un.push(this.canvasElement.toDataURL('image/png'))

        }
        console.log(ev)
        console.log(this.un)
    }

    readc(){
        console.log(this.write)
        if(this.write == true){
            return true
        }
        else{
            return false;
        }
    }

    handleMove(ev){
        console.log(ev)
        if(this.draw == true){
            var canvasPosition = this.canvasElement.getBoundingClientRect();
            var canvas:any = document.getElementById("canvas");
            let ctx = canvas.getContext('2d');
            let currentX = ev.touches[0].pageX - canvasPosition.x;
            let currentY = ev.touches[0].pageY - canvasPosition.y;
            ctx.beginPath();
            ctx.lineJoin = "round";
            ctx.moveTo(this.lastX, this.lastY);
            ctx.lineTo(currentX, currentY);
            ctx.closePath();
            ctx.strokeStyle = this.currentColour;
            ctx.lineWidth = this.brushSize;
            ctx.stroke();
            this.lastX = currentX;
            this.lastY = currentY;
        }
    }
 
    clearCanvas(){
        this.draw = false;
        let ctx = this.canvasElement.getContext('2d');
        ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);   
        this.clean();
         (<HTMLInputElement>document.getElementById('title')).value = '';
    }


    load(){
        this.loader = this.loadingCtrl.create( {
            content: "Uploading..."
        } );
        this.loader.present();
    } 

    ionViewDidLoad() {		          
    }

    deletePhoto( index ) {
        let confirm = this.alertCtrl.create( {
            title: 'Sure you want to delete this photo? There is no undo!',
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
                        this.loadgallery();
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

    loadgallery(){
        var options = {
            maximumImagesCount: 1,
            width: 500,
            height: 500,
            quality: 80,

           };
        this.imagePicker.getPictures(options).then(results => {
            console.log(results);
            for(var i=0; i < results.length;i++){
                let option = {
                    quality: 100,
                    };
                this.crop.crop( results[i], option)
                .then(
                    newImage => {
                        console.log('0000000000'+newImage)
                    this.filePath.resolveNativePath( newImage )
                    .then( filePath => {
                        console.log('4444444')
                        console.log(filePath)

                        let correctPath = filePath.substr( 0, filePath.lastIndexOf( '/' ) + 1 );
                        let currentName = filePath.substr( filePath.lastIndexOf( '/' ) + 1 );
                        this.copyFileToLocalDirg( correctPath, currentName, this.createFileName(),i );
                    //  if (this.count == 1) {
                        this.load();
                    //     this.count ++;
                    // }
                    } );  
                    console.log('new image path is: ' + newImage)
                },
                    error => console.error('Error cropping image', error)
                );
            };
               
      
        });        
    }

    public takePicture( sourceType ) {
        // Create options for the Camera Dialog
        var options = {
            quality: 50,
            sourceType: sourceType,
            saveToPhotoAlbum: false,
            correctOrientation: true,
			allowEdit:true

        };
        // Get the data of an image
        if ( this.platform.is( 'android' ) && sourceType === this.camera.PictureSourceType.CAMERA ) {
            this.camera.getPicture( options ).then(( imagePath ) => {
                console.log("#### getPicture ####");
                if ( this.platform.is( 'android' ) && sourceType === this.camera.PictureSourceType.CAMERA ) {
                    var currentName = imagePath.substr( imagePath.lastIndexOf( '/' ) + 1 );
                    var correctPath = imagePath.substr( 0, imagePath.lastIndexOf( '/' ) + 1 );
                    this.copyFileToLocalDir( correctPath, currentName, this.createFileName() );
                    // this.uploadImage();                    
                }
            }, ( err ) => {
                this.presentToast( 'Error while selecting image.' );
            })
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
    private copyFileToLocalDir( namePath, currentName, newFileName ) {
        console.log("#### copyFileToLocalDir ####");
        console.log("namePath/correctPath : "+namePath);
        console.log("currentName : "+currentName);
        console.log("createdFileName : "+newFileName);
        this.file.copyFile( namePath, currentName, cordova.file.dataDirectory, newFileName ).then( success => {
            this.lastImage = newFileName;
            this.targetPaths.push( this.pathForImage( this.lastImage ) );
            this.filenames.push( this.lastImage );
            console.log("targetPaths : ");
            console.log(this.targetPaths);
            console.log("filenames : ");
            console.log(this.filenames);
			this.uploadImage('');
        }, error => {
            this.presentToast( 'Error while storing file.' );
        } );
    }

    private copyFileToLocalDirg( namePath, currentName, newFileName ,i) {
        this.file.copyFile( namePath, currentName, cordova.file.dataDirectory, newFileName ).then( success => {
            this.lastImage = newFileName;
            this.targetPaths.push( this.pathForImage( this.lastImage ) );
            this.filenames.push( this.lastImage );
			this.uploadImageg(i);
        }, error => {
            this.presentToast( 'Error while storing file.' );
        } );
    }

    private presentToast( text ) {
        let toast = this.toastCtrl.create( {
            message: text,
            duration: 3000,
            position: 'middle'
        } );
        toast.present();
    }

    // Always get the accurate path to your apps folder
    public pathForImage( img ) {
        if ( img === null ) {
            return '';
        } else {
            return cordova.file.dataDirectory + img;
        }
    }    

    public uploadImageg(i) {
        // Destination URL
        var url = BaseAPIURL + 'admin_app_api/uploadImg';
		
        // File for Upload
        var targetPath = this.pathForImage( this.lastImage );
        console.log(targetPath)
        // File name only
        var filename = this.lastImage;
        var options = {
            fileKey: "cusproduct",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params: { 'fileName': filename },
            headers: { 'Authorization': 'Basic ' + btoa( this.common.getAuthUserName() + ':' + this.common.getAuthUserPwd() ) }
        };
        const fileTransfer: TransferObject = this.transfer.create();

        // Use the FileTransfer to upload the image
        fileTransfer.upload( targetPath, url, options ).then(( data ) => {
            console.log(data)
            let result = JSON.parse( data.response );
            this.sample_images = this.filenames;
            var count = 1;
        if (count == 1) {
            this.loader.dismissAll();
            count ++
            this.presentToast('Images succesfully uploaded.');
        }
        }, err => {
            this.loader.dismissAll()  
                const indexp:number = this.targetPaths.indexOf(this.lastImage);
                const indexf:number = this.targetPaths.indexOf(this.lastImage);
                this.targetPaths.splice( indexp, 1 );
                this.filenames.splice( indexf, 1 );
                this.presentToast( 'Error while uploading file.' );
        } );
		
    } 
    
    public uploadImage(name) {
        console.log("#### uploadImage ####");
        // Destination URL
        var url = BaseAPIURL + 'admin_app_api/uploadImg';	
        this.show = true;
	
        // File for Upload
        var targetPath = this.targetPaths[0]; 
        // File name only
        // var filename = this.lastImage;
        var options = {
            fileKey: "file",
            fileName: name,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params: { 'fileName': name, 'type': 'wishlist_img' },
            headers: { 'Authorization': 'Basic ' + btoa( this.common.getAuthUserName() + ':' + this.common.getAuthUserPwd() ) }
        };
        const fileTransfer: TransferObject = this.transfer.create();
        // let loader = this.loadingCtrl.create( {
        //     content: "Uploading..."
        // } );
        // loader.present();

        console.log(options);
        console.log(this.targetPaths);
        console.log(targetPath);
        console.log(encodeURI(url));
        fileTransfer.upload(targetPath, encodeURI(url), options).then((data) => {
            console.log(data);
            // loader.dismissAll();
            this.presentToast('Image succesfully uploaded.');
            this.sample_images = this.filenames;
            // loader.dismissAll();
            if(this.navParams.get('direct') == true){
                localStorage.setItem('dip',JSON.stringify(this.targetPaths[0]))
                localStorage.setItem('din',JSON.stringify(this.filenames[0]))
                this.navCtrl.setRoot(ProdetailPage,{'state':true,'proid':this.finaldata});
            }
            else{
                localStorage.setItem('dip','')
                localStorage.setItem('din','')
                this.navCtrl.pop();
                this.event.publish('img', this.sample_images[0]);
                this.event.publish('tar', this.targetPaths[0]);
                this.event.publish('file', this.filenames[0]);
                console.log(this.targetPaths)
                console.log(this.filenames)
                this.presentToast( 'Image succesfully uploaded.' );
            }
        }, err => {
            console.log(err);

            // loader.dismissAll() 
            this.presentToast('Error while uploading Image.');
            const indexp:number = this.targetPaths.indexOf(this.lastImage);
            const indexf:number = this.targetPaths.indexOf(this.lastImage);
            this.targetPaths.splice( indexp, 1 );
            this.filenames.splice( indexf, 1 );
            this.navCtrl.pop();
            this.event.publish('err', indexp);
            this.event.publish('errr', indexf);
        });
        fileTransfer.onProgress((data) => {
            console.log(data)
      
            this.progress = Math.round((data.loaded/data.total) * 100) ;
            this.refresh();
            console.log(this.progress)
      
          });

        var temp = {'name':name, 'image':this.converted_image, 'message':this.msg, 'type' : 'wishlist_img'};
        console.log(temp);
        /*this.retail.uploadImg(temp).then(data =>{
            this.sample_images = this.filenames;
            loader.dismissAll();
            if(this.navParams.get('direct') == true){
                localStorage.setItem('dip',JSON.stringify(this.targetPaths[0]))
                localStorage.setItem('din',JSON.stringify(this.filenames[0]))
                this.navCtrl.setRoot(DesignDetailPage,{'state':true});
            }
            else{
                localStorage.setItem('dip','')
                localStorage.setItem('din','')
                this.navCtrl.pop();
                this.event.publish('img', this.sample_images[0]);
                this.event.publish('tar', this.targetPaths[0]);
                this.event.publish('file', this.filenames[0]);
                console.log(this.targetPaths)
                console.log(this.filenames)
                this.presentToast( 'Image succesfully uploaded.' );
            }
        },err=>{
            loader.dismissAll()  
            const indexp:number = this.targetPaths.indexOf(this.lastImage);
            const indexf:number = this.targetPaths.indexOf(this.lastImage);
            this.targetPaths.splice( indexp, 1 );
            this.filenames.splice( indexf, 1 );
            this.navCtrl.pop();
            this.event.publish('err', indexp);
            this.event.publish('errr', indexf);
            this.presentToast( 'Error while uploading file.' );
        })*/
    }

    goback()
    {
        console.log('goback');
        this.navCtrl.setRoot(ProdetailPage,{'proid':this.finaldata})
    }
    refresh() {
        console.log('refresheed')
        this.cd.detectChanges();
      }
}
