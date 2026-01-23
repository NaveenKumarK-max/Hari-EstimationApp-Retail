import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { CommonProvider, BaseAPIURL } from '../providers/common';
import { ModalController, IonicPage, Content, Events, NavController, NavParams, LoadingController, ToastController, Platform, ActionSheetController, Loading, AlertController } from 'ionic-angular';

@Injectable()
export class RetailProvider {
    tax_details: any;
    constructor(private event: Events, private http: Http, private commonService: CommonProvider) {



    }

    // Item Sale Value calculation - Common for all Pages
    setAsNumber(data) {
        if (typeof data != 'undefined' && data) {
            return Number(data);
        } else {
            return 0;
        }
    }

    calculate_base_value_tax(taxcallrate, taxgroup) {
        var totaltax = 0;
        this.tax_details.forEach(taxitem => {
            if (taxitem.tgi_tgrpcode == taxgroup) {
                if (taxitem.tgi_calculation == 1) {
                    if (taxitem.tgi_type == 1) {
                        totaltax += (taxcallrate) * ((taxitem.tax_percentage) / 100);
                    } else {
                        totaltax -= (taxcallrate) * ((taxitem.tax_percentage) / 100);
                    }
                }
            }
        });
        return totaltax;
    }

    calculate_arrived_value_tax(taxcallrate, taxgroup) {
        var totaltax = 0;
        this.tax_details.forEach(taxitem => {
            if (taxitem.tgi_tgrpcode == taxgroup) {
                if (taxitem.tgi_calculation == 2) {
                    if (taxitem.tgi_type == 1) {
                        totaltax += (taxcallrate) * ((taxitem.tax_percentage) / 100);
                    } else {
                        totaltax -= (taxcallrate) * ((taxitem.tax_percentage) / 100);
                    }
                }
            }
        });
        return totaltax;
    }
    public calculateSaleValueBasedMc(data) {
        var itemData = data.itemData;
        var metalRates = data.metalRate;
        this.tax_details = data.tax_details;
        console.log(data);
        var arrived_value_tax = 0;
        var base_value_amt = 0;
        var arrived_value_amt = 0;

        var market_arrived_value_tax = 0;
        var market_base_value_amt = 0;
        var market_arrived_value_amt = 0;
        var gross_wt = this.setAsNumber(itemData.gross_wt);
        var less_wt = this.setAsNumber(itemData.less_wt);
        var net_wt = this.setAsNumber(itemData.net_wt);
        var piece = this.setAsNumber(itemData.piece);
        var tax_group = this.setAsNumber(itemData.tax_group_id);
        var metal_type = this.setAsNumber(itemData.metal_type);
        var calculation_type = this.setAsNumber(itemData.calculation_based_on);
        var mc_type = this.setAsNumber(itemData.mc_type);
        var mc_value = this.setAsNumber(itemData.mc_value);
        var tot_wastage = this.setAsNumber(itemData.retail_max_wastage_percent);
        var stone_price = this.setAsNumber(itemData.stone_price);
        var other_metal_total_price = this.setAsNumber(itemData.other_metal_total_price);
        var certification_price = this.setAsNumber(itemData.certification_cost);
        var ratePerG = this.setAsNumber(metalRates[itemData.metal_type]);
        var marketRatePerG = this.setAsNumber(metalRates[itemData.market_metal_type]);
        var item_rate = this.setAsNumber(itemData.item_rate);
        var sales_value = this.setAsNumber(itemData.sales_value);
        var charges = this.setAsNumber(itemData.charge_value);
        var finalmaking_charge = this.setAsNumber(itemData.making_charge);

        /**
        *	Amount calculation based on settings (without discount and tax )
        *   0 - Wastage on Gross weight And MC on Gross weight
        *   1 - Wastage on Net weight And MC on Net weight
        *   2 - Wastage On Netwt And MC On Grwt
        *   taxable = Metal Rate + Stone + OM + Wastage + MC
        */
        if (calculation_type == 0) {
            var wast_wgt = parseFloat(((gross_wt) * (tot_wastage / 100)).toFixed(5));
            if (mc_type != 3) {
                var making_charge = finalmaking_charge;
                // Metal Rate + Stone + OM + Wastage + MC
                mc_value = parseFloat((mc_type == 2 ? (making_charge / gross_wt) : ((mc_type) == 1 ? (mc_value / piece) : 0)).toFixed(2));
                console.log(mc_value);

                var taxable = ((ratePerG * ((wast_wgt) + (net_wt))) + (making_charge) + (stone_price) + (other_metal_total_price) + (certification_price) + (charges));
                var market_taxable = ((marketRatePerG * ((wast_wgt) + (net_wt))) + (making_charge) + (stone_price) + (certification_price) + (charges));
            } else {
                var making_charge = finalmaking_charge;
                var taxable = ((ratePerG * ((wast_wgt) + (net_wt))) + (making_charge) + (stone_price) + (other_metal_total_price) + (certification_price) + (charges));
                var market_taxable = ((marketRatePerG * ((wast_wgt) + (net_wt))) + (making_charge) + (stone_price) + (certification_price) + (charges));

            }

        }
        else if (calculation_type == 1) {
            var wast_wgt = parseFloat(((net_wt) * (tot_wastage / 100)).toFixed(5));
            if (mc_type != 3) {
                var making_charge = finalmaking_charge;
                // Metal Rate + Stone + OM + Wastage + MC
                mc_value = parseFloat((mc_type == 2 ? (making_charge / net_wt) : ((mc_type) == 1 ? (mc_value / piece) : 0)).toFixed(2));
                console.log(mc_value);

                var taxable = parseFloat(((ratePerG * ((wast_wgt) + (net_wt))) + (making_charge) + (stone_price) + (other_metal_total_price) + (certification_price) + (charges)).toFixed(2));
                var market_taxable = parseFloat(((marketRatePerG * ((wast_wgt) + (net_wt))) + (making_charge) + (stone_price) + (certification_price) + (charges)).toFixed(2));
            } else {
                var making_charge = finalmaking_charge;
                // Metal Rate + Stone + OM + Wastage + MC
                console.log(ratePerG);
                console.log(wast_wgt);
                console.log(net_wt);
                console.log(making_charge);
                console.log(stone_price);
                console.log(other_metal_total_price);
                console.log(certification_price);
                console.log(charges);

                var taxable = parseFloat(((ratePerG * ((wast_wgt) + (net_wt))) + (making_charge) + (stone_price) + (other_metal_total_price) + (certification_price) + (charges)).toFixed(2));
                var market_taxable = parseFloat(((marketRatePerG * ((wast_wgt) + (net_wt))) + (making_charge) + (stone_price) + (certification_price) + (charges)).toFixed(2));

            }

        }
        else if (calculation_type == 2) {
            var wast_wgt = parseFloat(((net_wt) * (tot_wastage / 100)).toFixed(5));
            if (mc_type != 3) {
                var making_charge = finalmaking_charge;
                console.log(making_charge);
                console.log(mc_value);
                console.log(piece);

                mc_value = parseFloat((mc_type == 2 ? (making_charge / gross_wt) : ((mc_type) == 1 ? (mc_value / piece) : 0)).toFixed(2));
                console.log(mc_value);

                // Metal Rate + Stone + OM + Wastage + MC
                var taxable = parseFloat(((((ratePerG) * ((wast_wgt) + (net_wt))) + (making_charge)) + (stone_price) + (other_metal_total_price) + (certification_price) + (charges)).toFixed(2));
                var market_taxable = parseFloat(((((marketRatePerG) * ((wast_wgt) + (net_wt))) + (making_charge)) + (stone_price) + (other_metal_total_price) + (certification_price) + (charges)).toFixed(2));
            } else {
                console.log(making_charge)

                var making_charge = finalmaking_charge;
                // Metal Rate + Stone + OM + Wastage + MC
                var taxable = parseFloat(((((ratePerG) * ((wast_wgt) + (net_wt))) + (making_charge)) + (stone_price) + (other_metal_total_price) + (certification_price) + (charges)).toFixed(2));
                var market_taxable = parseFloat(((((marketRatePerG) * ((wast_wgt) + (net_wt))) + (making_charge)) + (stone_price) + (other_metal_total_price) + (certification_price) + (charges)).toFixed(2));

            }
        }
        else if (calculation_type == 3) {
            var wast_wgt = 0;
            var taxable = (sales_value ? sales_value : 0);
            var market_taxable = (sales_value ? sales_value : 0);
        }
        // else if (calculation_type == 4) {
        //     var wast_wgt = 0;
        //     var taxable = (item_rate ? item_rate : 0);
        //     var market_taxable = (item_rate ? item_rate : 0);
        // }
                else if (calculation_type == 4) {
            var wast_wgt = 0;
            var taxable = item_rate * gross_wt;
            var market_taxable = taxable + charges;
        }

        // if(calculation_type != 3){ 
        if (this.tax_details) {
            // Tax Calculation
            var base_value_tax = (this.calculate_base_value_tax(taxable, tax_group));
            var base_value_amt = ((taxable) + (base_value_tax));
            var arrived_value_tax = (this.calculate_arrived_value_tax(base_value_amt, tax_group));
            var arrived_value_amt = ((base_value_amt) + (arrived_value_tax));
            var total_tax_rate = parseFloat((base_value_tax + arrived_value_tax).toFixed(2));
            var market_base_value_tax = (this.calculate_base_value_tax(market_taxable, tax_group));
            var market_base_value_amt = ((market_taxable) + (base_value_tax));
            var market_arrived_value_tax = (this.calculate_arrived_value_tax(base_value_amt, tax_group));
            var market_arrived_value_amt = ((base_value_amt) + (arrived_value_tax));
            var market_total_tax_rate = parseFloat((base_value_tax + arrived_value_tax).toFixed(2));
            // }else{
            //     var total_tax_rate	= 0;
            //     var market_total_tax_rate	= 0;
            // }
            var total_price = (taxable + total_tax_rate);
            var market_total_price = (market_taxable + market_total_tax_rate);
        } else {
            var total_price = sales_value;
            var market_total_price = sales_value;
        }
        // Set Calculated Value
        itemData["mc_value"] = mc_value;
        itemData["making_charge"] = making_charge;
        itemData["wast_wgt"] = wast_wgt;
        itemData["taxable"] = taxable;
        itemData["sales_value"] = total_price.toFixed(2);
        itemData["market_tax_price"] = market_total_tax_rate;
        itemData["market_sales_value"] = market_total_price;
        itemData["tax_price"] = total_tax_rate;
        itemData["gross_wt"] = itemData.gross_wt;
        itemData["less_wt"] = itemData.less_wt;
        itemData["net_wt"] = itemData.net_wt;
        if (data.item_type == 'tag') {
            itemData["is_partial"] = itemData.is_partial;
        }
        if (data.item_type == 'non_tag') {
            itemData["design"] = itemData.design;
        }
        console.log(itemData);
        return itemData;
    }
    //   public calculateSaleValue(data){
    //     var itemData = data.itemData ;
    //     var metalRates = data.metalRate;
    //     this.tax_details = data.tax_details;
    //     console.log(data); 
    //     var arrived_value_tax = 0;
    //     var base_value_amt=0;
    //     var arrived_value_amt=0;

