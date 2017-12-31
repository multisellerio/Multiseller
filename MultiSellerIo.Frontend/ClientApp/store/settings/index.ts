import { addTask } from "domain-task";
import { push, RouterAction } from "react-router-redux";
import { Reducer } from "redux";
import { UserService } from "../../api/user";
import { StoreService } from "../../api/store";
import { IUser, IUpdateUserRequest } from '../../models/account-models';
import { IStoreModel, IShippingCostModel } from '../../models/store-models';
import {
    REQUEST_PROFILE, RECEIVED_PROFILE_SUCCESSFULLY, RECEIVED_PROFILE_UNSUCCESSFULLY,
    IRequestProfile, IRequestProfileSuccessfully, IRequestProfileUnsuccessfully,
    REQUEST_UPDATE_PROFILE, PROFILE_UPDATE_SUCCESFULLY, PROFILE_UPDATE_UNSUCCESSFULLY,
    IRequestUpdateProfile, IProfileUpdateSuccessfully, IProfileUpdateUnSuccesfully,
    REQUEST_STORE, RECEIVED_STORE_SUCCESSFULLY, RECEIVED_STORE_UNSUCCESSFULLY,
    IRequestStore, IReceivedStoreSuccessfully, IReceivedStoreUnsuccesfully,
    REQUEST_UPDATE_STORE, UPDATE_STORE_SUCCESSFULLY, UPDATE_STORE_UNSUCCESSFULLY,
    IRequestUpdateStore, IUpdateStoreSuccessfully, IUpdateStoreUnsuccessfully,
    REQUEST_UPDATE_SHIPPING, UPDATE_SHIPPING_SUCCESSFULLY, UPDATE_SHIPPING_UNSUCCESSFULL,
    IRequestUpdateShipping, IUpdateShippingSuccessfully, IUpdateShippingUnsuccessfully
} from "../../types/actions/settings-actions";
import { GET_CURRENT_USER_SUCCESSFULLY } from "../../types/actions/account-actions";
import { CallBackMessageType } from "../../models/common-models";
import { DISPLAY_MESSAGE } from "../../types/actions/common-actions";
import { AppThunkAction } from ".././";
import * as _ from 'lodash';

/*************************
 *** STORE
 *************************/

export interface IProfileState {
    loading: boolean;
    saving: boolean;
    data: IUser;
    error: string;
}

export interface IStoreState {
    loading: boolean;
    saving: boolean;
    data: IStoreModel;
    error: string;
}

export interface ISettingsState {
    profile: IProfileState,
    store: IStoreState,
}

/*************************
 *** ACTION CREATORS
 *************************/

type KnownAction = IRequestProfile | IRequestProfileSuccessfully | IRequestProfileUnsuccessfully
    | IRequestUpdateProfile | IProfileUpdateSuccessfully | IProfileUpdateUnSuccesfully
    | IRequestStore | IReceivedStoreSuccessfully | IReceivedStoreUnsuccesfully
    | IRequestUpdateStore | IUpdateStoreSuccessfully | IUpdateStoreUnsuccessfully
    | IRequestUpdateShipping | IUpdateShippingSuccessfully | IUpdateShippingUnsuccessfully
    | RouterAction;

export const actionCreator = {
    getProfile: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {

        dispatch({ type: REQUEST_PROFILE });

        const fetchProfileTask = async () => {
            try {
                var result = await UserService.getProfile();
                dispatch({ type: RECEIVED_PROFILE_SUCCESSFULLY, payload: result });
            } catch (err) {
                dispatch({ type: RECEIVED_PROFILE_UNSUCCESSFULLY, payload: err.message });
            }
        }

        addTask(fetchProfileTask());
    },

    updateProfile: (request: IUpdateUserRequest): AppThunkAction<KnownAction> => async (dispatch, getState) => {

        dispatch({ type: REQUEST_UPDATE_PROFILE });

        try {
            var result = await UserService.updateProfile(request);
            dispatch({ type: PROFILE_UPDATE_SUCCESFULLY, payload: result });
            dispatch({ type: GET_CURRENT_USER_SUCCESSFULLY, payload: result });
            dispatch({ type: DISPLAY_MESSAGE, payload: { message: 'Profile updated successfully', type: CallBackMessageType.Success }});
        } catch (err) {
            dispatch({ type: PROFILE_UPDATE_UNSUCCESSFULLY, payload: err.message });
            dispatch({ type: DISPLAY_MESSAGE, payload: { message: err.message, type: CallBackMessageType.Error }});
        }

    },

    getStore: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {

        dispatch({ type: REQUEST_STORE });

        try {
            var result = await StoreService.getStore();
            dispatch({ type: RECEIVED_STORE_SUCCESSFULLY, payload: result });
        } catch (err) {
            dispatch({ type: RECEIVED_STORE_UNSUCCESSFULLY, payload: err.message });
            dispatch({ type: DISPLAY_MESSAGE, payload: { message: err.message, type: CallBackMessageType.Error }});
        }

    },

    updateStore: (store: IStoreModel): AppThunkAction<KnownAction> => async (dispatch, getState) => {

        dispatch({ type: REQUEST_UPDATE_STORE });

        try {
            var result = await StoreService.updateStore(store);
            dispatch({ type: UPDATE_STORE_SUCCESSFULLY, payload: result });
            dispatch({ type: DISPLAY_MESSAGE, payload: { message: 'Store updated successfully', type: CallBackMessageType.Success }});
        } catch (err) {
            dispatch({ type: UPDATE_STORE_UNSUCCESSFULLY, payload: err.message });
            dispatch({ type: DISPLAY_MESSAGE, payload: { message: err.message, type: CallBackMessageType.Error }});
        }


    },

    updateShipping: (shippings: IShippingCostModel[]): AppThunkAction<KnownAction> => async (dispatch, getState) => {

        dispatch({ type: REQUEST_UPDATE_SHIPPING });

        try {
            var result = await StoreService.updateShipping(shippings);
            dispatch({ type: DISPLAY_MESSAGE, payload: { message: 'Shipping details updated successfully', type: CallBackMessageType.Success }});
            dispatch({ type: UPDATE_SHIPPING_SUCCESSFULLY, payload: result });
        } catch (err) {
            dispatch({ type: UPDATE_SHIPPING_UNSUCCESSFULL, payload: err.message });
            dispatch({ type: DISPLAY_MESSAGE, payload: { message: err.message, type: CallBackMessageType.Error }});
        }

    }
};

