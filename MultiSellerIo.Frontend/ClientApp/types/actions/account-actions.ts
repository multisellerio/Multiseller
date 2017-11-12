import { Action } from "redux";
import { ILoginRequest, ILoginResponse, IRegisterRequest, IUser, IExternalSigninMeta, IResetPasswordRequest } from "../../models/account-models";

export const REQUEST_USER_REGISTER: string = "REQUEST_USER_REGISTER";
export const USER_REGISTERED: string = "USER_REGISTERED";
export const USER_REGISTRATION_FAILED: string = "USER_REGISTRATION_FAILED";

export const USER_LOGIN_REQUEST: string = "USER_LOGIN_REQUEST";
export const USER_LOGIN_SUCCESS: string = "USER_LOGING_SUCCESS";
export const USER_LOGIN_FAILED: string = "USER_LOGIN_FAILED";
export const USER_LOGOFF: string = "USER_LOGOFF";

export const REQUEST_CURRENT_USER: string = "REQUEST_CURRENT_USER";
export const GET_CURRENT_USER_SUCCESSFULLY: string = "GET_CURRENT_USER_SUCCESSFULLY";
export const GET_CURRENT_USER_UNSUCCESSFULLY: string = "GET_CURRENT_USER_UNSUCCESSFULLY";

export const FORGET_PASSWORD_REQUEST: string = "FORGET_PASSWORD_REQUEST";
export const FORGET_PASSWORD_REQUEST_SUCCESSFULLY: string = "FORGET_PASSWORD_REQUEST_SUCCESSFULLY";
export const FORGET_PASSWORD_REQUEST_UNSUCCESSFULLY: string = "FORGET_PASSWORD_REQUEST_UNSUCCESSFULLY";

export const REQUEST_RESET_PASSWORD: string = "REQUEST_RESET_PASSWORD";
export const RESET_PASSWORD_SUCCESSFULLY: string = "RESET_PASSWORD_SUCCESSFULLY";
export const RESET_PASSWORD_UNSUCCESSFULLY: string = "RESET_PASSWORD_UNSUCCESSFULLY";

export const REQUEST_SEND_EMAIL_CONFIRMATION: string = "REQUEST_SEND_EMAIL_CONFIRMATION";
export const SEND_EMAIL_CONFIRMATION_SUCCESSFULLY: string = "SEND_EMAIL_CONFIRMATION_SUCCESSFULLY";
export const SEND_EMAIL_CONFIRMATION_UNSUCCESSFULLY: string = "SEND_EMAIL_CONFIRMATION_UNSUCCESSFULLY";

export const REQUEST_EMAIL_CONFIRMATION: string = "REQUEST_EMAIL_CONFIRMATION";
export const EMAIL_CONFIRMATION_SUCCESSFULLY: string = "EMAIL_CONFIRMATION_SUCCESSFULLY";
export const EMAIL_CONFIRMATION_UNSUCCESSFULLY: string = "EMAIL_CONFIRMATION_UNSUCCESSFULLY";

export const SET_TOKEN = "SET_TOKEN";

export const SET_EXTERNAL_LOGIN = "SET_EXTERNAL_LOGIN";


/*************************
 *** REGISTER ACTIONS
 *************************/

export interface IUserRegisterRequest extends Action {
    type: typeof REQUEST_USER_REGISTER;
    payload: IRegisterRequest;
}

export interface IUserRegistered extends Action {
    type: typeof USER_REGISTERED;
    payload: IUser;
}

export interface IUserRegistrationFailed extends Action {
    type: typeof USER_REGISTRATION_FAILED;
    payload: string;
}

/*************************
 *** LOGIN ACTIONS
 *************************/

export interface IUserLoginRequest extends Action {
    type: typeof USER_LOGIN_REQUEST;
    payload: ILoginRequest;
}

export interface IUserLoginSuccess extends Action {
    type: typeof USER_LOGIN_SUCCESS;
    payload: ILoginResponse;
}

export interface IUserLoginFailed extends Action {
    type: typeof USER_LOGIN_FAILED;
    payload: string;
}

export interface IUserLogoff extends Action {
    type: typeof USER_LOGOFF;
}

/*************************
 *** CURRENT USER
 *************************/

export interface IRequestCurrentUser extends Action {
    type: typeof REQUEST_CURRENT_USER;
}

export interface IGetCurrentUserSuccessfully extends Action {
    type: typeof GET_CURRENT_USER_SUCCESSFULLY;
    payload: IUser;
}

export interface IGetCurrentUserUnsuccessfully extends Action {
    type: typeof GET_CURRENT_USER_UNSUCCESSFULLY;
}

/*************************
 *** SET TOKEN ACTION
 *************************/

export interface ISetToken extends Action {
    type: typeof SET_TOKEN;
    payload: string;
}

/*************************
 *** SET EXTERNAL LOGIN
 *************************/

export interface ISetExternalLogin extends Action {
    type: typeof SET_EXTERNAL_LOGIN;
    payload: IExternalSigninMeta;
}

/*************************
 *** FORGET PASSWORD
 *************************/

export interface IForgetPasswordRequest extends Action {
    type: typeof FORGET_PASSWORD_REQUEST;
    payload: string;
}

export interface IForgetPasswordRequestSuccessfully extends Action {
    type: typeof FORGET_PASSWORD_REQUEST_SUCCESSFULLY;
}

export interface IForgetPasswordRequestUnsuccessfully extends Action {
    type: typeof FORGET_PASSWORD_REQUEST_UNSUCCESSFULLY;
    payload: string;
}

/*************************
 *** RESET PASSWORD
 *************************/

export interface IRequestResetPassword extends Action {
    type: typeof REQUEST_RESET_PASSWORD;
    payload: IResetPasswordRequest;
}

export interface IResetPasswordSuccessfully extends Action {
    type: typeof RESET_PASSWORD_SUCCESSFULLY;
}

export interface IResetPasswordUnsuccessfully extends Action {
    type: typeof RESET_PASSWORD_UNSUCCESSFULLY;
    payload: string;
}

/*************************
 *** SEND EMAIL CONFIRMATION
 *************************/
export interface IRequestSendEmailConfirmation extends Action {
    type: typeof REQUEST_SEND_EMAIL_CONFIRMATION
}

export interface ISendEmailConfirmationSuccess extends Action {
    type: typeof SEND_EMAIL_CONFIRMATION_SUCCESSFULLY
}

export interface ISendEmailConfirmationUnsuccess extends Action {
    type: typeof SEND_EMAIL_CONFIRMATION_UNSUCCESSFULLY;
    payload: string;
}


/*************************
 *** EMAIL CONFIRMATION
 *************************/

export interface IRequestEmailConfirmation extends Action {
    type: typeof REQUEST_EMAIL_CONFIRMATION;
}

export interface IEmailConfirmationSuccess extends Action {
    type: typeof EMAIL_CONFIRMATION_SUCCESSFULLY;
}

export interface IEmailConfirmationUnsuccess extends Action {
    type: typeof EMAIL_CONFIRMATION_UNSUCCESSFULLY;
    payload: string;
}