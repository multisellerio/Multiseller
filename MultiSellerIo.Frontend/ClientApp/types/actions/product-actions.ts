 import { Action } from "redux";
 import { IProductMetaData } from "../../models/product-models";

 export const REQUEST_PRODUCTS_METADATA: string = "REQUEST_PRODUCTS_METADATA";
 export const RECEIVED_PRODUCTS_METADATA_SUCCESSFULLY: string = "RECEIVED_PRODUCTS_METADATA_SUCCESSFULLY";
 export const RECEIVED_PRODUCTS_METADATA_UNSUCCESSFULLY: string = "RECEIVED_PRODUCTS_METADATA_UNSUCCESSFULLY";

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
