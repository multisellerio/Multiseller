import { Reducer } from 'redux';
import { AppThunkAction } from '.././';
import { IUser } from '../../models/account-models';
import { IUserRegistered, IUserRegisterRequest } from '../../types/actions/account-actions';

/*************************
 *** STORE
 *************************/

export interface IRegisterState {
    isLoading: boolean
}


/*************************
 *** ACTION CREATORS
 *************************/

type KnownAction = IUserRegisterRequest | IUserRegistered;

export const actionCreator = {
    userRegister: (user: IUser): AppThunkAction<KnownAction> => (dispatch, getState) => {

        setTimeout(() => {
            dispatch({ type: 'USER_REGISTERED', user: user });
            console.log('Registered user');
        }, 5000);

        dispatch({ type: 'REQUEST_USER_REGISTER', user: user });
    }
}

/*************************
 *** REDUCERS
 *************************/

const unloadedState: IRegisterState = { isLoading: false };

export const reducer: Reducer<IRegisterState> = (state: IRegisterState, action: KnownAction) => {

    switch (action.type) {
        case 'REQUEST_USER_REGISTER':
            return {
                isLoading: true
            };
        case 'USER_REGISTERED':
            return {
                isLoading: false
            };
        default:
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};

