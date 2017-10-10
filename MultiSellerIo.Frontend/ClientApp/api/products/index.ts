 import { API_URL } from "../";
 import { IProductMetaData } from "../../models/product-models";

 export const ProductService = {

    getMetaData: async (): Promise<IProductMetaData> => {
        try {

            const response = await fetch(API_URL + "products/meta",
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    method: "post",
                });

            const responseData = await response.json();

            if (response.status === 400) {
                throw new Error(responseData.error);
            }

            return responseData as IProductMetaData;

        } catch (err) {
            throw err;
        }
    },

};
