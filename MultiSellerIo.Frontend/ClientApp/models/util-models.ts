export interface IStateModel {
    id: number;
    countryId: number;
    stateName: string;
}

export interface ICityModel {
    cityId: number;
    cityName: string;
    stateId: number;
    zipPostalCode: string;
}

export interface ICountryModel {
    countryId: number;
    countryName: string;
}