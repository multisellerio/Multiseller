import { Action } from "redux";
import { IProductMetaData, IProduct, IProductList } from "../../models/product-models";

export const REQUEST_PRODUCTS_METADATA: string = "REQUEST_PRODUCTS_METADATA";
export const RECEIVED_PRODUCTS_METADATA_SUCCESSFULLY: string = "RECEIVED_PRODUCTS_METADATA_SUCCESSFULLY";
export const RECEIVED_PRODUCTS_METADATA_UNSUCCESSFULLY: string = "RECEIVED_PRODUCTS_METADATA_UNSUCCESSFULLY";

export const REQUEST_CREATE_PRODUCT: string = "REQUEST_CREATE_PRODUCT";
export const CREATED_PRODUCT_SUCCESSFULLY: string = "CREATED_PRODUCT_SUCCESSFULLY";
export const CREATED_PRODUCT_UNSUCCESSFULLY: string = "CREATED_PRODUCT_UNSUCCESSFULLY";

export const REQUEST_PRODUCTS: string = "REQUEST_PRODUCTS";
export const RECEIVED_PRODUCTS_SUCCESSFULLY: string = "RECEIVED_PRODUCTS_SUCCESSFULLY";
export const RECEIVED_PRODUCTS_UNSUCCESSFULLY: string = "RECEIVED_PRODUCTS_UNSUCCESSFULLY";

export const FETCH_PRODUCT: string = "FETCH_PRODUCT";
export const FETCH_PRODUCT_SUCCESSFULLY = "FETCH_PRODUCT_SUCCESSFULLY";
export const FETCH_PRODUCT_UNSUCCESSFULLY = "FETCH_PRODUCT_UNSUCCESSFULLY";

export const UPDATE_PRODUCT: string = "UPDATE_PRODUCT";
export const UPDATE_PRODUCT_SUCCESSFULLY = "UPDATE_PRODUCT_SUCCESSFULLY";
export const UPDATE_PRODUCT_UNSUCCESSFULLY = "UPDATE_PRODUCT_UNSUCCESSFULLY";

/*************************
 *** PRODUCTS METADATA ACTIONS
 *************************/

 export interface IRequestProductsMetadata extends Action {
    type: typeof REQUEST_PRODUCTS_METADATA;
    payload: null;
}

 export interface IReceivedProductsMetaDataSuccessfully extends Action {
    type: typeof RECEIVED_PRODUCTS_METADATA_SUCCESSFULLY;
    payload: IProductMetaData;
}

 export interface IReceivedProductsMetaDataUnSuccessfully extends Action {
    type: typeof RECEIVED_PRODUCTS_METADATA_UNSUCCESSFULLY;
    payload: string;
}


/*************************
 *** CREATE PRODUCT ACTIONS
 *************************/

export interface IRequestCreateProduct extends Action {
    type: typeof REQUEST_CREATE_PRODUCT,
    payload: IProduct,
 }

export interface ICreatedProductSuccessfully extends Action {
    type: typeof CREATED_PRODUCT_SUCCESSFULLY,
    payload: IProduct,
}

export interface ICreatedProductUnsuccessfully extends Action {
    type: typeof CREATED_PRODUCT_UNSUCCESSFULLY,
    payload: string,
}

/*************************
 *** GET PRODUCTS ACTIONS
 *************************/

export interface IRequestProducts extends Action {
    type: typeof REQUEST_PRODUCTS,
}

export interface IReceivedProductsSuccessfully extends Action {
    type: typeof RECEIVED_PRODUCTS_SUCCESSFULLY,
    payload: IProductList,
}

export interface IReceivedProductsUnsuccessfully extends Action {
    type: typeof RECEIVED_PRODUCTS_UNSUCCESSFULLY,
    payload: string,
}

/*************************
 *** FETCH PRODUCT
 *************************/

export interface IFetchProduct extends Action {
    type: typeof FETCH_PRODUCT,
}

export interface IFetchProductSuccessfully extends Action {
    type: typeof FETCH_PRODUCT_SUCCESSFULLY,
    payload: IProduct,
}

export interface IFetchProductUnSuccessfully extends Action {
    type: typeof FETCH_PRODUCT_UNSUCCESSFULLY,
    payload: string,
}

/*************************
 *** UPDATE PRODUCT
 *************************/

export interface IUpdateProduct extends Action {
    type: typeof UPDATE_PRODUCT
}

export interface IUpdateProductSuccessfully extends Action {
    type: typeof UPDATE_PRODUCT_SUCCESSFULLY,
    payload: IProduct,
}

export interface IUpdateProductUnsuccessfully extends Action {
    type: typeof UPDATE_PRODUCT_UNSUCCESSFULLY,
    payload: string,
}