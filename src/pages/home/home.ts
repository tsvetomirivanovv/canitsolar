import {Component, ElementRef, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';

declare var google: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapRef: ElementRef;
  map: any;

  constructor(public navCtrl: NavController) {

  }

  ionViewDidLoad() {
    console.log('test');
    console.log(this.mapRef);
    this.initMap();
  }


  initMap() {
    // Location - lat, long
    const mapInitLocation = new google.maps.LatLng(51.11, 21.11);

    // Map options
    const mapOptions = {
      center: mapInitLocation,
      zoom: 17
    };

    this.map = new google.maps.Map(this.mapRef.nativeElement, mapOptions);

  }

}
