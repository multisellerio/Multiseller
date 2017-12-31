import { Action } from "redux";
import { IUser } from "../../models/account-models";
import { IStoreModel, IShippingCostModel } from "../../models/store-models";

export const REQUEST_PROFILE: string = "REQUEST_PROFILE";
export const RECEIVED_PROFILE_SUCCESSFULLY: string = "RECEIVED_PROFILE_SUCCESSFULLY";
export const RECEIVED_PROFILE_UNSUCCESSFULLY: string = "RECEIVED_PROFILE_UNSUCCESSFULLY";

export const REQUEST_UPDATE_PROFILE = "REQUEST_UPDATE_PROFILE";
export const PROFILE_UPDATE_SUCCESFULLY = "PROFILE_UPDATE_SUCCESFULLY";
export const PROFILE_UPDATE_UNSUCCESSFULLY = "PROFILE_UPDATE_UNSUCCESSFULLY";

export const REQUEST_STORE = "REQUEST_STORE";
export const RECEIVED_STORE_SUCCESSFULLY = "RECEIVED_STORE_SUCCESSFULLY";
export const RECEIVED_STORE_UNSUCCESSFULLY = "RECEIVED_STORE_UNSUCCESSFULLY";

export const REQUEST_UPDATE_STORE = "REQUEST_UPDATE_STORE";
export const UPDATE_STORE_SUCCESSFULLY = "UPDATE_STORE_SUCCESSFULLY";
export const UPDATE_STORE_UNSUCCESSFULLY = "UPDATE_STORE_UNSUCCESSFULLY";

export const REQUEST_UPDATE_SHIPPING = "REQUEST_UPDATE_SHIPPING";
export const UPDATE_SHIPPING_SUCCESSFULLY = "UPDATE_SHIPPING_SUCCESSFULLY";
export const UPDATE_SHIPPING_UNSUCCESSFULL = "UPDATE_SHIPPING_UNSUCCESSFULL";

/*************************
 *** REQUEST PROFILE ACTIONS
 *************************/

export interface IRequestProfile extends Action {
    type: typeof REQUEST_PROFILE;
}

export interface IRequestProfileSuccessfully extends Action {
    type: typeof RECEIVED_PROFILE_SUCCESSFULLY;
    payload: IUser;
}

export interface IRequestProfileUnsuccessfully extends Action {
    type: typeof RECEIVED_PROFILE_UNSUCCESSFULLY;
    payload: string;
}

/*************************
 *** UPDATE PROFILE
 *************************/

export interface IRequestUpdateProfile extends Action {
    type: typeof REQUEST_UPDATE_PROFILE;
}

export interface IProfileUpdateSuccessfully extends Action {
    type: typeof PROFILE_UPDATE_SUCCESFULLY;
    payload: IUser;
}

export interface IProfileUpdateUnSuccesfully extends Action {
    type: typeof PROFILE_UPDATE_UNSUCCESSFULLY;
    payload: string;
}


/*************************
 *** STORE
 *************************/

export interface IRequestStore extends Action {
    type: typeof REQUEST_STORE
}

export interface IReceivedStoreSuccessfully extends Action {
    type: typeof RECEIVED_STORE_SUCCESSFULLY,
    payload: IStoreModel,

}

export interface IReceivedStoreUnsuccesfully extends Action {
    type: typeof RECEIVED_PROFILE_UNSUCCESSFULLY,
    payload: string,
}

/*************************
 *** UPDATE STORE
 *************************/

export interface IRequestUpdateStore extends Action {
    type: typeof REQUEST_UPDATE_STORE
}

export interface IUpdateStoreSuccessfully extends Action {
    type: typeof UPDATE_STORE_SUCCESSFULLY,
    payload: IStoreModel,
}

export interface IUpdateStoreUnsuccessfully extends Action {
    type: typeof UPDATE_STORE_UNSUCCESSFULLY,
    payload: string,
}

/*************************
 *** UPDATE SHIPPING
 *************************/

export interface IRequestUpdateShipping extends Action {
    type: typeof REQUEST_UPDATE_SHIPPING
}

export interface IUpdateShippingSuccessfully extends Action {
    type: typeof UPDATE_SHIPPING_SUCCESSFULLY,
    payload: IStoreModel,
}

export interface IUpdateShippingUnsuccessfully extends Action {
    type: typeof UPDATE_SHIPPING_UNSUCCESSFULL,
    payload: string,
}