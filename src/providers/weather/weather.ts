import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from '../../../node_modules/rxjs/Observable';

/*
  Generated class for the WeatherProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WeatherProvider {

  apiKey = '4cb94dc0ef3245dd96033553181308';
  url = 'http://api.apixu.com/v1/current.json?q=';

  constructor(public http: Http) {
    console.log('Hello WeatherProvider Provider');
  }

  getWeather(city, state){
   
    return this.http.get(this.url + city + ',' + state + '&key=' + this.apiKey)
      .map(res => res.json())
      .catch(this._errorHandler);
  }
  
  _errorHandler(error: Response){
    console.log(error.json());
    return Observable.throw(error);
  }
}