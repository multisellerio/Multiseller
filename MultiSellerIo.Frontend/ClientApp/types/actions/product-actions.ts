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

export const REQUEST_DELETE_PRODUCT: string = "REQUEST_DELETE_PRODUCT";
export const DELETE_SUCCESSFULLY_PRODUCT: string = "DELETE_SUCCESSFULLY_PRODUCT";
export const DELETE_UNSUCCESSFULLY_PRODUCT: string = "DELETE_UNSUCCESSFULLY_PRODUCT";

export const REQUEST_PRODUCT_DETAILS: string = "REQUEST_PRODUCT_DETAILS";
export const RECEIVED_PRODUCT_DETAILS_SUCCESSFULLY: string = "RECEIVED_PRODUCT_DETAILS_SUCCESSFULLY";
export const RECEIVED_PRODUCT_DETAILS_UNSUCCESSFULLY: string = "RECEIVED_PRODUCT_DETAILS_UNSUCCESSFULLY";


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

/*************************
 *** DELETE PRODUCT
 *************************/

export interface IRequestDeleteProduct extends Action {
    type: typeof REQUEST_DELETE_PRODUCT
}

export interface IDeleteProductSuccessfully extends Action {
    type: typeof DELETE_SUCCESSFULLY_PRODUCT
}

export interface IDeleteProductUnsuccessfully extends Action {
    type: typeof DELETE_UNSUCCESSFULLY_PRODUCT,
    payload: string,
}

/*************************
 *** REQUEST_PRODUCT_DETAILS
 *************************/

export interface IRequestProductDetails extends Action {
    type: typeof REQUEST_PRODUCT_DETAILS,
}

export interface IReceivedProductDetailsSuccessfully extends Action {
    type: typeof RECEIVED_PRODUCT_DETAILS_SUCCESSFULLY,
    payload: IProduct,
}

export interface IReceivedProductDetailsUnSuccessfully extends Action {
    type: typeof RECEIVED_PRODUCT_DETAILS_UNSUCCESSFULLY,
    payload: string,
}

