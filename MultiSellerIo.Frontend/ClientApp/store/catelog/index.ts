import { addTask } from "domain-task";
import { push, RouterAction } from "react-router-redux";
import { Reducer } from "redux";
import { ProductService } from "../../api/products";
import { IProductSearchResult, IProductQuery } from '../../models/product-models';
import {
    FETCH_CATELOG_PRODUCTS, FETCH_CATELOG_PRODUCTS_SUCCESSFULLY, FETCH_CATELOG_PRODUCTS_UNSUCCESSFULLY,
    IFetchCatelogProducts, IFetchCatelogProductsSuccessfully, IFetchCatelogProductUnsuccessfully,
    LOAD_MORE_CATELOG_PRODUCTS, LOAD_MORE_CATEGLOG_PRODUCTS_SUCCESSFULLY, LOAD_MORE_CATELOG_PRODUCTS_UNSUCCESSFULLY,
    ILoadMoreCatelogProducts, ILoadMoreCatelogProductsSuccessfully, ILoadMoreCatelogProductUnsuccessfully

} from "../../types/actions/catelog-actions";
import { AppThunkAction } from ".././";
import * as _ from 'lodash';

/*************************
 *** STORE
 *************************/

interface ICatelogProductsListState {
    loading: boolean;
    loadingMore: boolean;
    data: IProductSearchResult;
    query: IProductQuery;
    message: string;
}

export interface ICatelogState {
    catelogProducts: ICatelogProductsListState
}


/*************************
 *** ACTION CREATORS
 *************************/

type KnownAction =
    IFetchCatelogProducts | IFetchCatelogProductsSuccessfully | IFetchCatelogProductUnsuccessfully
    | RouterAction;

export const actionCreator = {
    getCatelogProducts: (productQuery: IProductQuery): AppThunkAction<KnownAction> => async (dispatch, getState) => {

        let state = getState();
        let currentQuery = state.catelog.catelogProducts.query;

        if (_.isEqual(currentQuery, productQuery)) {
            return;
        }

        dispatch({ type: FETCH_CATELOG_PRODUCTS, payload: productQuery });

        const fetchProductTask = async () => {
            try {
                var result = await ProductService.searchProduct(productQuery);
                dispatch({ type: FETCH_CATELOG_PRODUCTS_SUCCESSFULLY, payload: result, query: productQuery });
            } catch (err) {
                dispatch({ type: FETCH_CATELOG_PRODUCTS_UNSUCCESSFULLY, payload: err.message });
            }
        }

        addTask(fetchProductTask());
    },
    loadMoreProducts: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {

        let state = getState();
        let currentQuery = state.catelog.catelogProducts.query;

        if (currentQuery.page >= state.catelog.catelogProducts.data.products.pages) {
            return;
        }

        currentQuery.page++;

        dispatch({ type: LOAD_MORE_CATELOG_PRODUCTS, payload: currentQuery });

        try {
            var result = await ProductService.searchProduct(currentQuery);
            dispatch({ type: LOAD_MORE_CATEGLOG_PRODUCTS_SUCCESSFULLY, payload: result, query: currentQuery });
        } catch (err) {
            dispatch({ type: LOAD_MORE_CATELOG_PRODUCTS_UNSUCCESSFULLY, payload: err.message });
        }

    },
    navigationToCatelogPage: (category: string, vendors: string[],
        attributes: number[], searchText: string, priceMax?: number, priceMin?: number
    ): AppThunkAction<KnownAction> => async (dispatch, getState) => {

        let url = `/products/${category}?`;

        if (priceMax) {
            url = `${url}&maxPrice=${priceMax}`;
        }

        if (priceMin) {
            url = `${url}&minPrice=${priceMin}`;
        }

        if (vendors && vendors.length > 0) {
            url = `${url}&vendors=${vendors.join(',')}`;
        }

        if (attributes && attributes.length > 0) {
            url = `${url}&attributes=${attributes.join(',')}`;
        }

        dispatch(push(url));
    }
};

/*************************
 *** REDUCERS
 *************************/

const unloadedState: ICatelogState =
    {
        catelogProducts: {
            loading: false,
            data: null,
            query: null,
            loadingMore: false,
            message: null
        }
    };

export const reducer: Reducer<ICatelogState> = (state: ICatelogState, incomingAction: KnownAction) => {

    const action = incomingAction as KnownAction;

    switch (action.type) {
        case FETCH_CATELOG_PRODUCTS:
            return {
                ...state,
                catelogProducts: {
                    loading: true,
                    loadingMore: false,
                    data: state.catelogProducts.data,
                    query: state.catelogProducts.query,
                    message: null
                }
            }
        case FETCH_CATELOG_PRODUCTS_SUCCESSFULLY:
            var fetchProductSuccessfully = action as IFetchCatelogProductsSuccessfully;
            return {
                ...state,
                catelogProducts: {
                    loading: false,
                    loadingMore: false,
                    data: fetchProductSuccessfully.payload,
                    query: fetchProductSuccessfully.query,
                    message: null
                }
            }
        case FETCH_CATELOG_PRODUCTS_UNSUCCESSFULLY:
            var fetchProductUnsuccessfully = action as IFetchCatelogProductUnsuccessfully;
            return {
                ...state,
                catelogProducts: {
                    loading: false,
                    loadingMore: false,
                    data: state.catelogProducts.data,
                    query: state.catelogProducts.query,
                    message: fetchProductUnsuccessfully.payload
                }
            }
        case LOAD_MORE_CATELOG_PRODUCTS:
            return { ...state, catelogProducts: { ...state.catelogProducts, loadingMore: true } }
        case LOAD_MORE_CATEGLOG_PRODUCTS_SUCCESSFULLY:
            var loadMoreProductSuccessfully = action as ILoadMoreCatelogProductsSuccessfully;
            state.catelogProducts.data.products.result =
                state.catelogProducts.data.products.result.concat(loadMoreProductSuccessfully.payload.products.result);
            state.catelogProducts.data.products.currentPage = loadMoreProductSuccessfully.payload.products.currentPage;
            return {
                ...state,
                catelogProducts: {
                    loading: false,
                    loadingMore: false,
                    data: state.catelogProducts.data,
                    query: state.catelogProducts.query,
                    message: null
                }
            }
        case LOAD_MORE_CATELOG_PRODUCTS_UNSUCCESSFULLY:
            return { ...state }
    }

    return state || unloadedState;
};