    //     var market_arrived_value_tax = 0;
    //     var market_base_value_amt=0;
    //     var market_arrived_value_amt=0;
    //     var gross_wt  = this.setAsNumber(itemData.gross_wt) ;
    //     var less_wt   = this.setAsNumber(itemData.less_wt) ;
    //     var other_metal_total_wt =  this.setAsNumber(itemData.other_metal_total_wt)
    //     console.log(gross_wt,less_wt,other_metal_total_wt,'333333333333333333333');

    //     //var net_wt    = this.setAsNumber(itemData.net_wt) ;
    //     // var piece     = this.setAsNumber(itemData.piece) ;
    //     var net_wt = this.setAsNumber(gross_wt-less_wt-other_metal_total_wt);
    //     console.log('1111111111',net_wt);

    //     var piece     = 1;

    //     var tax_group = this.setAsNumber(itemData.tax_group_id) ;
    //     var metal_type= this.setAsNumber(itemData.metal_type) ;
    //     var calculation_type = this.setAsNumber(itemData.calculation_based_on) ;
    //     var mc_type       = this.setAsNumber(itemData.mc_type);
    //     var mc_value      = this.setAsNumber(itemData.mc_value);
    //     var tot_wastage   = this.setAsNumber(itemData.retail_max_wastage_percent);
    //     var stone_price   = this.setAsNumber(itemData.stone_price);
    //     var certification_price = this.setAsNumber(itemData.certification_cost);
    //     console.log(121231313213,itemData['metalratec'] == 'true')

