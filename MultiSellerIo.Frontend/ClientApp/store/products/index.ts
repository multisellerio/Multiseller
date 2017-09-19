import { addTask } from 'domain-task';
import { Reducer } from 'redux';
import { push, RouterAction } from 'react-router-redux';
import { AppThunkAction } from '.././';
import { IProductMetaData } from '../../models/product-models';
import { ProductService } from '../../api/products';
import {
    IRequestProductsMetadata, IReceivedProductsMetaDataSuccessfully, IReceivedProductsMetaDataUnSuccessfully,
    REQUEST_PRODUCTS_METADATA, RECEIVED_PRODUCTS_METADATA_SUCCESSFULLY, RECEIVED_PRODUCTS_METADATA_UNSUCCESSFULLY
     } from '../../types/actions/product-actions';
import { Cookies } from '../../util/cookies';

/*************************
 *** STORE
 *************************/

export interface IProductsState {
    metaData : IProductMetaData
}


/*************************
 *** ACTION CREATORS
 *************************/

type KnownAction = IRequestProductsMetadata | IReceivedProductsMetaDataSuccessfully | IReceivedProductsMetaDataUnSuccessfully |
                   RouterAction;

export const actionCreator = {

    getMetaData: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {

        dispatch({ type: REQUEST_PRODUCTS_METADATA, payload: null });

        let getMetaDataTask = async () => {
            try {

                let metadata = await ProductService.getMetaData();
                dispatch({ type: RECEIVED_PRODUCTS_METADATA_SUCCESSFULLY, payload: metadata });

            } catch (err) {
                dispatch({ type: RECEIVED_PRODUCTS_METADATA_UNSUCCESSFULLY, payload: err.message });
            }
        }

        addTask(getMetaDataTask());

    },
    
}

/*************************
 *** REDUCERS
 *************************/

const unloadedState: IProductsState = { metaData: null };

export const reducer: Reducer<IProductsState> = (state: IProductsState, incomingAction: KnownAction) => {

    const action = incomingAction as KnownAction;

    switch (action.type) {
        case REQUEST_PRODUCTS_METADATA:
            return {
                metaData: null
            }
        case RECEIVED_PRODUCTS_METADATA_SUCCESSFULLY:
            var successAction = action as IReceivedProductsMetaDataSuccessfully;
            console.log(successAction);
            return {
                metaData: successAction.payload
            };
        case RECEIVED_PRODUCTS_METADATA_UNSUCCESSFULLY:
            var errorAction = action as IReceivedProductsMetaDataSuccessfully;
            return {
                metaData: null
            }
    }

    return state || unloadedState;
};

