import { API_URL, getToken } from "../";
import { IProductMetaData, IProduct } from "../../models/product-models";

export const ProductService = {

    getMetaData: async (): Promise<IProductMetaData> => {
        try {
            let token = getToken();
            const response = await fetch(API_URL + "products/meta",
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                    method: "get"
                });

            const responseData = await response.json();

            if (response.status === 400 || response.status === 500) {
                throw new Error(responseData.error);
            }

            return responseData as IProductMetaData;

        } catch (err) {
            throw err;
        }
    },

    createProduct: async (product: IProduct): Promise<IProduct> => {

        try {
            let token = getToken();
            const response = await fetch(API_URL + "products",
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                    method: "post",
                    body: JSON.stringify(product)
                });

            const responseData = await response.json();

            if (response.status === 400 || response.status === 500) {
                throw new Error(responseData.error);
            }

            return responseData as IProduct;

        } catch (err) {
            throw err;
        }

    }

};
