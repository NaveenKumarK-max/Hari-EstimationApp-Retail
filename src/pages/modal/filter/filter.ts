import { Component, Input, trigger, state, style, transition, animate, keyframes, ElementRef, Pipe } from '@angular/core';
import {Events,LoadingController,ModalController,ViewController, NavParams  } from 'ionic-angular';
import { CommonProvider } from '../../../providers/common';
import { RetailProvider } from '../../../providers/retail';

/**
 * Generated class for the CategoryComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component( {
    selector: 'filter',
    templateUrl: 'filter.html',
	providers:[CommonProvider, RetailProvider]
} )
export class FilterPage {

   
    @Input() data: any;
   
    animateItems = [];
    categoryItems = [];
    animateClass: { 'zoom-in': true };

	filters :object[] ;	
	filter_options  :object[];
	filterargs  :object; 
	
    constructor(private events: Events,private navParams: NavParams, private loadingCtrl: LoadingController, public modalCtrl: ModalController , private viewCtrl: ViewController, private retail: RetailProvider, public common:CommonProvider ) {
		
		this.filters = this.navParams.get('filters');
		this.filter_options = this.navParams.get('filter_options');
		this.filterargs = this.navParams.get('filterargs');		
		
    }
		
	showfilterOptions(filter_id: number){
	     this.filterargs = {'id_filter':filter_id,'show':1};
    }
	
    get_filterAndOptions(filter_id: number,option_id: number){
		this.filterargs = {'id_filter':filter_id,'show':1};
    }
	
	reset_filter() {		
        let resetData = JSON.parse(localStorage.getItem( 'resetFilterData'));	
		this.filters = resetData.filters;
		console.log(resetData.filters);
		this.filter_options = resetData.filter_options;
		this.filterargs = resetData.filterargs;
		console.log(JSON.parse(localStorage.getItem( 'resetFilterData')));		
    }
	
	apply_filter() {
	   let obj ={filters:this.filters,filter_options:this.filter_options,filterargs:this.filterargs};
       localStorage.setItem( 'appliedFilter',JSON.stringify( obj ) );		
	   console.log(JSON.parse(localStorage.getItem( 'appliedFilter')));
	   this.viewCtrl.dismiss({filters:this.filters,filter_options:this.filter_options,filterargs:this.filterargs});
	}
	
	dismiss_modal(){
		let appliedFilter = JSON.parse(localStorage.getItem( 'appliedFilter'));	
		if(appliedFilter != null && appliedFilter != undefined){
		this.filters = appliedFilter.filters;
		this.filter_options = appliedFilter.filter_options;
		this.filterargs = appliedFilter.filterargs;
		console.log('dismiss_modal');
		console.log(JSON.parse(localStorage.getItem( 'appliedFilter')));
		}
		this.viewCtrl.dismiss();
	}
	 
	ionViewWillLeave(){
		this.events.publish( 'entered', false );						
	  
		}
	  ionViewWillEnter(){
	  
	  this.events.publish( 'entered', true );						
	  this.events.publish( 'pageno', 1 );	
	  
	  }

  
	
    /* ngAfterViewInit() {	
		console.log('ngAfterViewInit');
    } */
  
}