    //     var ratePerG      = itemData['metalratec'] == 'true' ? itemData.rate_per :  this.setAsNumber(metalRates[itemData.metal_type]);
    //     var marketRatePerG= this.setAsNumber(metalRates[itemData.market_metal_type]);
    //     var item_rate     = this.setAsNumber(itemData.item_rate);
    //     var sales_value     = this.setAsNumber(itemData.sales_value);
    //     var charges     = this.setAsNumber(itemData.charge_value);
    //     var othercharges     = this.setAsNumber(itemData.othermetal_charges);
    //     var othermetalprice = this.setAsNumber(itemData.other_metal_total_price);

    // console.log(sales_value ,charges);

    //     var advance     = this.setAsNumber(itemData['advance']);

    //     /**
    //     *	Amount calculation based on settings (without discount and tax )
    //     *   0 - Wastage on Gross weight And MC on Gross weight
    //     *   1 - Wastage on Net weight And MC on Net weight
    //     *   2 - Wastage On Netwt And MC On Grwt
    //     *   taxable = Metal Rate + Stone + OM + Wastage + MC
    //     */
    //     if(calculation_type == 0){
    //       var wast_wgt = parseFloat( ((gross_wt) * (tot_wastage/100)).toFixed(3) ); 
    //       if(mc_type != 3){ 
    //       var making_charge =  (mc_type == 2 ? (mc_value * gross_wt ) : ((mc_type) == 1 ? (mc_value * piece) : 0));
    //       // Metal Rate + Stone + OM + Wastage + MC
    //       var taxable = ((ratePerG * ((wast_wgt) + (net_wt))) + (making_charge) +(stone_price)+(certification_price)+(charges) + (othercharges));
    //       var market_taxable = ((marketRatePerG * ((wast_wgt) + (net_wt))) + (making_charge) +(stone_price)+(certification_price)+(charges)+ (othercharges));
    //     }else{
    //         var making_charge = (ratePerG * ((wast_wgt) + (net_wt)) * (mc_value/100));
    //         var taxable = ((ratePerG * ((wast_wgt) + (net_wt))) + (making_charge) +(stone_price)+(certification_price)+(charges)+ (othercharges));
    //       var market_taxable = ((marketRatePerG * ((wast_wgt) + (net_wt))) + (making_charge) +(stone_price)+(certification_price)+(charges)+ (othercharges));