/*************************
 *** REDUCERS
 *************************/

const unloadedState: ISettingsState = {
    profile: {
        loading: false,
        saving: false,
        data: null,
        error: null
    },
    store: {
        loading: false,
        data: null,
        error: null,
        saving: false,
    }
}

export const reducer: Reducer<ISettingsState> = (state: ISettingsState, incomingAction: KnownAction) => {

    const action = incomingAction as KnownAction;

    switch (action.type) {
        case REQUEST_PROFILE:
            return {
                ...state,
                profile: {
                    loading: true,
                    saving: false,
                    data: state.profile.data,
                    error: null
                }
            }
        case RECEIVED_PROFILE_SUCCESSFULLY:
            let receivedProfileSuccessfully = action as IRequestProfileSuccessfully;
            return {
                ...state,
                profile: {
                    loading: false,
                    saving: false,
                    data: receivedProfileSuccessfully.payload,
                    error: null
                }
            }
        case RECEIVED_PROFILE_UNSUCCESSFULLY:
            let recievedProfileUnsuccessfully = action as IRequestProfileUnsuccessfully;
            return {
                ...state,
                profile: {
                    loading: false,
                    saving: false,
                    data: state.profile.data,
                    error: recievedProfileUnsuccessfully.payload
                }
            }
        case REQUEST_UPDATE_PROFILE:
            return {
                ...state,
                profile: {
                    loading: false,
                    saving: true,
                    data: state.profile.data,
                    error: null
                }
            }
        case PROFILE_UPDATE_SUCCESFULLY:
            let profileUpdateSuccessfullyAction = action as IProfileUpdateSuccessfully;
            return {
                ...state,
                profile: {
                    loading: false,
                    saving: false,
                    data: profileUpdateSuccessfullyAction.payload,
                    error: null
                }
            }
        case PROFILE_UPDATE_UNSUCCESSFULLY:
            let profileUpdateUnsuccessfullyAction = action as IProfileUpdateUnSuccesfully;
            return {
                ...state,
                profile: {
                    loading: false,
                    saving: false,
                    data: state.profile.data,
                    error: profileUpdateUnsuccessfullyAction.payload
                }
            }
        case REQUEST_STORE:
            return {
                ...state,
                store: {
                    loading: true,
                    saving: false,
                    data: state.store.data,
                    error: null
                }
            }
        case RECEIVED_STORE_SUCCESSFULLY:
            let receivedStoreSuccessfully = action as IReceivedStoreSuccessfully;
            return {
                ...state,
                store: {
                    loading: false,
                    saving: false,
                    data: receivedStoreSuccessfully.payload,
                    error: null
                }
            }
        case RECEIVED_STORE_UNSUCCESSFULLY:
            let recievedStoreUnsuccessfully = action as IReceivedStoreUnsuccesfully;
            return {
                ...state,
                store: {
                    loading: false,
                    saving: false,
                    data: state.store.data,
                    error: recievedStoreUnsuccessfully.payload
                }
            }
        case REQUEST_UPDATE_STORE:
            return {
                ...state,
                store: {
                    loading: false,
                    saving: true,
                    data: state.store.data,
                    error: null
                }
            }
        case UPDATE_STORE_SUCCESSFULLY:
            let updateStoreAction = action as IUpdateStoreSuccessfully;
            return {
                ...state,
                store: {
                    loading: false,
                    saving: false,
                    data: updateStoreAction.payload,
                    error: null
                }
            }
        case UPDATE_SHIPPING_UNSUCCESSFULL:
            let updateStoreUnsuccessAction = action as IUpdateShippingUnsuccessfully;
            return {
                ...state,
                store: {
                    loading: false,
                    saving: false,
                    data: state.store.data,
                    error: updateStoreUnsuccessAction.payload
                }
            }
    }

    return state || unloadedState;
};
