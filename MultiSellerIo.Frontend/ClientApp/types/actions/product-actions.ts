import { Action } from 'redux';
import { IProductMetaData } from '../../models/product-models';

export const REQUEST_PRODUCTS_METADATA = "REQUEST_PRODUCTS_METADATA";
export const RECEIVED_PRODUCTS_METADATA_SUCCESSFULLY = "RECEIVED_PRODUCTS_METADATA_SUCCESSFULLY";
export const RECEIVED_PRODUCTS_METADATA_UNSUCCESSFULLY = "RECEIVED_PRODUCTS_METADATA_UNSUCCESSFULLY";

/*************************
 *** PRODUCTS METADATA ACTIONS
 *************************/

export interface IRequestProductsMetadata extends Action {
    type: typeof REQUEST_PRODUCTS_METADATA
}

export interface IReceivedProductsMetaDataSuccessfully extends Action {
    type: typeof RECEIVED_PRODUCTS_METADATA_SUCCESSFULLY,
    payload : IProductMetaData,
}

export interface IReceivedProductsMetaDataUnSuccessfully extends Action {
    type: typeof RECEIVED_PRODUCTS_METADATA_UNSUCCESSFULLY,
    payload: string,
}

