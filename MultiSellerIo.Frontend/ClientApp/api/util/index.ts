import { API_URL, getToken, handleApiResponseError } from "../";
import { IStateModel, ICityModel, ICountryModel } from "../../models/util-models";

export const UtilServices = {

    getStates: async (name: string): Promise<IStateModel[]> => {

        try {
            let token = getToken();
            let url = name ? API_URL + "util/states/1?name=" + name : API_URL + "util/states/1?name=";
            const response = await fetch(url,
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                    method: "get"
                });

            await handleApiResponseError(response);

            const responseData = await response.json();
            return responseData as IStateModel[];

        } catch (err) {
            throw err;
        }

    },

    getCountries: async (name: string): Promise<ICountryModel[]> => {

        try {
            let token = getToken();
            let url = name ? API_URL + "util/countries/?name=" + name : API_URL + "util/countries?name=";
            const response = await fetch(url,
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                    method: "get"
                });

            await handleApiResponseError(response);

            const responseData = await response.json();
            return responseData as ICountryModel[];

        } catch (err) {
            throw err;
        }

    },

    getCities: async (stateId: number, name: string): Promise<ICityModel[]> => {
        try {
            let token = getToken();
            let url = name ? API_URL + "util/cities/+" + stateId + "?name=" + name : API_URL + "util/cities/" + stateId +"?name=";
            const response = await fetch(url,
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                    method: "get"
                });

            await handleApiResponseError(response);

            const responseData = await response.json();
            return responseData as ICityModel[];

        } catch (err) {
            throw err;
        }
    }
}