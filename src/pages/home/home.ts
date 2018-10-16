import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';

import { WeatherProvider } from '../../providers/weather/weather';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  currentDate;
  currentTime;
  timeVar;
  hourOfDay: number;
  wResp: any;
  wError: string;

  wLocation: any
  ={
    name:"",
    region:"",
    country:""
  };

  weather:any 
  = {
    temp:"--",
    temp_c:"--",
    temp_f:"--",
    feelslike:"--",
    feelslike_c:"--",
    feelslike_f:"--",
    vis:"",
    vis_km:0,
    vis_miles:0,
    vis_txt:"",
    humidity:0,
    humidity_txt:"",
    unit:"",
    wind:"--",
    wind_kph:0,
    wind_mph:0,
    wind_dir:"",
    condition:{
      text:""
    }
  };

  lastWeatherDataRefreshHour: number;

  location: {
    city: string,
    state: string
  }

  appSettings: {
    units: string,
    autoNightLight: boolean,
    autoNightMode: boolean
  }

  public homeColor: any = {
    dayColor: true,
    nightColor: false,
    nightLightColor: false
  };

  constructor(public navCtrl: NavController,
    private weatherProvider: WeatherProvider,
    public storage: Storage) {
  }

  ionViewWillEnter() {
    console.log(this.weather);
    this.startTimer();
    this.getDate();
    this.getTime();
    this.getWeatherData();
  }

  getWeatherData(){
    var units;

    this.storage.get('appSettings').then((val1) => {
      console.log('val: ' + val1);

      if(val1 != null) {
        this.appSettings = JSON.parse(val1);
      }else{
        this.appSettings = {
          autoNightMode: true,
          autoNightLight: false,
          units: 'C'
        }
      }
      units = this.appSettings.units;
      console.log(this.appSettings);
      this.setBackground(this.hourOfDay);
    });

    this.storage.get('location').then((val) => {
      console.log('val: ' + val);
      if (val != null) {
        this.location = JSON.parse(val);
      } else {
        this.location = {
          city: 'Whitby',
          state: 'ON'
        }
      }
      console.log(this.location);
      this.weatherProvider.getWeather(this.location.city, this.location.state).subscribe(
        weather => {
          if (weather != null) {
            console.log(weather);

            this.weather = weather.current;
            this.wLocation = weather.location;
            
            if(this.weather.humidity < 35){
              this.weather.humidity_txt = "Very Dry ";
            }else if(this.weather.humidity > 35 && this.weather.humidity < 65){
              this.weather.humidity_txt = "Pleasent ";
            }else if(this.weather.humidity > 65){
              this.weather.humidity_txt = "Very Humid ";
            }
            this.weather.humidity_txt += "[Humidity: " + this.weather.humidity + "%]";

            if(this.weather.vis_km < 1){
              this.weather.vis_txt = "Poor";
            }else{
              this.weather.vis_txt = "Good";
            }

            this.wLocation.name = this.wLocation.name + ",";
            this.wLocation.region = this.wLocation.region + ",";
            
            if(units == 'C'){
              this.weather.unit = "C";
              this.weather.temp = this.weather.temp_c;
              this.weather.feelslike = this.weather.feelslike_c;
              this.weather.wind = this.weather.wind_kph + " KPH"; 
              this.weather.vis = this.weather.vis_km + " KM";
              //this.weather.precip = this.weather.precip_mm + " MM";
            }else{
              this.weather.unit = "F";
              this.weather.temp = this.weather.temp_f;
              this.weather.feelslike = this.weather.feelslike_f;
              this.weather.wind = this.weather.wind_mph + " MPH"; 
              this.weather.vis = this.weather.vis_miles + " miles";
              //this.weather.precip = this.weather.precip_in + " inches";
            }
          }
        },
        errResp => {
          console.log('err resp: ');
          console.log(errResp);
          this.wError = errResp;
        }
      );
      console.log('http subscribe complete');
    });
  }

  startTimer() {
    this.timeVar = Observable.interval(1000).subscribe(() => {
      //console.log(x);
      this.getTime();
    })
  }

  getDate() {
    var dt = new Date();

    var day = dt.getDay();
    var date = dt.getDate().toString();
    var mon = dt.getMonth();
    var year = dt.getFullYear().toString();

    var months = ['January', 'Feburary', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'];

    var days = ['Sunday', 'Monday', 'Tuesday',
      'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    this.currentDate = days[day] + ", " + months[mon] + " " + date + ", " + year;
  }

  getTime() {
    var dt = new Date();
    var ampm = 'AM';

    var hr = dt.getHours();
    this.hourOfDay = hr;

    if (hr > 12) {
      hr = hr - 12;
      ampm = 'PM';
    } else {
      ampm = 'AM';
    }

    var min = dt.getMinutes().toString();
    if (min.length == 1)
      min = "0" + min;

    var sec = dt.getSeconds().toString();
    if (sec.length == 1)
      sec = "0" + sec;

    if (hr == 0 && min == '00' && sec == '00')
      this.getDate();

    if (hr == 0)
      hr = 12;
    this.currentTime = hr + ":" + min + ":" + sec + ' ' + ampm;
    
    if(this.hourOfDay % 3 == 0 && this.hourOfDay != this.lastWeatherDataRefreshHour){
      console.log("refresh weather");
      this.lastWeatherDataRefreshHour = this.hourOfDay;
      this.getWeatherData();
    }
  }

  setBackground(hr: number){
    console.log('hr: ' + this.hourOfDay);

    if(this.appSettings.autoNightMode && (hr > 21 || hr < 6)){
      this.homeColor.dayColor = false;
      this.homeColor.nightColor = true;
      this.homeColor.nightLightColor = false;
    }else if(this.appSettings.autoNightLight && (hr > 21 || hr < 6)){
      this.homeColor.dayColor = false;
      this.homeColor.nightColor = false;
      this.homeColor.nightLightColor = true;
    }else{
      this.homeColor.dayColor = true;
      this.homeColor.nightColor = false;
      this.homeColor.nightLightColor = false;
    }
  }

}
