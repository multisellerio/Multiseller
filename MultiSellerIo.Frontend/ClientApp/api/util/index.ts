import { API_URL, getToken } from "../";
import { IStateModel, ICityModel } from "../../models/util-models";

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

            const responseData = await response.json();

            if (response.status !== 200) {
                throw new Error(responseData.error);
            }

            return responseData as IStateModel[];

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

            const responseData = await response.json();

            if (response.status !== 200) {
                throw new Error(responseData.error);
            }

            return responseData as ICityModel[];

        } catch (err) {
            throw err;
        }
    }
}