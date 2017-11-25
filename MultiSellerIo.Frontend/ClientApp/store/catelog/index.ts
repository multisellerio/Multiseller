import { addTask } from "domain-task";
import { push, RouterAction } from "react-router-redux";
import { Reducer } from "redux";
import { ProductService } from "../../api/products";
import { IProductSearchResult, IProductQuery } from '../../models/product-models';
import {
    FETCH_CATELOG_PRODUCTS, FETCH_CATELOG_PRODUCTS_SUCCESSFULLY, FETCH_CATELOG_PRODUCTS_UNSUCCESSFULLY,
    IFetchCatelogProducts, IFetchCatelogProductsSuccessfully, IFetchCatelogProductUnsuccessfully
} from "../../types/actions/catelog-actions";
import { AppThunkAction } from ".././";

/*************************
 *** STORE
 *************************/

interface ICatelogProductsListState {
    loading: boolean;
    data: IProductSearchResult;
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

        dispatch({ type: FETCH_CATELOG_PRODUCTS, payload: null });

        const fetchProductTask = async () => {
            try {
                var result = await ProductService.searchProduct(productQuery);
                dispatch({ type: FETCH_CATELOG_PRODUCTS_SUCCESSFULLY, payload: result });
            } catch (err) {
                dispatch({ type: FETCH_CATELOG_PRODUCTS_UNSUCCESSFULLY, payload: err.message });
            }
        }

        addTask(fetchProductTask());
    },
    navigationToCatelogPage: (category: string, page: number, pageSize: number, vendors: string[],
        attributes: number[], searchText: string, priceMax?: number, priceMin?: number
    ): AppThunkAction<KnownAction> => async (dispatch, getState) => {

        let url = `/products/${category}?page=${page}&pageSize=${pageSize}`;

        if (priceMax) {
            url = `${url}&priceMax=${priceMax}`;
        }

        if (priceMin) {
            url = `${url}&priceMin=${priceMin}`;
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
                    data: state.catelogProducts.data,
                    message: null
                }
            }
        case FETCH_CATELOG_PRODUCTS_SUCCESSFULLY:
            var fetchProductSuccessfully = action as IFetchCatelogProductsSuccessfully;
            return {
                ...state,
                catelogProducts: {
                    loading: false,
                    data: fetchProductSuccessfully.payload,
                    message: null
                }
            }
        case FETCH_CATELOG_PRODUCTS_UNSUCCESSFULLY:
            var fetchProductUnsuccessfully = action as IFetchCatelogProductUnsuccessfully;
            return {
                ...state,
                catelogProducts: {
                    loading: false,
                    data: state.catelogProducts.data,
                    message: fetchProductUnsuccessfully.payload
                }
            }
    }

    return state || unloadedState;
};
