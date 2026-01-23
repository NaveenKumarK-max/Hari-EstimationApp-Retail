import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, ModalController, NavParams } from 'ionic-angular';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { Market } from '@ionic-native/market';
import { DatePicker } from '@ionic-native/date-picker';
//import { SocialSharing } from '@ionic-native/social-sharing';
import { TruncatePipe } from '../pipes/truncate/truncate';
import { ImagePicker } from '@ionic-native/image-picker';
//import { Ionic2RatingModule } from 'ionic2-rating/';
import { Toast } from '@ionic-native/toast';
//import { OneSignal } from '@ionic-native/onesignal';
// import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { Printer, PrintOptions } from '@ionic-native/printer';
import { Network } from '@ionic-native/network';
import { AppVersion } from '@ionic-native/app-version';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { Transfer } from '@ionic-native/transfer';

// PAGES
import { HomePage } from '../pages/home/home';
import { WriteReviewPage } from '../pages/write-review/write-review';

import { LoginPage } from '../pages/login/login';
import { MaintenancePage } from '../pages/maintenance/maintenance';
import { IntroimgPage } from '../pages/introimg/introimg';
import { OtpPage } from '../pages/otp/otp';
import { EstiPage } from '../pages/estimation/estimation';
import { CusRegisterPage } from '../pages/cus-register/cus-register';
import { CategoryPage } from '../pages/category/category';
import { ProductsPage } from '../pages/products/products';
import { DesignsPage } from '../pages/designs/designs';
import { EcatalogPage } from '../pages/e-catalog/e-catalog';
import { DesignDetailPage } from '../pages/design-detail/design-detail';
import { EditorPage } from '../pages/img-editor/editor';
import { WishlistPage } from '../pages/wishlist/wishlist';
import { CartPage } from '../pages/cart/cart';
import { StockCodeEntryPage } from '../pages/stock-entry/stock-entry';

// MODAL
import { CountrymodelPage } from '../pages/modal/countrymodel/countrymodel';
import { CusSearchPage } from '../pages/modal/customer/customer';
import { EmpSearchPage } from '../pages/modal/employee/employee';
import { AddEstiItemPage } from '../pages/modal/add-esti-item/add-esti-item';
import { MasSearchPage } from '../pages/modal/mas-search/mas-search';
import { EstiBasicDetailPage } from '../pages/modal/esti-basic-detail/esti-basic-detail';
import { FilterPage } from '../pages/modal/filter/filter';
import { AddQuickCus } from '../pages/modal/add-quick-cus/add-quick-cus';
import { AddStoneDetailPage } from '../pages/modal/add-stone-detail/add-stone-detail';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

//Pipes
import { FilterPipe } from '../app/pipes/filter-pipe.pipe';

// COMPONENTS
import { TreeView } from '../components/tree-view/tree-view';
import { ItemsListComponent } from '../components/items-list/items-list';
import { EdittagPage } from '../pages/edittag/edittag';
import { RatioCrop, RatioCropOptions } from 'ionic-cordova-plugin-ratio-crop';
import { CarouselComponent } from '../components/carousel/carousel';
import { EstimationlistPage } from '../pages/estimationlist/estimationlist';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { BluetoothPage } from '../pages/bluetooth/bluetooth';
import { BranchPage } from '../pages/branch/branch';
import { SubdesignimgPage } from '../pages/subdesignimg/subdesignimg';
import { SubdesignlistPage } from '../pages/subdesignlist/subdesignlist';
import { CusupdatePage } from '../pages/cusupdate/cusupdate';
import { SubdesignPage } from '../pages/subdesign/subdesign';
import { DesignimgPage } from '../pages/designimg/designimg';
import { DesignlistPage } from '../pages/designlist/designlist';
import { CustomorderPage } from '../pages/customorder/customorder';
import { GiftPage } from '../pages/gift/gift';
import { OtherPage } from '../pages/other/other';
import {NgxImageCompressService} from 'ngx-image-compress';
/* import { AnimationService, AnimationBuilder } from 'css-animator'; */
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { Device } from '@ionic-native/device';

import { Mass2Page } from '../pages/mass2/mass2';
import { AvrsearchPage } from '../pages/avrsearch/avrsearch';
import { ProdetailPage } from '../pages/prodetail/prodetail';
import { AutoPage } from '../pages/auto/auto';
import { CollectionPage } from '../pages/collection/collection';
import { FolderpressPage } from '../pages/folderpress/folderpress';

