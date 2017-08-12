import { IUser } from '../../models/account-models';

/*************************
 *** ACCOUNT ACTIONS
 *************************/

export interface IUserRegisterRequest {
    type: 'REQUEST_USER_REGISTER',
    user: IUser,
}

export interface IUserRegistered {
    type: 'USER_REGISTERED',
    user: IUser,
}