import {Component, NgZone} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Storage} from "@ionic/storage";

@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {

  storageForecasts = [];
  showHistoryPage = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              private zone: NgZone) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoryPage');
    let savedForecasts = this.storage.get('forecast');
    savedForecasts.then((res) => {
      this.storageForecasts = res;
    }).then(() => {
      this.zone.run(() => {
        this.showHistoryPage = true;
      });
    });
  }

  ionViewDidEnter(){
    console.log('Enter history page');
    let savedForecasts = this.storage.get('forecast');
    savedForecasts.then((res) => {
      this.storageForecasts = res;
    }).then(() => {
      this.zone.run(() => {
        this.showHistoryPage = true;
      });
    });
  }

  expandForecast(forecast) {
    forecast.showForecast = !forecast.showForecast;
  }

  saveNote(note,created){
    let savedForecasts = this.storage.get('forecast');
    let forecastNote = note;
    let oldItem = this.storageForecasts.find(x => x.created  == created);
    let oldItemIndex = this.storageForecasts.indexOf(oldItem);
    oldItem.note = forecastNote;
    savedForecasts.then((res)=>{
      res[oldItemIndex] = oldItem;
    }).then((res)=>{
      this.storage.set('forecast', savedForecasts);
    })


  }

}
