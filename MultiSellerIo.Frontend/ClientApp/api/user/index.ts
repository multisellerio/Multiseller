﻿import { API_URL, getToken, handleApiResponseError } from "../";
import {
    ILoginRequest, ILoginResponse, IRegisterRequest, IUser,
    IExternalSigninMeta, IResetPasswordRequest, IEmailConfirmationRequest,
    IUpdateUserRequest, IChangePasswordRequest
} from "../../models/account-models";

export const UserService = {
    registerUser: async (request: IRegisterRequest): Promise<IUser> => {

        try {

            const response = await fetch(API_URL + "account/register",
                {
                    body: JSON.stringify(request),
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    method: "post",
                });

            await handleApiResponseError(response);

            const responseData = await response.json();
            return responseData as IUser;

        } catch (err) {
            throw err;
        }
    },

    login: async (request: ILoginRequest): Promise<ILoginResponse> => {
        try {

            const response = await fetch(API_URL + "account/login",
                {
                    method: "post",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(request),

                });

            await handleApiResponseError(response);

            const responseData = await response.json();
            return responseData as ILoginResponse;

        } catch (err) {
            throw err;
        }
    },

    getCurrentUser: async (token: string): Promise<IUser> => {
        try {

            const response = await fetch(API_URL + "account/get-user",
                {
                    method: "get",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                });

            await handleApiResponseError(response);

            const responseData = await response.json();
            return responseData as IUser;

        } catch (err) {
            throw err;
        }
    },

    getProfile: async (): Promise<IUser> => {
        try {

            let token = getToken();
            const response = await fetch(API_URL + "account/get-user",
                {
                    method: "get",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                });

            await handleApiResponseError(response);

            const responseData = await response.json();
            return responseData as IUser;

        } catch (err) {
            throw err;
        }
    },

    getExternalSigninMeta: async (): Promise<IExternalSigninMeta> => {

        try {
            const response = await fetch(API_URL + "account/get-external-signin-meta",
                {
                    method: "get",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                });

            await handleApiResponseError(response);

            const responseData = await response.json();
            return responseData as IExternalSigninMeta;

        } catch (err) {
            throw err;
        }

    },

    forgetPassword: async (email: string): Promise<void> => {

        try {
            const response = await fetch(API_URL + "account/forget-password",
                {
                    method: "post",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email
                    }),
                });

            await handleApiResponseError(response);

        } catch (err) {
            throw err;
        }
        
    },

    resetPassword: async(request: IResetPasswordRequest): Promise<void> => {

        try {
            const response = await fetch(API_URL + "account/reset-password",
                {
                    method: "post",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(request),
                });

            await handleApiResponseError(response);

        } catch (err) {
            throw err;
        }

    },

    sendEmailConfirmation: async (): Promise<void> => {

        try {
            let token = getToken();
            const response = await fetch(API_URL + "account/send-email-confirmation",
                {
                    method: "post",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    }
                });

            await handleApiResponseError(response);

        } catch (err) {
            throw err;
        }

    },

    emailConfirmation: async (request: IEmailConfirmationRequest): Promise<void> => {

        try {
            const response = await fetch(API_URL + "account/email-confirmation",
                {
                    method: "post",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(request),
                });

            await handleApiResponseError(response);

        } catch (err) {
            throw err;
        }

    },

    updateProfile: async (request: IUpdateUserRequest): Promise<IUser> => {
        try {

            let token = getToken();

            const response = await fetch(API_URL + "account/update",
                {
                    method: "post",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                    body: JSON.stringify(request)
                });

            await handleApiResponseError(response);

            const responseData = await response.json();
            return responseData as IUser;

        } catch (err) {
            throw err;
        }
    },

    changePassword: async (request: IChangePasswordRequest): Promise<void> => {
        try {

            let token = getToken();

            const response = await fetch(API_URL + "account/change-password",
                {
                    method: "post",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                    body: JSON.stringify(request)
                });

            await handleApiResponseError(response);

        } catch (err) {
            throw err;
        }
    }
};
