 import { API_URL } from "../";
 import { ILoginRequest, ILoginResponse, IRegisterRequest, IUser } from "../../models/account-models";

 export const UserService = {
    registerUser: async (request: IRegisterRequest): Promise<IUser> => {

        try {

            const response = await fetch(API_URL + "users/register",
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

            const response = await fetch(API_URL + "users/login",
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

            const response = await fetch(API_URL + "users",
                {
                    method: "get",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization : "Bearer " + token,
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
};
