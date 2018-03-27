import { Component, ElementRef, OnInit, AfterViewInit, NgZone, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';
import { HTTPSerivce } from '../httpServices/http.service';
import * as $ from 'jquery/dist/jquery.min.js';
@Component({
  selector: 'weather-report',
  templateUrl: './weather.report.component.html',
  styleUrls: ['./weather.report.component.css']
})
export class WeatherReport implements OnInit, AfterViewInit {
  public searchControl: FormControl;
  search: string;
  autocomplete: any;
  lat: any;
  lng: any;
  city: string;
  cityName: string;
  weatherReports = [];
  address:string;
  @ViewChild("search2")
  public secondsearchElementRef: ElementRef;
  @ViewChild("search3")
  public thirdearchElementRef: ElementRef;
  @ViewChild("search1")
  public searchElementRef: ElementRef;
  
  @ViewChild("btn")
  public btnElementRef: ElementRef;
  
  constructor(private httpService: HTTPSerivce, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {
  }

  ngOnInit() {
    if(localStorage.getItem('cityName')){
      setTimeout(() => {
      this.search = localStorage.getItem('cityName'); 
      });
      setTimeout(() => {
        let el = this.btnElementRef.nativeElement as HTMLElement;
        el.click();        
      },1000);
    } 
    
    this.searchControl = new FormControl();
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      this.autocomplete.addListener("place_changed", () => {        
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = this.autocomplete.getPlace();
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

        });
      });
    });     
    
   
      
  }

  ngAfterViewInit() {
    this.mapsAPILoader.load().then(() => {
      this.autocomplete = new google.maps.places.Autocomplete( this.secondsearchElementRef.nativeElement, {
        types: ["address"]
      });
      this.autocomplete.addListener("place_changed", () => {        
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = this.autocomplete.getPlace();
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

        });
      });
    }); 

    this.mapsAPILoader.load().then(() => {
      this.autocomplete = new google.maps.places.Autocomplete( this.thirdearchElementRef.nativeElement, {
        types: ["address"]
      });
      this.autocomplete.addListener("place_changed", () => {        
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = this.autocomplete.getPlace();
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

        });
      });
    });
  }

  getWeatherDetailsone(){
    this.searchElementRef.nativeElement.value ? localStorage.setItem('cityName', this.searchElementRef.nativeElement.value) : localStorage.removeItem('cityName');
    this.getWeatherDetails();
  }

  getWeatherDetailstwo(){
    this.secondsearchElementRef.nativeElement.value ? localStorage.setItem('cityName', this.secondsearchElementRef.nativeElement.value) : localStorage.removeItem('cityName');
    this.getWeatherDetails();
  }
  
  getWeatherDetailsthree(){
    this.thirdearchElementRef.nativeElement.value ? localStorage.setItem('cityName', this.thirdearchElementRef.nativeElement.value) : localStorage.removeItem('cityName');
    this.getWeatherDetails();
  }

  getWeatherDetails() {
    
    this.weatherReports = [];
    let weatherReports = [];
    this.city = '';   
    let location = this.autocomplete && this.autocomplete.getPlace()? this.autocomplete.getPlace(): {name : this.search};
    let geocoder = new google.maps.Geocoder();
    if (location && location['geometry'])  {
      this.lat = location['geometry']['location'].lat();
      this.lng = location['geometry']['location'].lng();      
      this.address = location.formatted_address;      
    } else {
      this.address = location.name;    
    }

    geocoder.geocode( { 'address': this.address}, (results, status) =>{
      if (status == google.maps.GeocoderStatus.OK) {        
        this.lat = results[0].geometry.location.lat();
        this.lng = results[0].geometry.location.lng();
      } else {
        console.log("Something got wrong " + status);
      }
    });
      
    setTimeout(() => {
      this.httpService.getRequest('http://localhost:3000/api/getHistoricalUV?lat=' + this.lat + '&lon=' + this.lng).subscribe(data => {
        this.httpService.getRequest('http://localhost:3000/api/getForecasts?lat=' + this.lat + '&lon=' + this.lng).subscribe(forecasts => {
          this.city = forecasts.city.name;         
            forecasts.list.forEach((element, key) => {
              element.uv = data[key];
              weatherReports.push(element);
            });         
            forecasts.list[0].uv = data[0];
            weatherReports.push(forecasts.list[0]);          
        });
        setTimeout(() => {
          this.weatherReports = weatherReports;
        }, 1000);
      }); 
   },1000);
  }
  getImagePath(data) {
    return 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png';
  }
  getTemperature(data) {
    return (Math.round(data*9/5+32)) + '&deg;' + 'F';
  }
}

