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