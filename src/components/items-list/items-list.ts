import { Component, ChangeDetectorRef,Input, ViewChild, trigger, state, style, transition, animate, keyframes, ElementRef } from '@angular/core';
import { NavController, Events, Content, LoadingController,ModalController } from 'ionic-angular';
import { CommonProvider,BaseAPIURL } from '../../providers/common'; 
import { RetailProvider } from '../../providers/retail';
import { DesignDetailPage } from '../../pages/design-detail/design-detail'; 
import { CartPage } from '../../pages/cart/cart'; 
import { CusSearchPage } from '../../pages/modal/customer/customer'; 
import { CartListViewPage } from '../../pages/cart-list-view/cart-list-view';


@Component( {
    selector: 'items-list',
    templateUrl: 'items-list.html',
    providers: [CommonProvider]
} )
export class ItemsListComponent { 
    @Input() page: any;
    @ViewChild(Content)
    content: Content;
    is_empty:any;
    no_more_data = false;
    qty:any= 1; 
    items = [];
    total_weight = 0.00;
    orders:Number;
    itemsList: any[] = [];
    last_id: any = 0;
    selectedItems:any[] = [];
    currAndSett = JSON.parse(localStorage.getItem('currencyAndSettings'));
    cusData = JSON.parse( localStorage.getItem( 'currentCustomer' ) );
    empData = JSON.parse(localStorage.getItem('empDetail'));

    reActiveInfinite: any;
    timeoutHandler: number;

    constructor( public cd:ChangeDetectorRef,public events: Events, public load:LoadingController, private navCtrl: NavController, private common: CommonProvider, private retail: RetailProvider,  public modal: ModalController ) {
        events.subscribe('AddToCart:completed', (status) => {
			if (status) {
                // Remove from list 
                this.selectedItems.forEach((value, index) => {
                    let item = this.itemsList[index];
                    this.itemsList.splice(index, 1);
                    this.total_weight = this.total_weight - parseFloat(item.weight); 
                }); 
                this.selectedItems = [];   
                if(this.itemsList.length == 0){
                    this.is_empty = (this.itemsList.length > 0 ? 0 : 1);
                }
                if(this.page == "Wishlist"){
                    this.events.publish('wishListItems:selected', this.selectedItems);
                }
                else if(this.page == "Cart"){
                    this.events.publish('cartItems:selected', this.selectedItems);
                }
                this.navCtrl.push(CartPage);
			}  
        });
        events.subscribe('Order:created', (status) => {
			if (status) {

                console.log(this.selectedItems);
                console.log(this.itemsList);
                this.total_weight = 0;

                // Remove from list 
                this.selectedItems.forEach((value, index) => {

                    var indx:any = this.itemsList.indexOf(value);
                    console.log(indx)
        
                    if(indx >= 0){
                    this.itemsList.splice(indx, 1);
                    console.log(this.itemsList)
        
                    }
                }); 
                this.itemsList.forEach((data, index) => {

                    this.total_weight = this.total_weight + parseFloat(data['weight']);

                });

                let local :any = JSON.parse(localStorage.getItem('carts')) ;
                console.log(local)
                localStorage.setItem('carts', JSON.stringify({"id_branch" : local['id_branch'], "id_employee" : local['id_employee'], "id_customer" : '', "status" : 1,"items" :this.itemsList}));


                this.selectedItems = [];   
                if(this.itemsList.length == 0){
                    this.is_empty = (this.itemsList.length > 0 ? 0 : 1);
                }
                if(this.page == "Wishlist"){
                    this.events.publish('wishListItems:selected', this.selectedItems);
                }
                else if(this.page == "Cart"){
                    this.events.publish('cartItems:selected', this.selectedItems);
                }
			}  
        });
        if(this.cusData == null){
            this.cusData = {"label":""};            
        } 
    } 