    //     }

    //     }
    //     else if(calculation_type == 1){
    //       var wast_wgt = parseFloat( ((net_wt) * (tot_wastage/100)).toFixed(3) ); 
    //       if(mc_type != 3){ 
    //       var making_charge       = parseFloat( (mc_type == 2 ? (mc_value * net_wt ) : ((mc_type) == 1 ? (mc_value * piece) : 0)).toFixed(2) );
    //       // Metal Rate + Stone + OM + Wastage + MC
    //       var taxable =  parseFloat(((ratePerG * ((wast_wgt) + (net_wt))) + (making_charge) +(stone_price)+(certification_price)+(charges)+ (othercharges)).toFixed(2) );
    //       console.log(ratePerG)
    //       console.log(wast_wgt)
    //       console.log(net_wt)

    //       console.log(making_charge)
    //       console.log(stone_price)
    //       console.log(certification_price)
    //       console.log(charges)
    //       console.log(othercharges)


    //       console.log(taxable)

    //       var market_taxable = parseFloat( ((marketRatePerG * ((wast_wgt) + (net_wt))) + (making_charge) +(stone_price)+(certification_price)+(charges)+ (othercharges)).toFixed(2) );
    //       }else{
    //         var making_charge       = ((ratePerG * ((wast_wgt) + (net_wt))) * (mc_value/100));
    //         // Metal Rate + Stone + OM + Wastage + MC
    //         var taxable =  parseFloat(((ratePerG * ((wast_wgt) + (net_wt))) + (making_charge) +(stone_price)+(certification_price)+(charges)+ (othercharges)).toFixed(2) );
    //         var market_taxable = parseFloat( ((marketRatePerG * ((wast_wgt) + (net_wt))) + (making_charge) +(stone_price)+(certification_price)+(charges)+ (othercharges)).toFixed(2) );

    //       }

    //     }
    //     else if(calculation_type == 2){ 
    //       var wast_wgt = parseFloat( ((net_wt) * (tot_wastage/100)).toFixed(3) ); 
    //       if(mc_type != 3){ 
    //       var making_charge = parseFloat( (mc_type == 2 ? (mc_value * gross_wt ) : ((mc_type) == 1 ? (mc_value * piece) : 0)).toFixed(2) ); 
    //       console.log(making_charge);
    //       console.log(mc_value);
    //       console.log(piece);
    //       console.log(ratePerG);
    //       console.log(wast_wgt);
    //       console.log(net_wt);
    //       // Metal Rate + Stone + OM + Wastage + MC
    //       var taxable = parseFloat( ((((ratePerG) * ((wast_wgt) + (net_wt)))+ (making_charge) )+(stone_price)+(certification_price)+(charges)+ (othercharges)).toFixed(2) );
    //       var market_taxable =   parseFloat( ((((marketRatePerG) * ((wast_wgt) + (net_wt)))+ (making_charge) )+(stone_price)+(certification_price)+(charges)+ (othercharges)).toFixed(2) );
    //       }else{
    //         console.log(making_charge)

    //         var making_charge =  (((ratePerG) * ((wast_wgt) + (net_wt))) * (mc_value/100));
    //         // Metal Rate + Stone + OM + Wastage + MC
    //         var taxable = parseFloat( ((((ratePerG) * ((wast_wgt) + (net_wt)))+ (making_charge) )+(stone_price)+(certification_price)+(charges)+ (othercharges)).toFixed(2) );
    //         var market_taxable =   parseFloat( ((((marketRatePerG) * ((wast_wgt) + (net_wt)))+ (making_charge) )+(stone_price)+(certification_price)+(charges)+ (othercharges)).toFixed(2) );

    //       }
    //     }
    //     else if(calculation_type == 3){
    //         var wast_wgt = 0;
    //         console.log(charges)
    //         var taxable  = (sales_value  ? sales_value + (charges)+ (othercharges) : 0);
    //         var market_taxable  = (sales_value  ? sales_value +(charges)+ (othercharges) : 0);
    //     }
    //     // else if(calculation_type == 4){
    //     //   var wast_wgt = 0;
    //     //   var taxable  = (item_rate  ? item_rate : 0);
    //     //   var market_taxable  = (item_rate  ? item_rate : 0);
    //     // }
    //     else if(calculation_type == 4){
    //       var wast_wgt = 0;
    //       console.log(charges)
    //       var taxable  = (sales_value  ? sales_value + (charges)+ (othercharges) : 0);

    //       taxable = taxable * gross_wt;

    //       var market_taxable  = (sales_value  ? sales_value +(charges)+ (othercharges) : 0);

