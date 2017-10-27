import { addTask } from "domain-task";
import { push, RouterAction } from "react-router-redux";
import { Reducer } from "redux";
import { ProductService } from "../../api/products";
import { IProductMetaData, IProduct, IProductList, IProductListRequest } from "../../models/product-models";
import {
    IReceivedProductsMetaDataSuccessfully, IReceivedProductsMetaDataUnSuccessfully, IRequestProductsMetadata,
    RECEIVED_PRODUCTS_METADATA_SUCCESSFULLY, RECEIVED_PRODUCTS_METADATA_UNSUCCESSFULLY, REQUEST_PRODUCTS_METADATA,
    ICreatedProductSuccessfully, ICreatedProductUnsuccessfully, IRequestCreateProduct,
    CREATED_PRODUCT_SUCCESSFULLY, CREATED_PRODUCT_UNSUCCESSFULLY, REQUEST_CREATE_PRODUCT,
    REQUEST_PRODUCTS, RECEIVED_PRODUCTS_SUCCESSFULLY, RECEIVED_PRODUCTS_UNSUCCESSFULLY,
    IRequestProducts, IReceivedProductsSuccessfully, IReceivedProductsUnsuccessfully,
    FETCH_PRODUCT, FETCH_PRODUCT_SUCCESSFULLY, FETCH_PRODUCT_UNSUCCESSFULLY,
    IFetchProduct, IFetchProductSuccessfully, IFetchProductUnSuccessfully,
    UPDATE_PRODUCT, UPDATE_PRODUCT_SUCCESSFULLY, UPDATE_PRODUCT_UNSUCCESSFULLY,
    IUpdateProduct, IUpdateProductSuccessfully, IUpdateProductUnsuccessfully
} from "../../types/actions/product-actions";
import { IProductFormData } from '../../components/portal/products/product-form';
import ProductUtil from '../../util/product/product-util';
import { AppThunkAction } from ".././";
import * as _ from "lodash";

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
    error: string;
    dataLoading: boolean;
    product: IProductFormData;
}

interface ICurrentProductList {
    productList: IProductList;
    loading: boolean;
    error: string;
}

export interface IProductsState {
    meta: IMetaData;
    currentProductData: ICurrentProductData;
    productListData: ICurrentProductList;
}

/*************************
 *** ACTION CREATORS
 *************************/

type KnownAction = IRequestProductsMetadata | IReceivedProductsMetaDataSuccessfully
    | IReceivedProductsMetaDataUnSuccessfully
    | ICreatedProductSuccessfully | ICreatedProductUnsuccessfully | IRequestCreateProduct
    | IRequestProducts | IReceivedProductsSuccessfully | IReceivedProductsUnsuccessfully
    | IFetchProduct | IFetchProductSuccessfully | IFetchProductUnSuccessfully
    | IUpdateProduct | IUpdateProductSuccessfully | IUpdateProductUnsuccessfully
    | RouterAction;

