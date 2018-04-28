import { API_URL, getToken, handleApiResponseError } from "../";
import { IProductMetaData, IProduct, IProductList, IProductListRequest, IProductQuery, IProductSearchResult } from "../../models/product-models";

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

            await handleApiResponseError(response);

            const responseData = await response.json();
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

            await handleApiResponseError(response);

            const responseData = await response.json();
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

            await handleApiResponseError(response);

            const responseData = await response.json();
            return responseData as IProduct;

        } catch (err) {
            throw err;
        }

    },

    getProducts: async (productRequest: IProductListRequest): Promise<IProductList> => {
        try {
            let token = getToken();

            if (!productRequest.searchText) {
                productRequest.searchText = '';
            }

            let url =
                `${API_URL}products?searchText=${productRequest.searchText}&page=${productRequest.page}&pageSize=${
                    productRequest.pageSize}`;

            const response = await fetch(url,
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    method: "get"
                });

            await handleApiResponseError(response);

            const responseData = await response.json();
            let productList = responseData as IProductList;

            productList.searchText = productRequest.searchText;

            return productList;

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

            await handleApiResponseError(response);

            const responseData = await response.json();
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

            await handleApiResponseError(response);

        } catch (err) {
            throw err;
        }

    },

    searchProduct: async(productQuery: IProductQuery) => {

        try {

            let requestUrl = `${API_URL}products/search?page=${productQuery.page}&pageSize=${productQuery.pageSize}`;

            requestUrl = `${requestUrl}&category=${productQuery.category}`;

            if (productQuery.priceMax) {
                requestUrl = `${requestUrl}&priceMax=${productQuery.priceMax}`;
            }

            if (productQuery.vendors && productQuery.vendors.length > 0) {
                requestUrl = `${requestUrl}&vendors=${productQuery.vendors.join(',')}`;
            }

            if (productQuery.priceMin) {
                requestUrl = `${requestUrl}&priceMin=${productQuery.priceMin}`;
            }

            if (productQuery.priceMax) {
                requestUrl = `${requestUrl}&priceMin=${productQuery.priceMin}`;
            }

            if (productQuery.attributeValues && productQuery.attributeValues.length > 0) {
                requestUrl = `${requestUrl}&attributeValues=${productQuery.attributeValues.join(',')}`;
            }

            const response = await fetch(requestUrl,
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    method: "get"
                });

            await handleApiResponseError(response);

            const responseData = await response.json();
            return responseData as IProductSearchResult;

        } catch (err) {
            throw err;
        }

    }

};
