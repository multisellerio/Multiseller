import { Action } from "redux";
import { IProductSearchResult, IProductQuery } from "../../models/product-models";

export const FETCH_CATELOG_PRODUCTS: string = "FETCH_CATELOG_PRODUCTS";
export const FETCH_CATELOG_PRODUCTS_SUCCESSFULLY: string = "FETCH_CATELOG_PRODUCTS_SUCCESSFULLY";
export const FETCH_CATELOG_PRODUCTS_UNSUCCESSFULLY: string = "FETCH_CATELOG_PRODUCTS_UNSUCCESSFULLY";

export const LOAD_MORE_CATELOG_PRODUCTS: string = "LOAD_MORE_CATELOG_PRODUCTS";
export const LOAD_MORE_CATEGLOG_PRODUCTS_SUCCESSFULLY: string = "LOAD_MORE_CATEGLOG_PRODUCTS_SUCCESSFULLY";
export const LOAD_MORE_CATELOG_PRODUCTS_UNSUCCESSFULLY: string = "LOAD_MORE_CATELOG_PRODUCTS_UNSUCCESSFULLY";

export interface IFetchCatelogProducts extends Action {
    type: typeof FETCH_CATELOG_PRODUCTS;
    payload: IProductQuery;
}

export interface IFetchCatelogProductsSuccessfully extends Action {
    type: typeof FETCH_CATELOG_PRODUCTS_SUCCESSFULLY;
    payload: IProductSearchResult;
    query: IProductQuery;
}

export interface IFetchCatelogProductUnsuccessfully extends Action {
    type: typeof FETCH_CATELOG_PRODUCTS_UNSUCCESSFULLY;
    payload: string;
}

export interface ILoadMoreCatelogProductsSuccessfully extends Action {
    type: typeof LOAD_MORE_CATEGLOG_PRODUCTS_SUCCESSFULLY;
    payload: IProductSearchResult;
    query: IProductQuery;
}

export interface ILoadMoreCatelogProducts extends Action {
    type: typeof LOAD_MORE_CATELOG_PRODUCTS;
    payload: IProductQuery;
}

export interface ILoadMoreCatelogProductUnsuccessfully {
    type: typeof LOAD_MORE_CATELOG_PRODUCTS_UNSUCCESSFULLY;
    payload: string;
}



