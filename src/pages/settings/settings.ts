import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  settingsData = {
    city: 'Whitby',
    state: 'ON',
    units: 'C',
    autoNightMode: true,
    autoNightLight: false
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
    this.storage.get('location').then((val) => {
      if (val != null) {
        let location = JSON.parse(val);
        this.settingsData.city = location.city;
        this.settingsData.state = location.state;
      } else {
        this.settingsData.city = 'Whitby';
        this.settingsData.state = 'ON';
        this.settingsData.units = 'C';
      }
    });
    
    this.storage.get('appSettings').then((val) => {
      if(val != null) {
        let appSettings = JSON.parse(val);
        this.settingsData.units = appSettings.units;
        this.settingsData.autoNightLight = appSettings.autoNightLight;
        this.settingsData.autoNightMode = appSettings.autoNightMode;
      }else{
        this.settingsData.autoNightMode = false;
        this.settingsData.autoNightLight = false;
        this.settingsData.units = 'C';
        }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  saveForm() {
    let location = {
      city: this.settingsData.city,
      state: this.settingsData.state
    }
    console.log(location);
    this.storage.set('location', JSON.stringify(location));

    if(this.settingsData.autoNightLight && this.settingsData.autoNightMode){
      this.settingsData.autoNightMode = false;
      this.settingsData.autoNightLight = true;
    }  
    let appSettings = {
      units: this.settingsData.units,
      autoNightLight: this.settingsData.autoNightLight,
      autoNightMode: this.settingsData.autoNightMode
    }

    this.storage.set('appSettings', JSON.stringify(appSettings));
    
    //this.navCtrl.push(HomePage);
    this.navCtrl.setRoot(HomePage);
  }

}
