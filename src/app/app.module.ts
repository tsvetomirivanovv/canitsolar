import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {MyApp} from './app.component';
import {HomeService} from "../services/home-service";
import {HttpClientModule} from "@angular/common/http";
import {DatePipe} from "@angular/common";
import {IonicStorageModule} from "@ionic/storage";
import {HistoryPage} from "../pages/history/history";
import {TabsPage} from "../pages/tabs/tabs";
import {ForecastPage} from "../pages/forecast/forecast";
import {SettingsPage} from "../pages/settings/settings";

@NgModule({
  declarations: [
    MyApp,
    ForecastPage,
    HistoryPage,
    SettingsPage,
    TabsPage

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ForecastPage,
    HistoryPage,
    SettingsPage,
    TabsPage

  ],
  providers: [
    StatusBar,
    SplashScreen,
    HomeService,
    DatePipe,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
