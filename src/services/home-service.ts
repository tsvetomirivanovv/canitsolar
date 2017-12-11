import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

@Injectable()
export class HomeService {

  private api_key: string = 'CvZ5vC7gnB2z3utjaML4trwwlZwnL2XI';

  constructor(private http: HttpClient) {
  }

  // Get all companies total shares
  // getLocationPowerEstimate(longitude, latitude, capacity, format): Observable<any> {
  //   return this.http.get<any>
  //   ('/solcast/' +
  //     '?longitude=' + latitude +
  //     '&latitude=' + longitude +
  //     '&capacity=' + capacity +
  //     '&format=' + format +
  //     '&api_key=' + this.api_key
  //   );
  // }


  getLocationPowerEstimate(longitude, latitude, capacity, format): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('test','TEST123');
    // headers.set('Access-Control-Allow-Origin', '*');
    // headers.set('Authorization','TEST123');
    console.log(headers);
    return this.http.get<any>
    ('/solcast/');
  }

//  https://api.solcast.com.au/pv_power/forecasts?longitude=26.008&latitude=42.501&capacity=1000
}
