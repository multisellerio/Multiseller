import { API_URL, getToken } from "../";
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

            const responseData = await response.json();

            if (response.status !== 200) {
                throw new Error(responseData.error);
            }

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

            const responseData = await response.json();

            if (response.status !== 200) {
                throw new Error(responseData.error);
            }

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

            const responseData = await response.json();

            if (response.status !== 200) {
                throw new Error(responseData.error);
            }

            return responseData as IStoreModel;

        } catch (err) {
            throw err;
        }
    }
}