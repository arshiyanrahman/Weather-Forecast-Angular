// interface defining the details being fetched from the API 
export interface Weatherdetails {
    list : {
        dt : number;
        main: {
            temp: number;
            temp_min: number;
            temp_max: number;
            humidity: number;
        };
        weather :[{
            main : string;
        }]
        wind : {
            speed : number;
        };

    }[];
    city : {
        name : string;
    }
}
