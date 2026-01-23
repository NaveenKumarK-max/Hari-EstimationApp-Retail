import { Component , ViewChild} from '@angular/core';

import { CommonProvider,BaseAPIURL} from '../../providers/common';
import { Slides } from 'ionic-angular';

export interface Slide {
  image: string;
}

@Component({
  selector: 'carousel',
  templateUrl: 'carousel.html',
  providers: [CommonProvider]

})
export class CarouselComponent {
  @ViewChild('slides') slides: Slides;

  slidess: any[] = [];
  text: string;
  animateClass = { 'zoom-in': true };
  
  constructor(public comman:CommonProvider) {

    console.log('caro');
   /* take images from carousel provider*/
 /*        this.comman.getbanner().then(data=>{

          console.log(data)
      this.slidess = data['offers_banners'];
      console.log(this.slidess);
      // return data;

    }) */
  
  }
  slide(){
    this.slides.startAutoplay();
  }

}
