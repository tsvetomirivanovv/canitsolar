import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {HistoryPage} from "../history/history";
import {ForecastPage} from "../forecast/forecast";
import {SettingsPage} from "../settings/settings";



@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  historyRoot = HistoryPage;
  forecastRoot = ForecastPage;
  settingsRoot = SettingsPage;


  constructor(public navCtrl: NavController) {}

}
