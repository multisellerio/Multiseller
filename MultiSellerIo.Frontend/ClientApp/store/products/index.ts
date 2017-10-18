import { addTask } from "domain-task";
import { push, RouterAction } from "react-router-redux";
import { Reducer } from "redux";
import { ProductService } from "../../api/products";
import { IProductMetaData, IProduct } from "../../models/product-models";
import {
    IReceivedProductsMetaDataSuccessfully, IReceivedProductsMetaDataUnSuccessfully, IRequestProductsMetadata,
    RECEIVED_PRODUCTS_METADATA_SUCCESSFULLY, RECEIVED_PRODUCTS_METADATA_UNSUCCESSFULLY, REQUEST_PRODUCTS_METADATA,
    ICreatedProductSuccessfully, ICreatedProductUnsuccessfully, IRequestCreateProduct,
    CREATED_PRODUCT_SUCCESSFULLY, CREATED_PRODUCT_UNSUCCESSFULLY, REQUEST_CREATE_PRODUCT
} from "../../types/actions/product-actions";
import { AppThunkAction } from ".././";

/*************************
 *** STORE
 *************************/

interface IMetaData {
    metaData: IProductMetaData;
    loading: boolean;
    error: string;
}

interface ICurrentProductData {
    loading: boolean;
    error: string,
    product: IProduct,
}

export interface IProductsState {
    meta: IMetaData;
    currentProductData: ICurrentProductData;
}

/*************************
 *** ACTION CREATORS
 *************************/

type KnownAction = IRequestProductsMetadata | IReceivedProductsMetaDataSuccessfully
    | IReceivedProductsMetaDataUnSuccessfully
    | ICreatedProductSuccessfully | ICreatedProductUnsuccessfully | IRequestCreateProduct
    | RouterAction;

export const actionCreator = {

    getMetaData: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {

        dispatch({ type: REQUEST_PRODUCTS_METADATA, payload: null });

        const getMetaDataTask = async () => {
            try {

                const metadata = await ProductService.getMetaData();
                dispatch({ type: RECEIVED_PRODUCTS_METADATA_SUCCESSFULLY, payload: metadata });

            } catch (err) {
                dispatch({ type: RECEIVED_PRODUCTS_METADATA_UNSUCCESSFULLY, payload: err.message });
            }
        };

        addTask(getMetaDataTask());

    },

    addProduct: (product: IProduct): AppThunkAction<KnownAction> => async (dispatch, getState) => {

        dispatch({ type: REQUEST_CREATE_PRODUCT, payload: null });

        try {

            const response = await ProductService.createProduct(product);
            dispatch({ type: CREATED_PRODUCT_SUCCESSFULLY, payload: response });
            dispatch(push("/portal"));

        } catch (err) {

            dispatch({ type: CREATED_PRODUCT_UNSUCCESSFULLY, payload: err.message });
        }

    }

};

/*************************
 *** REDUCERS
 *************************/

const unloadedState: IProductsState = {
    meta: {
        metaData: null,
        loading: false,
        error: null
    },
    currentProductData: {
        product: null,
        loading: false,
        error: null
    }
};

export const reducer: Reducer<IProductsState> = (state: IProductsState, incomingAction: KnownAction) => {

    const action = incomingAction as KnownAction;

    switch (action.type) {
        case REQUEST_PRODUCTS_METADATA:
            return {
                ...state,
                meta: {
                    loading: true,
                    metaData: null,
                    error: null
                },
            };
        case RECEIVED_PRODUCTS_METADATA_SUCCESSFULLY:
            const successAction = action as IReceivedProductsMetaDataSuccessfully;
            return {
                ...state,
                meta: {
                    loading: false,
                    metaData: successAction.payload,
                    error: null
                },
            };
        case RECEIVED_PRODUCTS_METADATA_UNSUCCESSFULLY:
            const errorAction = action as IReceivedProductsMetaDataUnSuccessfully;
            return {
                ...state,
                meta: {
                    loading: false,
                    metaData: null,
                    error: errorAction.payload
                },
            };
        case REQUEST_CREATE_PRODUCT:
            return {
                ...state,
                currentProductData: {
                    product: null,
                    error: null,
                    loading: true,
                }
            }
        case CREATED_PRODUCT_SUCCESSFULLY:
            return {
                ...state,
                currentProductData : {
                    product: null,
                    error: null,
                    loading: false,
                }
            }
        case CREATED_PRODUCT_UNSUCCESSFULLY:
            let createdProductUnsuccessfullyAction = action as ICreatedProductUnsuccessfully;
            return {
                ...state,
                currentProductData: {
                    product: null,
                    error: createdProductUnsuccessfullyAction.payload,
                    loading: false,
                }
            }
    }

    return state || unloadedState;
};
