import { Component,Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events,Keyboard,  ViewController,ToastController ,LoadingController,ModalController} from 'ionic-angular';

/**
 * Generated class for the FolderpressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-folderpress',
  templateUrl: 'folderpress.html',
})
export class FolderpressPage {


  constructor(public modal:ModalController,public keyboard:Keyboard,public event:Events,public navCtrl: NavController,public renderer: Renderer,public viewCtrl: ViewController, public navParams: NavParams) {
    this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'folderpress', true);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FolderpressPage');
  }

  close(data){

    this.viewCtrl.dismiss(data);
  }
 
}
