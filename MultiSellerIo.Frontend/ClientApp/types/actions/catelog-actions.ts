import { Action } from "redux";
import { IProductSearchResult } from "../../models/product-models";

export const FETCH_CATELOG_PRODUCTS: string = "FETCH_CATELOG_PRODUCTS";
export const FETCH_CATELOG_PRODUCTS_SUCCESSFULLY: string = "FETCH_CATELOG_PRODUCTS_SUCCESSFULLY";
export const FETCH_CATELOG_PRODUCTS_UNSUCCESSFULLY: string = "FETCH_CATELOG_PRODUCTS_UNSUCCESSFULLY";

export interface IFetchCatelogProducts extends Action {
    type: typeof FETCH_CATELOG_PRODUCTS
}

export interface IFetchCatelogProductsSuccessfully extends Action {
    type: typeof FETCH_CATELOG_PRODUCTS_SUCCESSFULLY;
    payload: IProductSearchResult;
}

export interface IFetchCatelogProductUnsuccessfully extends Action {
    type: typeof FETCH_CATELOG_PRODUCTS_UNSUCCESSFULLY;
    payload: string;
}

