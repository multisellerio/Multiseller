/*************************
 *** ACCOUNT MODELS
 *************************/

export enum Gender {
    Invalid = 0,
    Male = 1,
    Female = 2,
    Unspecified = 3
}

export interface IRegisterRequest {
    id: number,
    username: string,
    password: string,
    confirmationPassword: string,
    email: string,
    firstName: string,
    lastName: string,
    gender: Gender,
}

export interface ILoginRequest {
    username: string,
    password: string,
}

export interface ILoginResponse {
    token: string,
    user: IUser,
}

export interface IUser {
    id: number,
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    gender: Gender,
}