export const actionCreator = {

    getMetaData: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {

        let state = getState();

        if (state.products.meta.metaData != null) {
            return;
        }

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
            dispatch(push("/portal/products"));

        } catch (err) {
            dispatch({ type: CREATED_PRODUCT_UNSUCCESSFULLY, payload: err.message });
        }

    },

    updateProduct: (product: IProduct): AppThunkAction<KnownAction> => async (dispatch, getState) => {

        dispatch({ type: UPDATE_PRODUCT, payload: null });

        try {

            const response = await ProductService.updateProduct(product);
            dispatch({ type: UPDATE_PRODUCT_SUCCESSFULLY, payload: response });
            dispatch(push("/portal/products"));

        } catch (err) {
            dispatch({ type: UPDATE_PRODUCT_UNSUCCESSFULLY, payload: err.message });
        }

    },


    getProducts: (request: IProductListRequest): AppThunkAction<KnownAction> => async (dispatch, getState) => {

        let state = getState();

        if (state.products.productListData &&
            state.products.productListData.productList &&
            state.products.productListData.productList.currentPage === request.page) {
            return;
        }

        dispatch({ type: REQUEST_PRODUCTS, payload: null });

        const getProductTask = async () => {
            try {

                const productsResponse = await ProductService.getProducts(request);
                dispatch({ type: RECEIVED_PRODUCTS_SUCCESSFULLY, payload: productsResponse });

            } catch (err) {
                dispatch({ type: RECEIVED_PRODUCTS_UNSUCCESSFULLY, payload: err.message });
            }
        }

        addTask(getProductTask());

    },

    getProduct: (id: number): AppThunkAction<KnownAction> => async (dispatch, getState) => {

        dispatch({ type: FETCH_PRODUCT, payload: null });

        const getProductTask = async () => {
            try {

                const metadata = await ProductService.getMetaData();
                dispatch({ type: RECEIVED_PRODUCTS_METADATA_SUCCESSFULLY, payload: metadata });

                const product = await ProductService.getProduct(id);
                dispatch({ type: FETCH_PRODUCT_SUCCESSFULLY, payload: product });

            } catch (err) {
                dispatch({ type: FETCH_PRODUCT_UNSUCCESSFULLY, payload: err.message });
            }
        }

        addTask(getProductTask());

    },

    navigateToProductsPage: (page: number, pageSize: number): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        dispatch(push(`/portal/products?page=${page}&pageSize=${pageSize}`));
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
        error: null,
        dataLoading: false,
    },
    productListData: {
        productList: null,
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
                    loading: false,
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
                    dataLoading: false,
                }
            }
        case CREATED_PRODUCT_SUCCESSFULLY:
            return {
                ...state,
                currentProductData: {
                    product: null,
                    error: null,
                    loading: false,
                    dataLoading: false,
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
                    dataLoading: false,
                }
            }
        case REQUEST_PRODUCTS:
            return {
                ...state,
                productListData: {
                    productList: state.productListData ? state.productListData.productList : null,
                    loading: true,
                    error: null
                }
            }
        case RECEIVED_PRODUCTS_SUCCESSFULLY:
            let requestProductSuccessfullyAction = action as IReceivedProductsSuccessfully;
            return {
                ...state,
                productListData: {
                    productList: requestProductSuccessfullyAction.payload,
                    loading: false,
                    error: null
                }
            }
        case RECEIVED_PRODUCTS_UNSUCCESSFULLY:
            let requestProductUnsuccessfullyAction = action as IReceivedProductsUnsuccessfully;
            return {
                ...state,
                productListData: {
                    productList: null,
                    loading: false,
                    error: requestProductUnsuccessfullyAction.payload
                }
            }
        case FETCH_PRODUCT:
            return {
                ...state,
                currentProductData: {
                    product: null,
                    error: null,
                    loading: false,
                    dataLoading: true,
                }
            }
        case FETCH_PRODUCT_SUCCESSFULLY:

            let fetchProductAction = action as IFetchProductSuccessfully;

            return {
                ...state,
                currentProductData: {
                    product: ProductUtil.toProductFormData(fetchProductAction.payload, state.meta.metaData.categories),
                    error: null,
                    loading: false,
                    dataLoading: false,
                }
            }
        case FETCH_PRODUCT_UNSUCCESSFULLY:

            let fetchProductUnsuccessAction = action as IFetchProductUnSuccessfully;

            return {
                ...state,
                currentProductData: {
                    product: null,
                    error: fetchProductUnsuccessAction.payload,
                    loading: false,
                    dataLoading: false,
                }
            }
        case UPDATE_PRODUCT:

            return {
                ...state,
                currentProductData: {
                    product: state.currentProductData.product,
                    error: null,
                    loading: true,
                    dataLoading: false,
                }
            }

        case UPDATE_PRODUCT_SUCCESSFULLY:

            return {
                ...state,
                currentProductData: {
                    product: null,
                    error: null,
                    loading: false,
                    dataLoading: false,
                }
            }
        
        case UPDATE_PRODUCT_UNSUCCESSFULLY:

            let updateProductUnsuccessfully = action as IUpdateProductUnsuccessfully;

            return {
                ...state,
                currentProductData: {
                    product: null,
                    error: updateProductUnsuccessfully.payload,
                    loading: false,
                    dataLoading: false,
                }
            }
    }

    return state || unloadedState;
};