    //       market_taxable = market_taxable * gross_wt;

    //   }
    //   taxable =  parseFloat((taxable + othermetalprice).toFixed(2))
    //   console.log(taxable);

    // 	if((calculation_type != 3 && calculation_type != 4 ) || ((calculation_type == 3 && itemData.tax_type == 2 ) || (calculation_type == 4 && itemData.tax_type == 2) ) ){ 
    //         if(this.tax_details){
    //         // Tax Calculation
    //         var base_value_tax	= (this.calculate_base_value_tax(taxable,tax_group));
    //         console.log(base_value_tax)
    //         var base_value_amt	= ((taxable)+(base_value_tax));
    //         var arrived_value_tax = (this.calculate_arrived_value_tax(base_value_amt,tax_group));
    //         console.log(arrived_value_tax)

    //         var arrived_value_amt = ((base_value_amt)+(arrived_value_tax));
    //         var total_tax_rate	= parseFloat( (base_value_tax+arrived_value_tax).toFixed(2));
    //         var market_base_value_tax	= (this.calculate_base_value_tax(market_taxable,tax_group));
    //         var market_base_value_amt	= ((market_taxable)+(base_value_tax));
    //         var market_arrived_value_tax= (this.calculate_arrived_value_tax(base_value_amt,tax_group));
    //         var market_arrived_value_amt= ((base_value_amt)+(arrived_value_tax));
    //         var market_total_tax_rate	= parseFloat((base_value_tax + arrived_value_tax).toFixed(2));
    //         }else{
    //             var total_tax_rate	= 0;
    //             var market_total_tax_rate	= 0;
    //         }
    //         var total_price = (taxable+total_tax_rate);
    //         var market_total_price = (market_taxable+market_total_tax_rate);
    //     }else{
    //         var total_price = sales_value;
    //         var market_total_price = sales_value;
    //     }    

    //     // if(itemData.hasOwnProperty('advance')){
    //     // total_price =  total_price - advance;
    //     // }
    //     // Set Calculated Value
    //     itemData["making_charge"]  = making_charge;
    //     itemData["wast_wgt"]       = wast_wgt;
    //     itemData["taxable"]        = taxable;
    //     itemData["sales_value"]    = total_price.toFixed(2);
    //     itemData["market_tax_price"]  = market_total_tax_rate;
    //     itemData["market_sales_value"]= market_total_price;
    //     itemData["tax_price"]      = total_tax_rate;

    //     itemData["gross_wt"]       = itemData.gross_wt;
    //     itemData["less_wt"] = parseFloat(itemData.less_wt).toFixed(3);
    //     itemData["net_wt"] = net_wt.toFixed(3);
    // console.log('itemData["net_wt"] >>>>>>>' ,itemData["net_wt"]);

    //     itemData["rate_per"]         = ratePerG;

    //     if(data.item_type == 'tag'){
    //       itemData["is_partial"]     = itemData.is_partial;
    //     }
    //     if(data.item_type == 'non_tag'){
    //       itemData["design"]     = itemData.design;
    //     }
    //     console.log(itemData);
    //     return itemData;
    //   }

