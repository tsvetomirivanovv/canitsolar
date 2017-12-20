import {Component, ElementRef, NgZone, ViewChild} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import SunCalc from 'suncalc';
import {DatePipe} from "@angular/common";
import {Storage} from "@ionic/storage";
import {HomeService} from "../../services/home-service";
import {ToastController} from 'ionic-angular';

declare var google: any;


@Component({
  selector: 'page-forecast',
  templateUrl: 'forecast.html',
})
export class ForecastPage {


  @ViewChild('map') mapRef: ElementRef;
  mapLoaded = false;
  currentCapacity = 0;
  currentLongitude = 0;
  currentLatitude = 0;
  currentTilt = '';

  currentDate1 = new Date();
  currentDate2 = new Date();
  currentDate3 = new Date();
  currentDate4 = new Date();

  currentDate1Forecast = [];
  currentDate2Forecast = [];
  currentDate3Forecast = [];
  currentDate4Forecast = [];


  constructor(public navCtrl: NavController,
              private homeService: HomeService,
              private zone: NgZone,
              public alertCtrl: AlertController,
              private datePipe: DatePipe,
              private storage: Storage,
              public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    this.currentDate2.setDate(this.currentDate2.getDate() + 1);
    this.currentDate3.setDate(this.currentDate3.getDate() + 2);
    this.currentDate4.setDate(this.currentDate4.getDate() + 3);
    this.initMap();
  }

  // Initialization of the google map
  initMap() {

    // Location - lat, long
    const mapInitLocation = new google.maps.LatLng(52.11, 22.11);

    // Map options
    const mapOptions = {
      center: mapInitLocation,
      zoom: 13
    };

    // Creating a map with the provided map options
    const map = new google.maps.Map(this.mapRef.nativeElement, mapOptions);

    // Add new marker on map left click
    this.addMapMarker(map);
  }


  addMapMarker(map) {
    // Create new empty marker and info window
    let mapMarker1 = new google.maps.Marker;
    let mapMarker1InfoWindow = new google.maps.InfoWindow;
    // Map event for click
    map.addListener('click', (event) => {
        // Delete the old marker
        mapMarker1.setMap(null);
        mapMarker1 = null;
        // Create marker
        mapMarker1 = new google.maps.Marker({
          position: new google.maps.LatLng(event.latLng.lat(), event.latLng.lng()),
          map: map
        });

        // Get sunrise time on map click
        let times = SunCalc.getTimes(new Date(), event.latLng.lat(), event.latLng.lng());
        console.log(times);
        let mapMarker1InfoContent =
          "Sunrise: " + times.sunrise.toISOString().slice(11, 19) + "<br/>" +
          "Sunrise end: " + times.sunriseEnd.toISOString().slice(11, 19) + "<br/>" +
          "Noon peak: " + times.solarNoon.toISOString().slice(11, 19) + "<br/>" +
          "Sunset start: " + times.sunsetStart.toISOString().slice(11, 19) + "<br/>" +
          "Sunset: " + times.sunset.toISOString().slice(11, 19) + "<br/>";


        // Create marker info window
        mapMarker1InfoWindow = new google.maps.InfoWindow({
          content: mapMarker1InfoContent
        });

        // Auto open marker info window when created
        setTimeout(() => {
          mapMarker1InfoWindow.open(map, mapMarker1);
        }, 100);

        // Manual open/hide info window for marker
        mapMarker1.addListener('click', function (event) {
          mapMarker1InfoWindow.open(map, mapMarker1);
        });

        // Alert for displaying the input for capacity
        let prompt = this.alertCtrl.create({
          title: 'Panel system capacity',
          message: "Enter the capacity of your system in Watts",
          inputs: [
            {
              name: 'capacity',
              placeholder: 'Capacity',
              type: 'number'
            },
          ],
          buttons: [
            {
              text: 'Set',
              handler: data => {

                // Get the capacity input from the alert
                this.currentCapacity = data.capacity;
                this.currentLongitude = event.latLng.lng();
                this.currentLatitude = event.latLng.lat();

                this.homeService.getLocationPowerEstimate(event.latLng.lat().toString(), event.latLng.lng().toString(), data.capacity, 'json').subscribe(
                  res => {

                    // Update view
                    this.zone.run(() => {
                      this.currentDate1Forecast = [];
                      this.currentDate2Forecast = [];
                      this.currentDate3Forecast = [];
                      this.currentDate4Forecast = [];
                      this.mapLoaded = false;
                    });

                    for (let i = 0; i < res.forecasts.length; i++) {
                      let date1 = this.datePipe.transform(this.currentDate1, 'yyyy-MM-dd');
                      let date2 = this.datePipe.transform(this.currentDate2, 'yyyy-MM-dd');
                      let date3 = this.datePipe.transform(this.currentDate3, 'yyyy-MM-dd');
                      let date4 = this.datePipe.transform(this.currentDate4, 'yyyy-MM-dd');


                      if (res.forecasts[i].period_end.includes(date1)) {
                        this.currentDate1Forecast.push(res.forecasts[i]);
                      }

                      if (res.forecasts[i].period_end.includes(date2)) {
                        this.currentDate2Forecast.push(res.forecasts[i]);
                      }

                      if (res.forecasts[i].period_end.includes(date3)) {
                        this.currentDate3Forecast.push(res.forecasts[i]);
                      }

                      if (res.forecasts[i].period_end.includes(date4)) {
                        this.currentDate4Forecast.push(res.forecasts[i]);
                      }

                    }
                  },
                  err => {
                    let alert = this.alertCtrl.create({
                      title: 'ERROR!',
                      subTitle: JSON.stringify(err),
                      buttons: ['OK']
                    });
                    alert.present();
                  },
                  () => {
                    this.zone.run(() => {
                      this.mapLoaded = true;
                    });

                  }
                );
              }
            }
          ]
        });
        prompt.present();

      }
    );
  }


