 import { addTask } from "domain-task";
 import { push, RouterAction } from "react-router-redux";
 import { Reducer } from "redux";
 import { ProductService } from "../../api/products";
 import { IProductMetaData } from "../../models/product-models";
 import {
    IReceivedProductsMetaDataSuccessfully, IReceivedProductsMetaDataUnSuccessfully, IRequestProductsMetadata,
    RECEIVED_PRODUCTS_METADATA_SUCCESSFULLY, RECEIVED_PRODUCTS_METADATA_UNSUCCESSFULLY, REQUEST_PRODUCTS_METADATA,
     } from "../../types/actions/product-actions";
 import { Cookies } from "../../util/cookies";
 import { AppThunkAction } from ".././";

/*************************
 *** STORE
 *************************/

 export interface IProductsState {
    metaData: IProductMetaData;
}

/*************************
 *** ACTION CREATORS
 *************************/

 type KnownAction = IRequestProductsMetadata | IReceivedProductsMetaDataSuccessfully
     | IReceivedProductsMetaDataUnSuccessfully | RouterAction;

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

};

/*************************
 *** REDUCERS
 *************************/

 const unloadedState: IProductsState = { metaData: null };

 export const reducer: Reducer<IProductsState> = (state: IProductsState, incomingAction: KnownAction) => {

    const action = incomingAction as KnownAction;

    switch (action.type) {
        case REQUEST_PRODUCTS_METADATA:
            return {
                metaData: null,
            };
        case RECEIVED_PRODUCTS_METADATA_SUCCESSFULLY:
            const successAction = action as IReceivedProductsMetaDataSuccessfully;
            return {
                metaData: successAction.payload,
            };
        case RECEIVED_PRODUCTS_METADATA_UNSUCCESSFULLY:
            const errorAction = action as IReceivedProductsMetaDataSuccessfully;
            return {
                metaData: null,
            };
    }

    return state || unloadedState;
};