    public calculateSaleValue(data) {
        var itemData = data.itemData;
        var metalRates = data.metalRate;
        this.tax_details = data.tax_details;
        console.log(data);
        var arrived_value_tax = 0;
        var base_value_amt = 0;
        var arrived_value_amt = 0;

        var market_arrived_value_tax = 0;
        var market_base_value_amt = 0;
        var market_arrived_value_amt = 0;
        var gross_wt = this.setAsNumber(itemData.gross_wt);
        var less_wt = this.setAsNumber(itemData.less_wt);
        console.log('less_wt :  ', less_wt);

        var other_metal_total_wt = this.setAsNumber(itemData.other_metal_total_wt)

        var net_wt = this.setAsNumber(gross_wt - less_wt - other_metal_total_wt);
        console.log('retail : ', net_wt);


        //  var net_wt    = this.setAsNumber(itemData.net_wt) ;
        // var piece     = this.setAsNumber(itemData.piece) ;
        var piece = 1;

        var tax_group = this.setAsNumber(itemData.tax_group_id);
        var metal_type = this.setAsNumber(itemData.metal_type);
        var calculation_type = this.setAsNumber(itemData.calculation_based_on);
        var mc_type = this.setAsNumber(itemData.mc_type);
        var mc_value = this.setAsNumber(itemData.mc_value);
        var tot_wastage = this.setAsNumber(itemData.retail_max_wastage_percent);
        var stone_price = this.setAsNumber(itemData.stone_price);
        var other_metal_total_price = this.setAsNumber(itemData.other_metal_total_price);
        var certification_price = this.setAsNumber(itemData.certification_cost);
        console.log(121231313213, itemData['metalratec'] == 'true')

        var ratePerG = itemData['metalratec'] == 'true' ? itemData.rate_per : this.setAsNumber(metalRates[itemData.metal_type]);


        var marketRatePerG = this.setAsNumber(metalRates[itemData.market_metal_type]);
        var item_rate = this.setAsNumber(itemData.rate_per);
        var sales_value = this.setAsNumber(itemData.sales_value);
        var charges = this.setAsNumber(itemData.charge_value);
        //var othercharges = this.setAsNumber(itemData.othermetal_charges);
        var othermetalprice = this.setAsNumber(itemData.other_metal_total_price);


        var advance = this.setAsNumber(itemData['advance']);

        /**
        *	Amount calculation based on settings (without discount and tax )
        *   0 - Wastage on Gross weight And MC on Gross weight
        *   1 - Wastage on Net weight And MC on Net weight
        *   2 - Wastage On Netwt And MC On Grwt
        *   taxable = Metal Rate + Stone + OM + Wastage + MC
        */
        if (calculation_type == 0) {
            var wast_wgt = parseFloat(((gross_wt) * (tot_wastage / 100)).toFixed(3));
            if (mc_type != 3) {
                var making_charge = (mc_type == 2 ? (mc_value * gross_wt) : ((mc_type) == 1 ? (mc_value * piece) : 0));
                // Metal Rate + Stone + OM + Wastage + MC
                var taxable = ((ratePerG * ((wast_wgt) + (net_wt))) + (making_charge) + (stone_price) + (other_metal_total_price) + (certification_price) + (charges));
                var market_taxable = ((marketRatePerG * ((wast_wgt) + (net_wt))) + (making_charge) + (stone_price) + (other_metal_total_price) + (certification_price) + (charges));
            } else {
                var making_charge = (ratePerG * ((wast_wgt) + (net_wt)) * (mc_value / 100));
                var taxable = ((ratePerG * ((wast_wgt) + (net_wt))) + (making_charge) + (stone_price) + (other_metal_total_price) + (certification_price) + (charges));
                var market_taxable = ((marketRatePerG * ((wast_wgt) + (net_wt))) + (making_charge) + (stone_price) + (other_metal_total_price) + (certification_price) + (charges));

            }

        }
        else if (calculation_type == 1) {
            var wast_wgt = parseFloat(((net_wt) * (tot_wastage / 100)).toFixed(3));

            if (mc_type != 3) {
                console.log(ratePerG);
                console.log(wast_wgt);
                console.log(net_wt);
                console.log(making_charge);
                console.log(stone_price);
                console.log(other_metal_total_price);
                console.log(certification_price);
                console.log(charges);
                var making_charge = parseFloat((mc_type == 2 ? (mc_value * net_wt) : ((mc_type) == 1 ? (mc_value * piece) : 0)).toFixed(2));
                // Metal Rate + Stone + OM + Wastage + MC
                var taxable = parseFloat(((ratePerG * ((wast_wgt) + (net_wt))) + (making_charge) + (stone_price) + (other_metal_total_price) + (certification_price) + (charges)).toFixed(2));
                //  console.log(ratePerG)
                // console.log(wast_wgt)
                // console.log(net_wt)

                // console.log(making_charge)
                // console.log(stone_price)
                // console.log(certification_price)
                // console.log(charges)
                // // console.log(othercharges)




                console.log(taxable)

                var market_taxable = parseFloat(((marketRatePerG * ((wast_wgt) + (net_wt))) + (making_charge) + (stone_price) + (other_metal_total_price) + (certification_price) + (charges)).toFixed(2));
            } else {
                console.log(ratePerG);
                console.log(wast_wgt);
                console.log(net_wt);
                console.log(making_charge);
                console.log(stone_price);
                console.log(other_metal_total_price);
                console.log(certification_price);
                console.log(charges);
                var making_charge = ((ratePerG * ((wast_wgt) + (net_wt))) * (mc_value / 100));
                // Metal Rate + Stone + OM + Wastage + MC
                var taxable = parseFloat(((ratePerG * ((wast_wgt) + (net_wt))) + (making_charge) + (stone_price) + (other_metal_total_price) + (certification_price) + (charges)).toFixed(2));
                var market_taxable = parseFloat(((marketRatePerG * ((wast_wgt) + (net_wt))) + (making_charge) + (stone_price) + (other_metal_total_price) + (certification_price) + (charges)).toFixed(2));

            }

        }
        else if (calculation_type == 2) {
            var wast_wgt = parseFloat(((net_wt) * (tot_wastage / 100)).toFixed(3));
            if (mc_type != 3) {
                var making_charge = parseFloat((mc_type == 2 ? (mc_value * gross_wt) : ((mc_type) == 1 ? (mc_value * piece) : 0)).toFixed(2));
                console.log(making_charge);
                console.log(mc_value);
                console.log(piece);
                console.log(ratePerG);
                console.log(wast_wgt);
                console.log(net_wt);
                // Metal Rate + Stone + OM + Wastage + MC
                var taxable = parseFloat(((((ratePerG) * ((wast_wgt) + (net_wt))) + (making_charge)) + (stone_price) + (other_metal_total_price) + (certification_price) + (charges)).toFixed(2));
                var market_taxable = parseFloat(((((marketRatePerG) * ((wast_wgt) + (net_wt))) + (making_charge)) + (stone_price) + (other_metal_total_price) + (certification_price) + (charges)).toFixed(2));
            } else {
                console.log(making_charge)

                var making_charge = (((ratePerG) * ((wast_wgt) + (net_wt))) * (mc_value / 100));
                // Metal Rate + Stone + OM + Wastage + MC
                var taxable = parseFloat(((((ratePerG) * ((wast_wgt) + (net_wt))) + (making_charge)) + (stone_price) + (other_metal_total_price) + (certification_price) + (charges)).toFixed(2));
                var market_taxable = parseFloat(((((marketRatePerG) * ((wast_wgt) + (net_wt))) + (making_charge)) + (stone_price) + (other_metal_total_price) + (certification_price) + (charges)).toFixed(2));

            }
        }
        else if (calculation_type == 3) {
          
            // var wast_wgt = 0;
            // console.log(charges)
            // console.log(taxable,'taxable');
              var wast_wgt = 0;
            var taxable = (sales_value ? sales_value : 0);
            var market_taxable = (sales_value ? sales_value : 0);
            
            // var taxable = (sales_value ? sales_value + (charges) : 0);
            // var market_taxable = (sales_value ? sales_value + (charges) : 0);
            
        }
        else if (calculation_type == 4) {
            var wast_wgt = 0;
            var taxable = item_rate * gross_wt;
            var market_taxable = taxable + charges;
            //    var wast_wgt = 0;
            // var taxable = (sales_value ? sales_value : 0);
            // var market_taxable = (sales_value ? sales_value : 0);

            
        }
        // else if(calculation_type == 4){
        //   var wast_wgt = 0;
        //   var taxable  = (item_rate  ? item_rate : 0);
        //   var market_taxable  = (item_rate  ? item_rate : 0);
        // }
        /*         else if (calculation_type == 4) {
                    var wast_wgt = 0;
                    console.log(charges)
                    var taxable = (sales_value ? sales_value + (charges) : 0);
                    console.log('tax => ', taxable);
                    //  taxable = taxable * gross_wt; --->  commented by krishna  reason calculation overlap
                    var market_taxable = (sales_value ? sales_value + (charges) : 0);
                    // market_taxable = market_taxable * gross_wt; --->  commented by krishna  reason calculation overlap
                    console.log(market_taxable);
                }
         */
        //  taxable = parseFloat((taxable + othermetalprice).toFixed(2))
        console.log(taxable);

        if ((calculation_type != 3 && calculation_type != 4) || ((calculation_type == 3 && itemData.tax_type == 2) || (calculation_type == 4 && itemData.tax_type == 2))) {
            if (this.tax_details) {
                // Tax Calculation
                var base_value_tax = (this.calculate_base_value_tax(taxable, tax_group));
                console.log(base_value_tax)
                var base_value_amt = ((taxable) + (base_value_tax));
                var arrived_value_tax = (this.calculate_arrived_value_tax(base_value_amt, tax_group));
                console.log(arrived_value_tax)

                var arrived_value_amt = ((base_value_amt) + (arrived_value_tax));
                var total_tax_rate = parseFloat((base_value_tax + arrived_value_tax).toFixed(2));
                var market_base_value_tax = (this.calculate_base_value_tax(market_taxable, tax_group));
                var market_base_value_amt = ((market_taxable) + (base_value_tax));
                var market_arrived_value_tax = (this.calculate_arrived_value_tax(base_value_amt, tax_group));
                var market_arrived_value_amt = ((base_value_amt) + (arrived_value_tax));
                var market_total_tax_rate = parseFloat((base_value_tax + arrived_value_tax).toFixed(2));
            } else {
                var total_tax_rate = 0;
                var market_total_tax_rate = 0;
            }
            var total_price = (taxable + total_tax_rate);
            var market_total_price = (market_taxable + market_total_tax_rate);
        } else {
            var total_price = sales_value;
            var market_total_price = sales_value;
        }

        // if(itemData.hasOwnProperty('advance')){
        // total_price =  total_price - advance;
        // }
        // Set Calculated Value
        itemData["making_charge"] = making_charge;
        itemData["wast_wgt"] = wast_wgt;
        itemData["taxable"] = taxable;
        itemData["sales_value"] = total_price.toFixed(2);
        itemData["market_tax_price"] = market_total_tax_rate;
        itemData["market_sales_value"] = market_total_price;
        itemData["tax_price"] = total_tax_rate;
        itemData["gross_wt"] = itemData.gross_wt;
        itemData["less_wt"] = parseFloat(itemData.less_wt).toFixed(3);
        itemData["net_wt"] = this.setAsNumber(gross_wt - less_wt - other_metal_total_wt).toFixed(3);
        console.log('trrrrtrtr : ', itemData["net_wt"]);


        itemData["rate_per"] = ratePerG;

        if (data.item_type == 'tag') {
            itemData["is_partial"] = itemData.is_partial;
        }
        if (data.item_type == 'non_tag') {
            itemData["design"] = itemData.design;
        }
        console.log(itemData);
        return itemData;
    }




