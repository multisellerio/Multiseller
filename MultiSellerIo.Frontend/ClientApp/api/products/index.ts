import { API_URL, getToken } from "../";
import { IProductMetaData, IProduct, IProductList, IProductListRequest } from "../../models/product-models";

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

            if (response.status !== 200) {
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

            if (response.status !== 200) {
                throw new Error(responseData.error);
            }

            return responseData as IProduct;

        } catch (err) {
            throw err;
        }

    },

    getProducts: async (productRequest: IProductListRequest): Promise<IProductList> => {
        try {
            let token = getToken();
            const response = await fetch(`${API_URL}products?page=${productRequest.page}&pageSize=${productRequest.pageSize}`,
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    method: "get"
                });

            const responseData = await response.json();

            if (response.status !== 200) {
                throw new Error(responseData.error);
            }

            return responseData as IProductList;

        } catch (err) {
            throw err;
        }
    }

};
