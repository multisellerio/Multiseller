import { IUser, ILoginRequest, IRegisterRequest, ILoginResponse } from '../../models/account-models';

export const REQUEST_USER_REGISTER = 'REQUEST_USER_REGISTER';
export const USER_REGISTERED = 'USER_REGISTERED';
export const USER_REGISTRATION_FAILED = 'USER_REGISTRATION_FAILED';

export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST';
export const USER_LOGIN_SUCCESS = 'USER_LOGING_SUCCESS';
export const USER_LOGIN_FAILED = 'USER_LOGIN_FAILED';

export const REQUEST_CURRENT_USER = 'REQUEST_CURRENT_USER';
export const GET_CURRENT_USER_SUCCESSFULLY = 'GET_CURRENT_USER_SUCCESSFULLY';
export const GET_CURRENT_USER_UNSUCCESSFULLY = 'GET_CURRENT_USER_UNSUCCESSFULLY';

/*************************
 *** REGISTER ACTIONS
 *************************/

export interface IUserRegisterRequest {
    type: REQUEST_USER_REGISTER,
    request: IRegisterRequest,
}

export interface IUserRegistered {
    type: USER_REGISTERED,
    user: IUser,
}

export interface IUserRegistrationFailed {
    type: USER_REGISTRATION_FAILED,
    message: string,
}

/*************************
 *** LOGIN ACTIONS
 *************************/

export interface IUserLoginRequest {
    type: USER_LOGIN_REQUEST,
    request: ILoginRequest,
}

export interface IUserLoginSuccess {
    type: USER_LOGIN_SUCCESS,
    response: ILoginResponse,
}

export interface IUserLoginFailed {
    type: USER_LOGIN_FAILED,
    message: string,
}

/*************************
 *** CURRENT USER
 *************************/

export interface IRequestCurrentUser {
    type: REQUEST_CURRENT_USER,
}

export interface IGetCurrentUserSuccessfully {
    type: GET_CURRENT_USER_SUCCESSFULLY,
    user: IUser,
}

export interface IGetCurrentUserUnsuccessfully {
    type: GET_CURRENT_USER_UNSUCCESSFULLY,
}