import {Component, ElementRef, NgZone, ViewChild} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import SunCalc from 'suncalc';
import {HomeService} from "../../services/home-service";
import {DatePipe} from "@angular/common";

declare var google: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapRef: ElementRef;
  currentForecast = [];
  visibleSlides = false;
  mapLoaded = false;

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
              private datePipe: DatePipe) {
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

      // Create marker info window
      mapMarker1InfoWindow = new google.maps.InfoWindow({
        content: times.sunrise.toString()
      });

      // Auto open marker info window when created
      setTimeout(() => {
        mapMarker1InfoWindow.open(map, mapMarker1);
      }, 100);

      // Manual open/hide info window for marker
      mapMarker1.addListener('click', function (event) {
        mapMarker1InfoWindow.open(map, mapMarker1);
      });

      this.homeService.getLocationPowerEstimate(event.latLng.lat().toString(), event.latLng.lng().toString(), '1000', 'json').subscribe(
        res => {
          for (let i = 0; i< res.forecasts.length; i++){
            let date1 = this.datePipe.transform(this.currentDate1,'yyyy-MM-dd');
            let date2 = this.datePipe.transform(this.currentDate2,'yyyy-MM-dd');
            let date3 = this.datePipe.transform(this.currentDate3,'yyyy-MM-dd');
            let date4 = this.datePipe.transform(this.currentDate4,'yyyy-MM-dd');



            if (res.forecasts[i].period_end.includes(date1)){
              this.currentDate1Forecast.push(res.forecasts[i]);
            }

            if (res.forecasts[i].period_end.includes(date2)){
              this.currentDate2Forecast.push(res.forecasts[i]);
            }

            if (res.forecasts[i].period_end.includes(date3)){
              this.currentDate3Forecast.push(res.forecasts[i]);
            }

            if (res.forecasts[i].period_end.includes(date4)){
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
          console.log(this.currentDate1Forecast);
          console.log(this.currentDate2Forecast);
          console.log(this.currentDate3Forecast);
          console.log(this.currentDate4Forecast);

          // console.log(this.visibleSlides);
          this.zone.run(() => {
            this.mapLoaded = true;
            // console.log(this.visibleSlides);
          });


        }
      );

      // this.showMapMarkerInfoWindow(event.latLng.lat().toString(),event.latLng.lng().toString(),'1000','json');

    });
  }

  showMapMarkerInfoWindow(longitude, latitude, capacity, format) {
  }

}