    // ./Item Sale Value calculation - Common for all Pages

    // Estimation
    public getTagData(postData) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/getTaggingBySearch', postData, this.commonService.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }
    public getref(postData) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/getRefBySearch', postData, this.commonService.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }

    public getorderData(postData) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/getorderBySearch', postData, this.commonService.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }

    public getNonTagItems(postData) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/getNonTagItems', postData, this.commonService.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }

    public getHomeStock(postData) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/getHomeStock', postData, this.commonService.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }

    getAllTaxGroupItems(): any {
        return this.http
            .get(BaseAPIURL + 'admin_app_api/getAllTaxGroupItems', this.commonService.getHeader())
            .map((response) => {
                let result = response.json();
                return result;
            })
            .toPromise();
    }

    getAllPurities(id_product): any {
        return this.http
            .get(BaseAPIURL + 'admin_app_api/getAllPurities?id_product=' + id_product, this.commonService.getHeader())
            .map((response) => {
                let result = response.json();
                return result;
            })
            .toPromise();
    }

    getOldMetalType(): any {
        return this.http
            .get(BaseAPIURL + 'admin_app_api/getOldMetalType', this.commonService.getHeader())
            .map((response) => {
                let result = response.json();
                return result;
            })
            .toPromise();
    }

    getAllStoneMaters(type): any {
        return this.http
            .get(BaseAPIURL + 'admin_app_api/getStones?type=' + type, this.commonService.getHeader())
            .map((response) => {
                let result = response.json();
                return result;
            })
            .toPromise();
    }

