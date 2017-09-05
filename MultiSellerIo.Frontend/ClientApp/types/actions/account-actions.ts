﻿import { Action } from 'redux';
import { IUser, ILoginRequest, IRegisterRequest, ILoginResponse } from '../../models/account-models';

export const REQUEST_USER_REGISTER: string = 'REQUEST_USER_REGISTER';
export const USER_REGISTERED: string = 'USER_REGISTERED';
export const USER_REGISTRATION_FAILED: string = 'USER_REGISTRATION_FAILED';

export const USER_LOGIN_REQUEST: string = 'USER_LOGIN_REQUEST';
export const USER_LOGIN_SUCCESS: string = 'USER_LOGING_SUCCESS';
export const USER_LOGIN_FAILED: string = 'USER_LOGIN_FAILED';

export const REQUEST_CURRENT_USER: string = 'REQUEST_CURRENT_USER';
export const GET_CURRENT_USER_SUCCESSFULLY: string = 'GET_CURRENT_USER_SUCCESSFULLY';
export const GET_CURRENT_USER_UNSUCCESSFULLY: string = 'GET_CURRENT_USER_UNSUCCESSFULLY';

/*************************
 *** REGISTER ACTIONS
 *************************/

export interface IUserRegisterRequest extends Action {
    type: typeof REQUEST_USER_REGISTER,
    payload: IRegisterRequest,
}

export interface IUserRegistered extends Action {
    type: typeof USER_REGISTERED,
    payload: IUser,
}

export interface IUserRegistrationFailed extends Action {
    type: typeof USER_REGISTRATION_FAILED,
    payload: string,
}

/*************************
 *** LOGIN ACTIONS
 *************************/

export interface IUserLoginRequest extends Action {
    type: typeof USER_LOGIN_REQUEST,
    payload: ILoginRequest,
}

export interface IUserLoginSuccess extends Action {
    type: typeof USER_LOGIN_SUCCESS,
    payload: ILoginResponse,
}

export interface IUserLoginFailed extends Action {
    type: typeof USER_LOGIN_FAILED,
    payload: string,
}

/*************************
 *** CURRENT USER
 *************************/

export interface IRequestCurrentUser extends Action {
    type: typeof REQUEST_CURRENT_USER,
}

export interface IGetCurrentUserSuccessfully extends Action {
    type: typeof GET_CURRENT_USER_SUCCESSFULLY,
    payload: IUser,
}

export interface IGetCurrentUserUnsuccessfully extends Action {
    type: typeof GET_CURRENT_USER_UNSUCCESSFULLY,
}