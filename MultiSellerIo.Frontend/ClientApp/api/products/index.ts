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

    updateProduct: async (product: IProduct): Promise<IProduct> => {

        try {
            let token = getToken();
            const response = await fetch(API_URL + "products",
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                    method: "put",
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
    },

    getProduct: async (id: number): Promise<IProduct> => {

        try {
            let token = getToken();
            const response = await fetch(API_URL + "products/getbyid/" + id,
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

            return responseData as IProduct;

        } catch (err) {
            throw err;
        }

    },

    deleteProduct: async(id: number): Promise<void> => {

        try {
            let token = getToken();
            const response = await fetch(API_URL + "products/" + id,
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                    method: "delete"
                });


            if (response.status !== 200) {
                const responseData = await response.json();
                throw new Error(responseData.error);
            }

        } catch (err) {
            throw err;
        }

    }

};
