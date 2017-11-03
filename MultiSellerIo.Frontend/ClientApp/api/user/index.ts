import { API_URL, getToken } from "../";
import { ILoginRequest, ILoginResponse, IRegisterRequest, IUser, IExternalSigninMeta } from "../../models/account-models";

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

            const responseData = await response.json();

            if (response.status === 400) {
                throw new Error(responseData.error);
            }

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

            const responseData = await response.json();

            if (response.status === 400) {
                throw new Error(responseData.error);
            }

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

            const responseData = await response.json();

            if (response.status === 400) {
                throw new Error(responseData.error);
            }

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

            const responseData = await response.json();

            if (response.status === 400) {
                throw new Error(responseData.error);
            }

            return responseData as IExternalSigninMeta;

        } catch (err) {
            throw err;
        }

    }
};