import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture';
import { SupsubdesignPage } from '../pages/supsubdesign/supsubdesign';
import { SupprodetailPage } from '../pages/supprodetail/supprodetail';
import { Addstone2Page } from '../pages/addstone2/addstone2';
import { FaqPage } from '../pages/faq/faq';
import { Edittag2Page } from '../pages/edittag2/edittag2';
import { StarRatingModule } from 'ionic3-star-rating';
import { DetailsPage } from '../pages/details/details';
import { ChargesPage } from '../pages/charges/charges';
import { NotconvertedPage } from '../pages/notconverted/notconverted';
import { StonesearchPage } from '../pages/stonesearch/stonesearch';
import { Mass3Page } from '../pages/mass3/mass3';
import { Masssearch2Page } from '../pages/masssearch2/masssearch2';
import { DirectPage } from '../pages/direct/direct';
import { AvrproductdetailsPage } from '../pages/avrproductdetails/avrproductdetails';
import { InstockPage } from '../pages/instock/instock';
import { OrderStatusPage } from '../pages/order-status/order-status';
import { CartListViewPage } from '../pages/cart-list-view/cart-list-view';
import { StatusViewPage } from '../pages/status-view/status-view';
import { OrderStatusViewPage } from '../pages/order-status-view/order-status-view';
import { CommonProvider } from '../providers/common';
import { IndianCurrencyPipe } from './pipes/indian-currency';
// import { DocumentViewer,DocumentViewerOptions } from '@ionic-native/document-viewer';



let pages = [
    MyApp,
    HomePage,
    LoginPage,
    MaintenancePage,
    IntroimgPage,
    OtpPage,
	EstiPage,
    CusRegisterPage,
    CategoryPage,
    ProductsPage,
    DesignsPage,
    EcatalogPage,
    DesignDetailPage,
    //MODAL
    CountrymodelPage,
    CusSearchPage,
    AddEstiItemPage,
    EmpSearchPage,
    MasSearchPage,
    EstiBasicDetailPage,
    FilterPage,
    EditorPage,
    AddQuickCus,
    AddStoneDetailPage,
    WishlistPage,
    CartPage,
	StockCodeEntryPage,
    EdittagPage,
    EstimationlistPage,
    BluetoothPage,
    BranchPage,
    SubdesignimgPage,
    SubdesignlistPage,
    CusupdatePage,
    SubdesignPage,
    DesignimgPage,
    DesignlistPage,
    CustomorderPage,
    GiftPage,
    OtherPage,
    Mass2Page,
    Mass3Page,
    AvrsearchPage,
    ProdetailPage,
    AutoPage,
    CollectionPage,
    FolderpressPage,
    SupsubdesignPage,
    SupprodetailPage,
    Addstone2Page,
    FaqPage,
    Edittag2Page,
    WriteReviewPage,
    DetailsPage,
    ChargesPage,
	NotconvertedPage,
    StonesearchPage,
    Masssearch2Page,
    DirectPage,
    CartListViewPage,
    OrderStatusPage,
    StatusViewPage,
    AvrproductdetailsPage,
    InstockPage,
    OrderStatusViewPage
 ];

 let components = [
     CarouselComponent,
    TreeView,
    ItemsListComponent
 ];

 let modals = [
    CountrymodelPage,
    CusSearchPage,
    AddEstiItemPage,
    EmpSearchPage,
    MasSearchPage,
    EstiBasicDetailPage,
    FilterPage

 ];

 let pipes = [
    TruncatePipe,
    FilterPipe,
    IndianCurrencyPipe
 ];

export function declarations() {
    return [pages, components, modals, pipes];
}

export function entryComponents() {
    return pages;
}


export function providers() {
    return [
        CommonProvider,MediaCapture,Device,InAppBrowser, NgxImageCompressService,Market, AppVersion, ImagePicker, DatePicker, AndroidPermissions, StatusBar, SplashScreen, Toast,  Network, Printer, FileOpener, File, FileTransfer, FileChooser, FilePath, Camera, Crop, Transfer,RatioCrop,BarcodeScanner,BluetoothSerial,
        { provide: ErrorHandler, useClass: IonicErrorHandler,ModalController }
    ];
}

@NgModule({
    declarations: declarations(),
    imports: [
        IonicModule.forRoot(MyApp,{
            scrollPadding: false,
            scrollAssist: false
          }), IonicStorageModule.forRoot(), BrowserModule,
        HttpModule, BrowserAnimationsModule, IonicImageViewerModule,StarRatingModule
    ],
    bootstrap: [IonicApp],
    entryComponents: entryComponents(),
    providers: providers()
})
export class AppModule { }
