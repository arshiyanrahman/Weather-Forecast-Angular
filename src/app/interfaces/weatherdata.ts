// interface which defines the data to be shown on the template file
export interface Weatherdata {
    date : string;
    temperature:number;
    temp_min:number;
    temp_max:number;
    humidity:number;
    windSpeed:number;
    main:string;
}
