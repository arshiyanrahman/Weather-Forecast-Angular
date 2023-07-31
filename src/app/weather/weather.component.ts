import { Component } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { Weatherdetails } from '../interfaces/weatherdetails';
import { Weatherdata } from '../interfaces/weatherdata';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent {

  // calling search() to by default load faridabad's climate
  ngOnInit() {
    this.search("Faridabad");
  }

  // method to trigger when enter is clicked and search() is to be called
  onEnterPressed(city: string) {
    this.search(city);
  }

  // boolean variable 'error' to check for invalid city name
  error: boolean = false;

  // variable city to which by default holds 'faridabad'
  city: string = 'Faridabad';

  // an array of objects of type Weatherdata 
  //it holds details to be presented on template file
  weatherForecast: Weatherdata[] = [];

  constructor(private weatherService: WeatherService) { }

  /**
   * search() method it does a method call getWeatherForecast() with a city name 
   * and stores forecast data in weatherForecast
   * @param cityName 
   */
  search(cityName: string) {
    if (cityName) {
      // method call to getWeatherForecast()
      this.weatherService.getWeatherForecast(cityName).subscribe(
        (data: Weatherdata[]) => {
          // assigning weather forecast data to weatherForecast
          this.weatherForecast = data;
          // assigning false to error variable because city found 
          this.error = false;
        },
        (error) => {
          // assigning true to error to display 404 city not found
          this.error = true;
        }
      );
    }
  }
}

