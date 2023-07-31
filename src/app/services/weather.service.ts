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
    const apiUrl = `${environment.apiURL1}` + `${city}` + `${environment.apiURL2}`;
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
    // to store forecast data to be displayed on the front end
    const weatherData: Weatherdata[] = [];

    // to store added dates
    const addedDates: string[] = [];

    //loop to traverse through the response list
    for (const item of response.list) {

      // converting date to string
      const date = new Date(item.dt * 1000).toLocaleDateString();
      
      //checking if date is a part od addedDates[]
      if (!addedDates.includes(date)) {
        // if not then adding the date 
        addedDates.push(date);
  
        // Initialize minTemp and maxTemp with current temperature
        let minTemp = item.main.temp;
        let maxTemp = item.main.temp;
  
        // traversing through response's list
        for (const tempData of response.list) {

          // converting date from Unix stamp to string
          const tempDate = new Date(tempData.dt * 1000).toLocaleDateString();

          // matching if the date found is the same date as in addedDates[]
          if (tempDate === date) {
            // Update minTemp and maxTemp if a lower or higher temperature is found for the current date
            const temp = tempData.main.temp;
            if (temp < minTemp) {
              minTemp = temp;
            }
            if (temp > maxTemp) {
              maxTemp = temp;
            }
          }
        }
        
        //declaring a variable weatherItem of type WeatherData and assigning values
        const weatherItem: Weatherdata = {
          date: date,
          temperature: item.main.temp,
          temp_min: minTemp,
          temp_max: maxTemp,
          humidity: item.main.humidity,
          windSpeed: item.wind.speed,
          main: item.weather[0].main
        };
        
        // adding that days weather to weatherData
        weatherData.push(weatherItem);
  
        if (weatherData.length === 6) {
          break; // exiting if six days data is added
        }
      }
    }
  // returning weather forecast data 
    return weatherData;
  }
  
}