  // Set new capacity
  refreshCapacity() {
    let prompt = this.alertCtrl.create({
      title: 'Panel system capacity',
      message: "Enter new capacity",
      inputs: [
        {
          name: 'capacity',
          placeholder: 'Capacity',
          type: 'number'
        },
      ],
      buttons: [
        {
          text: 'Set',
          handler: data => {

            this.currentCapacity = data.capacity;

            this.homeService.getLocationPowerEstimate(this.currentLatitude.toString(), this.currentLongitude.toString(), this.currentCapacity, 'json').subscribe(
              res => {

                // Reset the list values
                this.zone.run(() => {
                  this.currentDate1Forecast = [];
                  this.currentDate2Forecast = [];
                  this.currentDate3Forecast = [];
                  this.currentDate4Forecast = [];
                  this.mapLoaded = false;
                });

                for (let i = 0; i < res.forecasts.length; i++) {
                  let date1 = this.datePipe.transform(this.currentDate1, 'yyyy-MM-dd');
                  let date2 = this.datePipe.transform(this.currentDate2, 'yyyy-MM-dd');
                  let date3 = this.datePipe.transform(this.currentDate3, 'yyyy-MM-dd');
                  let date4 = this.datePipe.transform(this.currentDate4, 'yyyy-MM-dd');

                  if (res.forecasts[i].period_end.includes(date1)) {
                    this.currentDate1Forecast.push(res.forecasts[i]);
                  }

                  if (res.forecasts[i].period_end.includes(date2)) {
                    this.currentDate2Forecast.push(res.forecasts[i]);
                  }

                  if (res.forecasts[i].period_end.includes(date3)) {
                    this.currentDate3Forecast.push(res.forecasts[i]);
                  }

                  if (res.forecasts[i].period_end.includes(date4)) {
                    this.currentDate4Forecast.push(res.forecasts[i]);
                  }

                }
              },
              err => {
                let alert = this.alertCtrl.create({
                  title: 'ERROR!',
                  subTitle: 'No internet access!',
                  buttons: ['OK']
                });
                alert.present();
              },
              () => {
                this.zone.run(() => {
                  let toast = this.toastCtrl.create({
                    message: 'Capacity updated => Data refreshed!',
                    duration: 3000,
                    position: 'top'
                  });
                  toast.present();
                  this.mapLoaded = true;
                });
              }
            );
          }
        },
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    prompt.present();
  }

  // Save forecast to storage
  saveForecast() {
    this.storage.get('forecast').then((res) => {
      if (res == null) {
        this.storage.set('forecast', []).then(() => {
          let savedForecasts = this.storage.get('forecast');
          let date = this.datePipe.transform(new Date(), 'yyyy-MM-dd:HH:mm:ss');
          let newForecast = {
            "created": date,
            "note": "",
            "date1": this.currentDate1Forecast,
            "date2": this.currentDate2Forecast,
            "date3": this.currentDate3Forecast,
            "date4": this.currentDate4Forecast,
          };
          savedForecasts.then((res) => {
            res.push(newForecast);
          });
          this.storage.set('forecast', savedForecasts);
          this.savedForecastToast();
        });
      }
      else {
        let savedForecasts = this.storage.get('forecast');
        let date = this.datePipe.transform(new Date(), 'yyyy-MM-dd:HH:mm:ss');
        let newForecast = {
          "created": date,
          "note": "",
          "date1": this.currentDate1Forecast,
          "date2": this.currentDate2Forecast,
          "date3": this.currentDate3Forecast,
          "date4": this.currentDate4Forecast,
        };
        savedForecasts.then((res) => {
          res.push(newForecast);
        });
        this.storage.set('forecast', savedForecasts);
        this.savedForecastToast();
      }
    });

  }

  // Alert for displaying the a forecast is saved
  savedForecastToast() {
    let toast = this.toastCtrl.create({
      message: 'Forecast was saved',
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Tilt input alert
  advanceSettings() {
    let prompt = this.alertCtrl.create({
      title: 'Panel system tilt angle',
      message: "Enter tilt angle from 0 - 90. Default is 23 degrees",
      inputs: [
        {
          name: 'tilt',
          placeholder: 'Tilt',
          type: 'number'
        },
      ],
      buttons: [
        {
          text: 'Set',
          handler: data => {

            this.currentTilt = data.tilt;

            this.homeService.getLocationPowerEstimate(this.currentLatitude.toString(), this.currentLongitude.toString(), this.currentCapacity, 'json', this.currentTilt).subscribe(
              res => {

                // Reset the list values
                this.zone.run(() => {
                  this.currentDate1Forecast = [];
                  this.currentDate2Forecast = [];
                  this.currentDate3Forecast = [];
                  this.currentDate4Forecast = [];
                  this.mapLoaded = false;
                });

                for (let i = 0; i < res.forecasts.length; i++) {
                  let date1 = this.datePipe.transform(this.currentDate1, 'yyyy-MM-dd');
                  let date2 = this.datePipe.transform(this.currentDate2, 'yyyy-MM-dd');
                  let date3 = this.datePipe.transform(this.currentDate3, 'yyyy-MM-dd');
                  let date4 = this.datePipe.transform(this.currentDate4, 'yyyy-MM-dd');

                  if (res.forecasts[i].period_end.includes(date1)) {
                    this.currentDate1Forecast.push(res.forecasts[i]);
                  }

                  if (res.forecasts[i].period_end.includes(date2)) {
                    this.currentDate2Forecast.push(res.forecasts[i]);
                  }

                  if (res.forecasts[i].period_end.includes(date3)) {
                    this.currentDate3Forecast.push(res.forecasts[i]);
                  }

                  if (res.forecasts[i].period_end.includes(date4)) {
                    this.currentDate4Forecast.push(res.forecasts[i]);
                  }

                }
              },
              err => {
                let alert = this.alertCtrl.create({
                  title: 'ERROR!',
                  subTitle: 'No internet access!',
                  buttons: ['OK']
                });
                alert.present();
              },
              () => {
                this.zone.run(() => {
                  let toast = this.toastCtrl.create({
                    message: 'Tilt updated => Data refreshed!',
                    duration: 3000,
                    position: 'top'
                  });
                  toast.present();
                  this.mapLoaded = true;
                });
              }
            );
          }
        },
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    prompt.present();
  }

}
