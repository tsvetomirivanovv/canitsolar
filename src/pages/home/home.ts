import {Component, ElementRef, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';

declare var google: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapRef: ElementRef;

  constructor(public navCtrl: NavController) {

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
    // Create new empty marker
    let mapMarker1 = new google.maps.Marker;
    // Map event for click
    map.addListener('click', function (event) {
      // Delete the old marker
      mapMarker1.setMap(null);
      mapMarker1 = null;
      // Create new marker
      mapMarker1 = new google.maps.Marker({
        position: new google.maps.LatLng(event.latLng.lat(), event.latLng.lng()),
        map: map
      });
    });
  }

}