    ngAfterViewInit() {
        // console.log(this.cusData);
        // if(this.cusData != null){
        //     this.getItemslist(1,''); 
        // }else{
        //     this.openCusModal();
        // }      
        console.log(localStorage.getItem('carts'))

        this.itemsList = localStorage.getItem('carts') != null ? JSON.parse(localStorage.getItem('carts'))['items'] : [];
      console.log(localStorage.getItem('carts'))
        this.total_weight = 0;
        this.itemsList.forEach( i => {
            this.total_weight = this.total_weight + parseFloat(i['weight']);
        });
        this.is_empty = (this.itemsList.length > 0 ? 0 : 1);

        console.log(this.itemsList)
    }

    itemSelected(ev, item, idx){
        console.log(this.selectedItems)
        console.log(this.page)
        console.log(idx)
        console.log(item)
        console.log(ev)
        console.log(ev == true)

        if(ev == true){
           
                this.selectedItems.push(item);
                console.log(this.selectedItems)

                if(this.page == "Wishlist"){
                    this.events.publish('wishListItems:selected', this.selectedItems);
                }
                else if(this.page == "Cart"){
                    this.events.publish('cartItems:selected', this.selectedItems);
                }
                
            }
        else{
            var index:any = this.selectedItems.indexOf(item);
            console.log(index)

            if(index >= 0){
            this.selectedItems.splice(index, 1);
            console.log(this.selectedItems)
            if(this.page == "Wishlist"){
                this.events.publish('wishListItems:selected', this.selectedItems);
            }
            else if(this.page == "Cart"){
                this.events.publish('cartItems:selected', this.selectedItems);
            }
            
            }
        }
        // if(ev == true){
        //     if(this.page == "Wishlist"){
        //         this.selectedItems[idx] = item['id_wishlist'];
        //     }
        //     else if(this.page == "Cart"){
        //         this.selectedItems[idx] = item;
        //     }
        // }else{
        //     this.selectedItems.splice(idx, 1);
        // }   
        
    }

    openCusModal() {
        let modal = this.modal.create(CusSearchPage)
        modal.present();
        modal.onDidDismiss(mData => {
            if(mData != null){
                localStorage.setItem( 'currentCustomer', JSON.stringify( mData ) );
                this.cusData = mData;
            }
        });
    } 

    getItemslist(type,infiniteScroll: any){   // type : 1 => Default, 2 => Virtual scroll
        let loader = this.load.create({
            content: 'Please Wait',
            spinner: 'bubbles',
        });
        if(type == 1){
            loader.present();
            this.last_id = 0;
        }
        let status = (this.page == "Wishlist" ? 1 : (this.page == 'Cart' ? 2 : 0) );
        let postData = {"id_branch" : this.empData['id_branch'], "id_employee" : this.empData['id_employee'], "id_customer" : this.cusData['id_customer'], "status" : status, "last_id" : this.last_id};
        this.retail.getItemslist(postData).then(result => {
            if(result.status){ 
                if(type == 1){
                    if(this.reActiveInfinite){ // Enable virtual scroll
                        this.no_more_data = false;
                        this.reActiveInfinite.enable(true);
                    }               
                    this.itemsList = result.data;
                    this.total_weight = 0;
                    this.itemsList.forEach( i => {
                        this.total_weight = this.total_weight + parseFloat(i['weight']);
                    });
                }else{
                    let data = result.data;
                    for (let index = 0; index < data.length; index++) {
                        this.itemsList.push(data[index]);
                        this.total_weight = this.total_weight + parseFloat(data[index]['weight']);
                    }
    
                    if(data.length > 0){
                        this.no_more_data = false;
                        infiniteScroll.complete();
                    }else{
                        infiniteScroll.complete();
                        this.no_more_data = true;
                        infiniteScroll.enable(false);
                    }
                }                
            }
            this.is_empty = (this.itemsList.length > 0 ? 0 : 1);
            loader.dismiss();
        }, error => {
            loader.dismiss();
        });
    } 

    doInfinite(infiniteScroll: any) {
        this.last_id = this.itemsList[this.itemsList.length - 1]['id_wishlist'];  
        this.reActiveInfinite = infiniteScroll;
        this.getItemslist(2,infiniteScroll);
    }

