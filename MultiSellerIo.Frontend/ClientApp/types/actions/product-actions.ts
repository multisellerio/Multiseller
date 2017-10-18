import { Action } from "redux";
import { IProductMetaData, IProduct } from "../../models/product-models";

export const REQUEST_PRODUCTS_METADATA: string = "REQUEST_PRODUCTS_METADATA";
export const RECEIVED_PRODUCTS_METADATA_SUCCESSFULLY: string = "RECEIVED_PRODUCTS_METADATA_SUCCESSFULLY";
export const RECEIVED_PRODUCTS_METADATA_UNSUCCESSFULLY: string = "RECEIVED_PRODUCTS_METADATA_UNSUCCESSFULLY";

export const REQUEST_CREATE_PRODUCT: string = "REQUEST_CREATE_PRODUCT";
export const CREATED_PRODUCT_SUCCESSFULLY: string = "CREATED_PRODUCT_SUCCESSFULLY";
export const CREATED_PRODUCT_UNSUCCESSFULLY: string = "CREATED_PRODUCT_UNSUCCESSFULLY";

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
