import { Component,Renderer ,ChangeDetectorRef} from '@angular/core';
import { IonicPage, NavController, Events,NavParams,ViewController,ModalController,LoadingController,AlertController,ToastController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common';
import { CusSearchPage } from '../modal/customer/customer';


/**
 * Generated class for the giftPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-gift',
  templateUrl: 'gift.html',
  providers:[CommonProvider]

})
export class GiftPage {

  details:any[] = [];
  chits:any[] = [];

  adderror = null;
  ferror:any = null;
  ani:any = false;

  fields:any[] = [{'slip_no':'','slip_amt':''}];
  idcus:any = this.navParams.get('id_customer');
  esti:any = this.navParams.get('esti');

  weightschemecaltype = this.navParams.get('settings')['weightschemecaltype'];
  weight_scheme_closure_type = this.navParams.get('settings')['weight_scheme_closure_type'];
  rate = this.navParams.get('rate');;

  va:any = '';
  mc:any = '';
  constructor(private events: Events,public cd:ChangeDetectorRef,public comman:CommonProvider,public event:Events,private toastCtrl: ToastController,private alertCtrl: AlertController,public load:LoadingController,public modal:ModalController,public navCtrl: NavController, public navParams: NavParams,public renderer: Renderer,public viewCtrl: ViewController) {
  console.log(this.details);


  this.fields = this.navParams.get('chit');
  
console.log(this.fields)
  }
 
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad giftPage');
  }
 

  submit(){
    console.log(this.fields);

   for (let index = 0; index < this.fields.length; index++) {
       if(this.fields[index]['slip_no'] == '' || this.fields[index]['slip_amt'] == '' ){
      this.ferror = false;
      break;
    }
    else{
      this.ferror = null;
    }
   }
  
    if( this.ferror != false){
     
      this.event.publish('gift',{'fields': this.fields,'idcus':this.idcus});
      this.navCtrl.pop();

      console.log('success')
    }
  
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
		   let  ii = this.chits.findIndex(data=>data['closing_amount'] == this.fields[i]['slip_amt']);
		   if(ii != -1){
			this.chits.splice(i,1);
		   }
		   this.fields.splice(i,1);

           this.ferror = null;      
           if(this.fields.length == 0){
            this.fields = [{'slip_no':'','slip_amt':''}];
          }
		  this.calculate_chit_closing_balance1();

         
     }
   }
   ]
 });
 alert.present();


}
addfield(i){
  if(this.fields[i]['slip_no'] != '' && this.fields[i]['slip_amt'] != ''){
    this.fields.push({'slip_no':'','slip_amt':''})
  }
  else{
    this.ferror = false;
  }

}
upper(data,i){
  if(this.idcus != ''){
    let loader = this.load.create( {
        content: "Uploading..."
      } );
      loader.present();
  this.fields[i]['slip_no']= data.toUpperCase();
  this.comman.getslip({'id_customer':this.idcus, 'slip_no' : this.fields[i]['slip_no']}).then(data=>{
    loader.dismiss();
    if(data['status']){
      this.fields[i]['slip_amt'] = data['result'].length > 0 ? data['result'][0]['closing_amount'] : '';
	  if(data['result'].length > 0){
		let  ii = this.chits.findIndex(data=>data['closing_amount'] == this.fields[i]['slip_amt']);

		if(this.fields.length == this.chits.length && ii == -1){

			this.chits.splice(i,1);
			this.chits.push(data['result'][0]);
			this.calculate_chit_closing_balance1();
			console.log(this.fields[i]['slip_amt'])
		}
		else if(this.fields.length == this.chits.length && ii != -1){

			this.calculate_chit_closing_balance1();
			console.log(this.fields[i]['slip_amt'])
		}
		else{

			this.chits.push(data['result'][0]);
			this.calculate_chit_closing_balance1();
			console.log(this.fields[i]['slip_amt'])
		}
	

	  }
    }
    else{

    let toastMsg = this.toastCtrl.create({
      message: data['msg'],
      duration: 1000,
      position: 'middle'
    });
    toastMsg.present();
  }

  },err=>{

    loader.dismiss();
  });
}else{

  let toastMsg = this.toastCtrl.create({
    message: 'Please Select Customer',
    duration: 1000,
    position: 'middle'
  });
  toastMsg.present();
  // this.fields[i]['slip_no'] = '';
  // this.cd.detectChanges();
  this.fields = [{'slip_no':'','slip_amt':''}];
  this.ani = true;
  this.cd.detectChanges();
  console.log(this.fields)
}
}
fvalid(i){
       
  if(this.fields[i]['slip_no'] == '' && this.fields[i]['slip_no'] == '' || this.fields[i]['slip_amt'] == '' ){
    this.ferror = false;
  }
  else{
    this.ferror = null;
  }
}
vacehck(){
	this.calculate_chit_closing_balance1()
}
mccehck(){
	this.calculate_chit_closing_balance1()

}
openEstiBasicDetailModal() {
 
  
  let modal = this.modal.create(CusSearchPage,{'show':'true'})
  modal.present();
  modal.onDidDismiss(mData => {
    console.log(mData)
    if(mData != null){
      this.idcus = mData['id_customer'];
    //   this.weightschemecaltype = mData['weightschemecaltype'];
    //   this.weight_scheme_closure_type = mData['weight_scheme_closure_type'];

      // this.empSelected();
    }else{
      
    }
  });
}
ionViewWillLeave(){
  this.events.publish( 'entered', false );						

  }
ionViewWillEnter(){

this.events.publish( 'entered', true );						
this.events.publish( 'pageno', 1 );	

}


calculate_chit_closing_balance()
{
   
	// var weight_scheme_closure_type = $('#weight_scheme_closure_type').val(); //1-General,2-Based on M.C & V.A
	// var weightschemecaltype = $('#weightschemecaltype').val(); //1->Based On Manual Va & MC  2->Based on the Highest Va & MC 3->Based On the Lowest Va & MC
	
  // if(this.weightschemecaltype==1)
	// {   
	//     $('#wastage_per').attr('readonly', false);
	//     $('#mc_value').attr('readonly', false);
	// }else{
	//     $('#wastage_per').attr('readonly', true);
	//     $('#mc_value').attr('readonly', true);
	//     $('#wastage_per').val("");
	//     $('#mc_value').attr("");
	// }

  //   $('#estimation_chit_details > tbody  > tr').each(function(index, tr) {
  //       var curRow                          = $(this).closest("tr");
  //       var chit_amount=0;
	//     var saving_weight = 0;
  //       var additional_benefits             = curRow.find('.additional_benefits').val();
  //       var closing_add_chgs                = curRow.find('.closing_add_chgs').val();
  //       var paid_installments               = curRow.find('.paid_installments').val();
  //       var total_installments              = curRow.find('.total_installments').val();
  //       var is_wast_and_mc_benefit_apply    = curRow.find('.is_wast_and_mc_benefit_apply').val();
  //       var goldrate_22ct                   = (isNaN($('.goldrate_22ct').html()) || $('.goldrate_22ct').html() == '')  ? 0 : parseFloat($('.goldrate_22ct').html());
  //       var saving_weight                   = (curRow.find('.closing_weight').val()!='' ? curRow.find('.closing_weight').val():0);
	
	// 	     var sales_details = [];
  //           $('#estimation_tag_details > tbody tr').each(function(bidx, brow){ 
	// 	        tagcurRow = $(this);
	// 	        if(tagcurRow.find('.scheme_closure_benefit').val()==1)
	// 	        {
	// 	            sales_details.push({'wastage_per':tagcurRow.find('.wastage_max_per').val(),'mc_value':(tagcurRow.find('.id_mc_type').val()==1 ? tagcurRow.find('.act_mc_value').val() :parseFloat(parseFloat(tagcurRow.find('.act_mc_value').val())*parseFloat(tagcurRow.find('.gwt').val())).toFixed(2)),'item_gross_wt':tagcurRow.find('.gwt').val()});
	// 	        }
	// 	    });
	// 	    $('#estimation_catalog_details > tbody tr').each(function(bidx, brow){ 
  //           	NontagcurRow = $(this);
  //           	if(NontagcurRow.find('.scheme_closure_benefit').val()==1)
  //           	{
  //                   sales_details.push({'wastage_per':NontagcurRow.find('.cat_wastage').val(),'mc_value':(NontagcurRow.find('.mc_type').val()==1 ? NontagcurRow.find('.cat_mc').val() :parseFloat(parseFloat(NontagcurRow.find('.cat_mc').val())*parseFloat(NontagcurRow.find('.cat_gwt').val())).toFixed(2)),'item_gross_wt':NontagcurRow.find('.cat_gwt').val()});
  //           	}
  //           });
	// 	    $('#estimation_custom_details > tbody tr').each(function(bidx, brow){ 
	// 	        homebillcurRow = $(this);
	// 	        if(homebillcurRow.find('.scheme_closure_benefit').val()==1)
	// 	        {
	// 	            sales_details.push({'wastage_per':homebillcurRow.find('.cus_wastage').val(),'mc_value':(homebillcurRow.find('.id_mc_type').val()==1 ? homebillcurRow.find('.cus_mc').val() :parseFloat(parseFloat(homebillcurRow.find('.cus_mc').val())*parseFloat(homebillcurRow.find('.cus_gwt').val())).toFixed(2)),'item_gross_wt':homebillcurRow.find('.cus_gwt').val()});
	// 	        }
	// 	    });
  //           console.log(sales_details);
		            
	// 	    if(weight_scheme_closure_type==2 && saving_weight > 0 && (paid_installments==total_installments) && (sales_details.length > 0) )
	// 	    {       
	// 	            var savings_in_wast_amt = 0;
	// 	            var savings_in_wast_wt = 0;
	// 	            var savings_in_mcvalue = 0;
	// 	            var wastage_wt = 0;
		            
		            
		           
	// 	            var wastage_per = 0;
	// 	            var mc_value = 0;                
	// 	            var item_gross_wt = 0;
		            
		            
	// 	             if(weightschemecaltype == 2)// Taking Highest V.A & M.C 
	// 	             {
	// 	                 if($('#wastage_per').val()=='')
	// 	                 {
	// 	                     wastage_per = Math.max.apply(null, sales_details.map(item => item.wastage_per));
	// 	                 }
	// 	                 else
	// 	                 {
	// 	                     wastage_per = ($('#wastage_per').val()!='' ? $('#wastage_per').val():0);
	// 	                 }
	// 	                 if($('#mc_value').val()=='')
	// 	                 {
		                     
	// 	                     $.each(sales_details,function(key,val){
  //   			                if(parseFloat(val.mc_value) > parseFloat(mc_value))
  //   			                {
  //   			                    console.log(val.mc_value);
  //   			                    mc_value = val.mc_value;
  //   			                    item_gross_wt = val.item_gross_wt;
  //   			                }
    			                
  //   			            });
    			            
    			           
	// 	                 }
	// 	                 else
	// 	                 {
	// 	                     mc_value    = ($('#mc_value').val()!='' ?$('#mc_value').val() :0);
		                     
	// 	                 }
		                 
	// 	             }
	// 	             else if(weightschemecaltype == 3)//Taking Lowest V.A & M.C 
	// 	             {
	// 	                 if($('#wastage_per').val()=='')
	// 	                 {
	// 	                     wastage_per = Math.min.apply(null, sales_details.map(item => item.wastage_per));
	// 	                 }
	// 	                 else
	// 	                 {
	// 	                     wastage_per = ($('#wastage_per').val()!='' ? $('#wastage_per').val():0);
	// 	                 }
	// 	                 if($('#mc_value').val()=='')
	// 	                 {
	// 	                     $.each(sales_details,function(key,val){
  //   			                if(val.mc_value < mc_value)
  //   			                {
  //   			                    mc_value = val.mc_value;
  //   			                    item_gross_wt = val.item_gross_wt;
  //   			                }
  //   			            });
	// 	                 }
	// 	                 else
	// 	                 {
	// 	                     mc_value    = ($('#mc_value').val()!='' ?$('#mc_value').val() :0);
	// 	                 }
		                 
	// 	             }
	// 	             else{
	// 	                 wastage_per = ( $('#wastage_per').val()!='' ?  $('#wastage_per').val():0);
	// 	                 mc_value = ( $('#mc_value').val()!='' ?  $('#mc_value').val():0);
	// 	             }
		             
	// 	             var total_sales_wt = 0;
	// 	             var total_mc_value = 0;
	//                  $.each(sales_details,function(key,val){
	//                      total_sales_wt+=parseFloat(val.item_gross_wt);
	//                      total_mc_value+=parseFloat(val.mc_value);
	//                  });

                   
	// 	             if(wastage_per > 0)
	// 	             {
	// 	                 if(parseFloat(total_sales_wt) > parseFloat(saving_weight))
	// 	                 {
	// 	                     var wastage_wt = parseFloat(((parseFloat(saving_weight)*parseFloat(wastage_per))/100)).toFixed(3);
	// 	                     var savings_in_wast_wt = parseFloat(parseFloat(wastage_wt)+parseFloat(saving_weight)).toFixed(3);
	// 	                 }else{
	// 	                     var wastage_wt = parseFloat(((parseFloat(total_sales_wt)*parseFloat(wastage_per))/100));
	// 	                     var savings_in_wast_wt = parseFloat(((parseFloat(total_sales_wt)*parseFloat(wastage_per))/100)+parseFloat(saving_weight)).toFixed(3);
	// 	                 }
		                 
	// 	             }
	// 	             else
	// 	             {
	// 	                 var savings_in_wast_wt = parseFloat(saving_weight).toFixed(3);
	// 	             }
		             
	// 	             console.log(mc_value);
	// 	             console.log(savings_in_wast_wt);
	// 	             console.log(item_gross_wt);
		             
	// 	             if(mc_value > 0 && item_gross_wt > 0)
  //                    {
  //                        if(parseFloat(total_sales_wt) > parseFloat(saving_weight))
  //                        {
  //                            var savings_in_mcvalue = parseFloat((parseFloat(mc_value)/parseFloat(item_gross_wt))*parseFloat(saving_weight)).toFixed(2);
  //                        }else{
  //                            var savings_in_mcvalue = parseFloat(total_mc_value).toFixed(2);
  //                        }
                         
  //                    }
  //                    else if(mc_value!='')
  //                    {
  //                        savings_in_mcvalue = mc_value;
  //                    }
  //                    else
  //                    {
  //                        var savings_in_mcvalue = 0;
  //                    }
		             
	// 	             savings_in_wast_amt = parseFloat(parseFloat(savings_in_wast_wt)*parseFloat(goldrate_22ct)).toFixed(2);
		             
		             
	// 	             var amount = parseFloat(savings_in_wast_amt)+parseFloat(savings_in_mcvalue)-parseFloat(closing_add_chgs)+parseFloat(additional_benefits);
	// 	             console.log(savings_in_wast_amt);
	// 	             if(amount > 0)
	// 	             {
	// 	                 chit_amount = amount;
	// 	             }else
	// 	             {
	// 	                 chit_amount = curRow.find('.closing_amount').val();
	// 	             }
	// 	             curRow.find('.wastage_per').val(parseFloat(wastage_per).toFixed(2));
	// 	             curRow.find('.savings_in_wastage').val(parseFloat(parseFloat(wastage_wt)).toFixed(3));
	// 	             curRow.find('.mc_value').val(parseFloat(mc_value).toFixed(2));
	// 	             curRow.find('.savings_in_mcvalue').val(parseFloat(savings_in_mcvalue).toFixed(2));
	// 	             curRow.find('.closing_weight').val(parseFloat(saving_weight).toFixed(3));
	// 	             curRow.find('.saved_weight').html(parseFloat(saving_weight).toFixed(3));
	// 	             $('.applied_wast_per').html(parseFloat(wastage_per).toFixed(2));
	// 	             $('.applied_mc').html(parseFloat(mc_value).toFixed(2));
	// 	    }else
	// 	    {
	// 	         curRow.find('.saved_weight').html(parseFloat(saving_weight).toFixed(3));
	// 	         chit_amount = curRow.find('.closing_amount').val();
	// 	    }
		    
	// 	curRow.find('.chit_amt').val(parseFloat(Math.round(chit_amount)).toFixed(2));			
  //   });
  //   calculate_purchase_details();
	// calculate_sales_details();
}


calculate_chit_closing_balance1()
{
   

this.chits.forEach((element,i) => {
  
	if(element.scheme_type!=0 &&(element.paid_installments==element.total_installments))

	{
		element['closing_weight'] = element.closing_balance;
	
	}
	console.log(element['closing_weight']);

        var chit_amount:any=0;
	    var saving_weight:any = 0;
        var additional_benefits:any             = element.additional_benefits;
        var closing_add_chgs:any                = element.closing_add_chgs;
        var paid_installments:any               = element.paid_installments;
        var total_installments:any              = element.total_installments;
        var is_wast_and_mc_benefit_apply:any    = element.is_wast_and_mc_benefit_apply;
        var goldrate_22ct:any                   =  parseFloat(this.rate);
        var saving_weight:any                   = (element.closing_weight!='' ? element.closing_weight:0);
	
		     var sales_details:any = [];
			 console.log(this.esti['tag']);
			 console.log(this.weight_scheme_closure_type);
			 console.log(this.weightschemecaltype);


         this.esti['tag'].forEach(element => {
          
		        if(element.scheme_closure_benefit==1)
		        {
		            sales_details.push({'wastage_per':element.retail_max_wastage_percent,'mc_value':(element.mc_type==1 ? element.mc_value :parseFloat((parseFloat(element.mc_value)*parseFloat(element.gross_wt)).toFixed(2))),'item_gross_wt':element.gross_wt});
		        }
		    });
        this.esti['non_tag'].forEach(element => {
            	if(element.scheme_closure_benefit==1)
            	{
                    sales_details.push({'wastage_per':element.retail_max_wastage_percent,'mc_value':(element.mc_type==1 ? element.mc_value :parseFloat((parseFloat(element.mc_value)*parseFloat(element.gross_wt)).toFixed(2))),'item_gross_wt':element.gross_wt});
            	}
            });
            this.esti['home_bill'].forEach(element => {
		        if(element.scheme_closure_benefit==1)
		        {
		            sales_details.push({'wastage_per':element.retail_max_wastage_percent,'mc_value':(element.mc_type==1 ? element.mc_value :parseFloat((parseFloat(element.mc_value)*parseFloat(element.gross_wt)).toFixed(2))),'item_gross_wt':element.gross_wt});
		        }
		    });
            console.log(sales_details);
		            
		    if(this.weight_scheme_closure_type==2 && saving_weight > 0 && (paid_installments==total_installments) && (sales_details.length > 0) )
		    {       
				console.log('1111');

		            var savings_in_wast_amt:any = 0;
		            var savings_in_wast_wt:any = 0;
		            var savings_in_mcvalue:any = 0;
		            var wastage_wt:any = 0;
		            
		            
		           
		            var wastage_per:any = 0;
		            var mc_value:any = 0;                
		            var item_gross_wt:any = 0;
		            
		            
		             if(this.weightschemecaltype == 2)// Taking Highest V.A & M.C 
		             {
		                 if(this.va=='')
		                 {
		                     wastage_per = Math.max.apply(null, sales_details.map(item => item.wastage_per));
		                 }
		                 else
		                 {
		                     wastage_per = (this.va!='' ? this.va:0);
		                 }
		                 if(this.mc=='')
		                 {
                      sales_details.forEach((key,val) => {
                        if(parseFloat(key.mc_value) > parseFloat(mc_value))
                        {
                            console.log(key.mc_value);
                            mc_value = key.mc_value;
                            item_gross_wt = key.item_gross_wt;
                        }
                         });
		                    
    			            
    			           
		                 }
		                 else
		                 {
		                     mc_value    = (this.mc!='' ?this.mc :0);
		                     
		                 }
		                 
		             }
		             else if(this.weightschemecaltype == 3)//Taking Lowest V.A & M.C 
		             {
		                 if(this.va=='')
		                 {
		                     wastage_per = Math.min.apply(null, sales_details.map(item => item.wastage_per));
		                 }
		                 else
		                 {
		                     wastage_per = (this.va!='' ? this.va:0);
		                 }
		                 if(this.mc=='')
		                 {
                      sales_details.forEach((key,val) => {
                        if(key.mc_value < mc_value)
    			                {
    			                    mc_value = key.mc_value;
    			                    item_gross_wt = key.item_gross_wt;
    			                }
    			            });
		                 }
		                 else
		                 {
		                     mc_value    = (this.mc!='' ?this.mc :0);
		                 }
		                 
		             }
		             else{
		                 wastage_per = ( this.va!='' ?  this.va:0);
		                 mc_value = ( this.mc!='' ?  this.mc:0);
		             }
		             
		             var total_sales_wt:any = 0;
		             var total_mc_value:any = 0;
                 sales_details.forEach((key,val) => {
					console.log(parseFloat(key.item_gross_wt))
                  total_sales_wt=total_sales_wt+parseFloat(key.item_gross_wt);
	                     total_mc_value=total_sales_wt+parseFloat(key.mc_value);
	                 });

                   console.log(total_sales_wt)
				   console.log(total_mc_value)

		             if(wastage_per > 0)
		             {
		                 if(parseFloat(total_sales_wt) > parseFloat(saving_weight))
		                 {
		                     var wastage_wt:any = parseFloat((((parseFloat(saving_weight)*parseFloat(wastage_per))/100)).toFixed(3));
		                     var savings_in_wast_wt:any = parseFloat((parseFloat(wastage_wt)+parseFloat(saving_weight)).toFixed(3));
		                 }else{
		                    //  var wastage_w:any = parseFloat(((parseFloat(total_sales_wt)*parseFloat(wastage_per))/100));
		                     var savings_in_wast_wt:any = parseFloat((((parseFloat(total_sales_wt)*parseFloat(wastage_per))/100)+parseFloat(saving_weight)).toFixed(3));
		                 }
		                 
		             }
		             else
		             {
		                 var savings_in_wast_wt :any= parseFloat(saving_weight).toFixed(3);
		             }
		             
		             console.log(mc_value);
		             console.log(savings_in_wast_wt);
		             console.log(item_gross_wt);
					 console.log(wastage_per);
		             console.log(mc_value);
		             
		             if(mc_value > 0 && item_gross_wt > 0)
                     {
                         if(parseFloat(total_sales_wt) > parseFloat(saving_weight))
                         {
                             var savings_in_mcvalue:any = parseFloat(((parseFloat(mc_value)/parseFloat(item_gross_wt))*parseFloat(saving_weight)).toFixed(2));
                         }else{
                             var savings_in_mcvalue:any = parseFloat(total_mc_value).toFixed(2);
                         }
                         
                     }
                     else if(mc_value!='')
                     {
						console.log('123');

                         savings_in_mcvalue = mc_value;
                     }
                     else
                     {
						console.log('321');

                         var savings_in_mcvalue:any = 0;
                     }
		             
		             savings_in_wast_amt = parseFloat((parseFloat(savings_in_wast_wt)*parseFloat(goldrate_22ct)).toFixed(2));
		             
					 console.log('123');

		             var amount = parseFloat(savings_in_wast_amt)+parseFloat(savings_in_mcvalue)-parseFloat(closing_add_chgs)+parseFloat(additional_benefits);
		             console.log(savings_in_wast_amt);
					 console.log(amount);

		             if(amount > 0)
		             {
		                 chit_amount = amount;
						 this.fields[i]['slip_amt'] = Math.round(chit_amount);

		             }else
		             {
						console.log('total2')
						this.fields[i]['slip_amt'] = element['closing_amount'];

		             }
		        
		    }else
		    {
				this.fields[i]['slip_amt'] = element['closing_amount'];

				console.log('total')
				console.log(this.fields[i]['slip_amt'] )

		    }
		    
    });
	console.log(this.fields)

}
}
