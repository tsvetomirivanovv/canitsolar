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
    console.log(note);
    let forecastNote = note;
    let oldItem = this.storageForecasts.find(x => x.created  == created);
    let oldItemIndex = this.storageForecasts.indexOf(oldItem);
    console.log(oldItem)
    console.log(oldItem.note);
    oldItem.note = forecastNote;
    console.log(oldItem)
    console.log(savedForecasts);
    savedForecasts.then((res)=>{
      // res.splice(oldItemIndex,oldItem);
      console.log(res[oldItemIndex]);
      res[oldItemIndex] = oldItem;
    }).then((res)=>{
      console.log(savedForecasts)
      this.storage.set('forecast', savedForecasts);
      // console.log(savedForecasts)
    })

    // this.storage.set('forecast',)
    // this.storageForecasts[oldItemIndex]
    // let newNote = this.storage.get('forecast');
    // newNote.then((res)=>{
    //   console.log(res);
    //   console.log(res.filter( res => res.created === '2017-12-19:03:05:59' ))
    // });

  }

}
