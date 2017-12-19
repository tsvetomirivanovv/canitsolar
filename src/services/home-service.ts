import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

@Injectable()
export class HomeService {

  private api_key: string = 'CvZ5vC7gnB2z3utjaML4trwwlZwnL2XI';

  constructor(private http: HttpClient) {
  }

  // Get all companies total shares
  getLocationPowerEstimate(latitude, longitude, capacity, format): Observable<any> {
    return this.http.get<any>
    ('https://api.solcast.com.au/pv_power/forecasts' +
      '?longitude=' + longitude +
      '&latitude=' + latitude +
      '&capacity=' + capacity +
      '&format=' + format +
      '&api_key=' + this.api_key
    );
  }

}
