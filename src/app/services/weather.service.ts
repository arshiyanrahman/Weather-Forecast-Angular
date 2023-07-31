import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Weatherdetails } from '../interfaces/weatherdetails';
import { Weatherdata } from '../interfaces/weatherdata';
import { environment } from 'src/environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class WeatherService {


  constructor(private http: HttpClient) { }

  /**
   * getWeatherForecast() method takes city name as input and fetches API reponse
   * it returns weather forecast data day wise
   * @param city 
   */
  getWeatherForecast(city: string): Observable<Weatherdata[]> {
    const apiUrl = `${environment.apiURL1}` + `${city}` + `${environment.apiURL2}` + `${environment.apiKey}`;
    return this.http.get<Weatherdetails>(apiUrl).pipe(
      map(response => this.extractWeatherData(response))
    );
  }


  /**
   * extractWeatherData() takes API response as input and processes upon it  
   * it returns weatherData of type Weatherdata (an array of objects containing weather forecast daywise)
   * @param response 
   * @returns weatherData
   */
  private extractWeatherData(response: Weatherdetails): Weatherdata[] {
    
    // weatherData to store data to be displayed in template file 
    const weatherData: Weatherdata[] = [];

    // an exmpty object which takes date as the string key 
    // and has array of temperature, humidities, windpspeed as it's nested objects 
    const dailyData: { [date: string]: { temperatures: number[]; humidities: number[]; windSpeeds: number[] } } = {};

    // iterating over the list in response
    for (const item of response.list) {

      // picking date in Unix date format and converting it to string date
      const date = new Date(item.dt * 1000).toLocaleDateString();

      // checking if dailyData object has an entry by a date
      if (!dailyData[date]) {
        // if no then add the first entry
        dailyData[date] = {
          temperatures: [item.main.temp],
          humidities: [item.main.humidity],
          windSpeeds: [item.wind.speed],
        };
      } 
      // if yes, then append the next entry to it
      else {
        dailyData[date].temperatures.push(item.main.temp);
        dailyData[date].humidities.push(item.main.humidity);
        dailyData[date].windSpeeds.push(item.wind.speed);
      }
    }

    // loop to iterate over dailyData for each date 
    for (const date in dailyData) {
      if (dailyData.hasOwnProperty(date)) {
        // retrieving weather data for particular date and assigning it to dailyWeather
        const dailyWeather = dailyData[date];

        // calculating average temp
        const averageTemperature = dailyWeather.temperatures.reduce((sum, temp) => sum + temp, 0) / dailyWeather.temperatures.length;
        
        // calculating average humidity
        const averageHumidity = dailyWeather.humidities.reduce((sum, humidity) => sum + humidity, 0) / dailyWeather.humidities.length;
        
        // calculating average windspeed
        const averageWindSpeed = dailyWeather.windSpeeds.reduce((sum, windSpeed) => sum + windSpeed, 0) / dailyWeather.windSpeeds.length;

        // finding minimum of all the temperatures
        const minTemperature = Math.min(...dailyWeather.temperatures);
        
        // finding maxmimum of all the temperatures
        const maxTemperature = Math.max(...dailyWeather.temperatures);

        // creating a new variable of type Weatherdata and assigningvalues to it 
        const weatherItem: Weatherdata = {
          date: date,
          temperature: Number(averageTemperature.toFixed(1)),
          temp_min: minTemperature,
          temp_max: maxTemperature,
          humidity: Number(averageHumidity.toFixed(1)),
          windSpeed: Number(averageWindSpeed.toFixed(1)),
          main: response.list.find((item) => new Date(item.dt * 1000).toLocaleDateString() === date)?.weather[0].main || '',
        };

        // adding forecast for that day to weatherData 
        // and proceeding to next day
        weatherData.push(weatherItem);
      }
    }

    // returning weather forecast
    return weatherData;
  }
}

