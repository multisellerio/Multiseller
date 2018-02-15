import { API_URL, getToken, handleApiResponseError } from "../";
import { IStoreModel, IShippingCostModel } from "../../models/store-models";

export const StoreService = {

    getStore: async (): Promise<IStoreModel> => {

        try {
            let token = getToken();
            let url =API_URL + "store";
            const response = await fetch(url,
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                    method: "get"
                });

            if (response.status === 404) {
                return null;
            }

            await handleApiResponseError(response);

            const responseData = await response.json();
            return responseData as IStoreModel;

        } catch (err) {
            throw err;
        }

    },

    updateStore: async (model: IStoreModel): Promise<IStoreModel> => {
        try {
            let token = getToken();
            let url = API_URL + "store/store-policies";
            const response = await fetch(url,
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                    method: "post",
                    body: JSON.stringify(model)
                });

            await handleApiResponseError(response);

            const responseData = await response.json();
            return responseData as IStoreModel;

        } catch (err) {
            throw err;
        }
    },

    updateShipping: async (model: IShippingCostModel[]): Promise<IStoreModel> => {
        try {
            let token = getToken();
            let url = API_URL + "store/shipping";
            const response = await fetch(url,
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                    method: "post",
                    body: JSON.stringify({
                        shippingCosts: model
                    })
                });

            await handleApiResponseError(response);

            const responseData = await response.json();
            return responseData as IStoreModel;

        } catch (err) {
            throw err;
        }
    }
}