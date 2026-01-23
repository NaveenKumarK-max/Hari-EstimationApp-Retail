import { Component } from '@angular/core';
import { Events,IonicPage, NavController, NavParams,AlertController,ToastController,LoadingController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { HomePage } from '../home/home';


/**
 * Generated class for the BluetoothPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-bluetooth',
  templateUrl: 'bluetooth.html',
})
export class BluetoothPage {

  pairedList: pairedlist;
  listToggle: boolean = false;
  pairedDeviceID: number = 0;
  dataSend: string = "";

  constructor( private events: Events,public load:LoadingController,public toastCtrl:ToastController,public alertCtrl:AlertController,private bluetoothSerial: BluetoothSerial,public navCtrl: NavController, public navParams: NavParams) {
  
    this.dataSend = this.navParams.get('file');

    this.checkBluetoothEnabled();

   


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BluetoothPage');
  }
  checkBluetoothEnabled() {
    this.bluetoothSerial.isEnabled().then(success => {
      this.listPairedDevices();
    }, error => {
        console.log(error);
      this.showError("Please Enable Bluetooth")
    });
  }

  listPairedDevices() {
    this.bluetoothSerial.list().then(success => {
      this.pairedList = success;
      this.listToggle = true;
      console.log(success);

    }, error => {
        console.log(error);

      this.showError("Please Enable Bluetooth")
      this.listToggle = false;
    });
  }

  selectDevice() {
    console.log(this.pairedList);
    console.log(this.pairedDeviceID);

    let connectedDevice = this.pairedList[this.pairedDeviceID];
    if (!connectedDevice.address) {
      this.showError('Select Paired Device to connect');
      return;
    }
    let address = connectedDevice.address;
    let name = connectedDevice.name;

    this.connect(address);
  }

  connect(address) {
    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();
      console.log(address);
    // Attempt to connect device with specified address, call app.deviceConnected if success
    this.bluetoothSerial.connect(address).subscribe(success => {
        console.log(success);

      this.deviceConnected();
      loader.dismiss();
      this.showToast("Successfully Connected");
    }, error => {
        console.log(error);
        loader.dismiss();

      this.showError("Error:Connecting to Device");
    });
  }

  deviceConnected() {
    // Subscribe to data receiving as soon as the delimiter is read
    this.bluetoothSerial.subscribe('\n').subscribe(success => {
      this.handleData(success);
      this.showToast("Connected Successfullly");
      console.log(success);

    }, error => {
        console.log(error);

      this.showError(error);
    });
  }

  deviceDisconnected() {
    // Unsubscribe from data receiving
    this.bluetoothSerial.disconnect();
    this.showToast("Device Disconnected");
  }

  handleData(data) {
    this.showToast(data);
  }

  sendData() {
    let loader = this.load.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present();

    this.bluetoothSerial.write(this.dataSend['est_printable']).then(success => {
      loader.dismiss();

      this.showToast(success);
      console.log(success);

    }, error => {
        console.log(error);
        loader.dismiss();

      this.showError(error)
    });
  }


  showError(error) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: error,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  showToast(msj) {
    const toast = this.toastCtrl.create({
      message: msj,
      duration: 1000
    });
    toast.present();

  }
  goto(){

    this.navCtrl.setRoot(HomePage);
  }
  ionViewWillLeave(){
		this.events.publish( 'entered', false );						
  
	  }
  ionViewWillEnter(){

	this.events.publish( 'entered', true );						
	this.events.publish( 'pageno', 1 );	

  }
}
interface pairedlist {
  "class": number,
  "id": string,
  "address": string,
  "name": string
}