    getAllStoneTypes(type): any {
        return this.http
            .get(BaseAPIURL + 'admin_app_api/getStoneTypes?type=' + type, this.commonService.getHeader())
            .map((response) => {
                let result = response.json();
                return result;
            })
            .toPromise();
    }

    createEstimation(postData): any {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/createEstimation', postData, this.commonService.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }

    getEstiPrintURL(postData): any {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/getEstiPrintData', postData, this.commonService.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }

    getEstiDetails(postData): any {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/getEstimationDetails', postData, this.commonService.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }
    // ./Estimation

    // Catalog
    public getCategories(postData) {

        return this.http
            .post(BaseAPIURL + 'admin_app_api/getCategories', postData, this.commonService.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }

    public getsupCategories(postData) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/getCategories', postData, this.commonService.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }

    public getCollections(postData) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/getCollections', postData, this.commonService.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }

    public getProducts(postData) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/getProducts', postData, this.commonService.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }

    public getsupProducts(postData) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/getProducts', postData, this.commonService.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }

    public getProductTreeList(postData) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/getProductTreeList', postData, this.commonService.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }

    public getDesigns(postData) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/getDesigns', postData, this.commonService.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }

    public getDesignById(postData) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/getSubDesignById', postData, this.commonService.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }

    public getECatalog(postData) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/getECatalog', postData, this.commonService.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }

    public getEcatalogFilters() {
        return this.http
            .get(BaseAPIURL + 'admin_app_api/getEcatalogFilters', this.commonService.getHeader())
            .map((response) => {
                let result = response.json();
                return result;
            })
            .toPromise();
    }

    public uploadImg(postData) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/uploadImg', postData, this.commonService.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }
    // ./Catalog

    // Wishlist and Cart
    public addToWishlist(postData) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/createWishlist', postData, this.commonService.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }
    public getItemslist(postData) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/getItemslist', postData, this.commonService.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }
    public removeItem(postData) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/removeItem', postData, this.commonService.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }
    public updateItem(postData) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/updateItem', postData, this.commonService.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }
    public addToCart(postData) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/addToCart', postData, this.commonService.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }
    chooserate(): any {
        return this.http
            .get(BaseAPIURL + 'admin_app_api/previousRates', this.commonService.getHeader())
            .map((response) => {
                let result = response.json();
                return result;
            })
            .toPromise();
    }
    // ./Cart

    // Order  
    public createOrder(postData) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/createOrder', postData, this.commonService.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }
    public deletetagimage(postData) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/deletetagimage', postData, this.commonService.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }
    public addToenquiry(postData) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/enquiry', postData, this.commonService.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }

    public getdetails(postData) {
        return this.http
            .post(BaseAPIURL + 'admin_app_api/getCustomerDet', postData, this.commonService.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }

    // naveen
    public getProductsizes(id_product) {
        return this.http
            .get(BaseAPIURL + 'admin_app_api/getProductSize?id_product=' + id_product, this.commonService.getHeader())
            .map((response) => {
                // some response manipulation
                let result = response.json();
                return result;
            })
            .toPromise();
    }

    // ./Order

}
