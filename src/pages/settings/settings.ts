import { Component } from '@angular/core';
import {AlertController, NavController, NavParams, ToastController} from 'ionic-angular';
import {Storage} from "@ionic/storage";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private storage: Storage
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  deleteAlert(){

      let confirm = this.alertCtrl.create({
        title: 'Delete all history data?',
        message: 'Are you sure you want to delete all your saved data in the "History" tab?' ,
        buttons: [
          {
            text: 'No',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: 'Yes',
            handler: () => {
              console.log('Agree clicked');
              this.storage.remove('forecast').then(()=>{
                let toast = this.toastCtrl.create({
                  message: 'History is now empty.',
                  duration: 3000,
                  position: 'top'
                });
                toast.present();
              });

            }
          }
        ]
      });
      confirm.present();

  }

  savedForecastToast() {

  }

}
