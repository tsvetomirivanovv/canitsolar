import {Component, ElementRef, NgZone, ViewChild} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import SunCalc from 'suncalc';
import {HomeService} from "../../services/home-service";

declare var google: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapRef: ElementRef;
  currentForecast = [];
  visibleSlides = false;

  constructor(public navCtrl: NavController,
              private homeService: HomeService,
              private zone: NgZone,
              public alertCtrl: AlertController) {

  }

  ionViewDidLoad() {
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
          console.log(res);
          this.currentForecast = res.forecasts;
          console.log(this.currentForecast);
        },
        err => {

        },
        () => {
          console.log(this.visibleSlides);
          this.zone.run(() => {
            this.visibleSlides = true;
            console.log(this.visibleSlides);

            let alert = this.alertCtrl.create({
              title: 'New Friend!',
              subTitle: this.currentForecast.toString(),
              buttons: ['OK']
            });
            alert.present();

          });


        }
      );

      // this.showMapMarkerInfoWindow(event.latLng.lat().toString(),event.latLng.lng().toString(),'1000','json');

    });
  }

  showMapMarkerInfoWindow(longitude, latitude, capacity, format) {
  }

}