    editItem(item,idx){
        // this.navCtrl.push(DesignDetailPage,{'design_no':item.design_no, 'item' : item});
        this.navCtrl.push(DesignDetailPage,{ 'id_category': item['id_category'],'id_product': item['id_product'],'design_no':item['design_no'],'id_sub_design':item['id_sub_design'],'type':'edit', 'item' : item})  

    }

    deleteItem( id_wishlist, weight, idx ) {

        this.itemSelected(false, this.itemsList[idx], idx);

        let local :any = JSON.parse(localStorage.getItem('carts')) ;

        this.total_weight = this.total_weight - parseFloat(weight);
        this.itemsList.splice(idx, 1);
        local['items'] = this.itemsList; 
        localStorage.setItem('carts', JSON.stringify(local));
        this.is_empty = (this.itemsList.length > 0 ? 0 : 1);

        // let loader = this.load.create({
        //     content: 'Please Wait',
        //     spinner: 'bubbles',
        // });
        // loader.present();
        // this.retail.removeItem({"id_wishlist" : id_wishlist}).then(result => {
        //     this.common.presentToast( result.msg,'' );
        //     if(result.status){
        //         this.total_weight = this.total_weight - parseFloat(weight);
        //         this.itemsList.splice(idx, 1);
        //     } 
        //     loader.dismiss();
        // }, error => {
        //     loader.dismiss();
        // });
    }
    

    openDesign(design_no){ 
        this.navCtrl.push(DesignDetailPage,{'design_no':design_no,'type':'edit'})  
    } 

    // add( product ) {
    //     this.total_weight = 0.00;
    //     this.items.forEach(( orders ) => { // foreach statement
    //         console.log(orders);
    //         if ( orders.id_product == product.id_product && orders.sizeorlen == product.sizeorlen ) {
    //             orders.qty = parseFloat(product.qty) + 1;
    //         }
    //         var wgt = Number(orders.reqweight);
    //         var qty =(orders.qty);
    //         this.total_weight +=qty*wgt;
    //         console.log(wgt+"--"+qty+"--"+this.total_weight);
    //     } );
    //     localStorage.setItem( 'appcartitems', JSON.stringify( this.items ) );
    // }

    // sub( product ) {
    //     this.total_weight = 0.00;
    //     this.items.forEach(( orders ) => { // foreach statement
    //         if ( orders.id_product == product.id_product && orders.sizeorlen == product.sizeorlen ) {
    //             if ( product.qty != 1 )
    //                 orders.qty = product.qty - 1;
    //         }
    //         var wgt =Number(orders.reqweight);
    //         var qty = orders.qty ;
    //         this.total_weight +=qty*wgt;
    //         console.log(wgt+"--"+qty+"--"+this.total_weight);
    //     } );
    //     localStorage.setItem( 'appcartitems', JSON.stringify( this.items ) );
    // }
	 

    holdCount(d,i){
        console.log('press')
        this.timeoutHandler = setTimeout(() => {
          console.log("has been long pressed");
          this.timeoutHandler = null;
          console.log(this.selectedItems)
          console.log(this.page)
          console.log(i)
          var index:any = this.selectedItems.indexOf(d);
          console.log(index)

          if(index < 0){
             
            this.itemsList[i]['selected'] = true;

            this.selectedItems.push(d);
            this.cd.detectChanges();
          if(this.page == "Wishlist"){
            this.events.publish('wishListItems:selected', this.selectedItems);
        }
        else if(this.page == "Cart"){
            this.events.publish('cartItems:selected', this.selectedItems);
        }
            
          }
          else{

            this.itemsList[i]['selected'] = false;

            this.selectedItems.splice(index, 1);
            console.log(this.selectedItems)
            this.cd.detectChanges();

            if(this.page == "Wishlist"){
                this.events.publish('wishListItems:selected', this.selectedItems);
            }
            else if(this.page == "Cart"){
                this.events.publish('cartItems:selected', this.selectedItems);
            }
            
          }
         
        }, 1000);
      }

      
      openModel(item,i){
        console.log(item,i,'ggggggggggg');

        this.navCtrl.push(CartListViewPage,{data:item})
      }

}
