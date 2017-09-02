import { addTask } from 'domain-task';
import { Reducer } from 'redux';
import { push, RouterAction } from 'react-router-redux';
import { AppThunkAction } from '.././';
import { IRegisterRequest, ILoginRequest, IUser } from '../../models/account-models';
import { UserService } from '../../api/user';
import {
    IUserRegistered, IUserRegisterRequest, IUserRegistrationFailed,
    IUserLoginRequest, IUserLoginSuccess, IUserLoginFailed,
    IGetCurrentUserSuccessfully, IGetCurrentUserUnsuccessfully, IRequestCurrentUser,
    USER_REGISTERED, USER_REGISTRATION_FAILED, REQUEST_USER_REGISTER,
    USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGIN_FAILED,
    REQUEST_CURRENT_USER, GET_CURRENT_USER_SUCCESSFULLY, GET_CURRENT_USER_UNSUCCESSFULLY
} from '../../types/actions/account-actions';
import { Cookies } from '../../util/cookies';

/*************************
 *** STORE
 *************************/

export interface IAccountState {
    isLoading: boolean,
    errorMessage: string,
    token: string,
    user: IUser,
}


/*************************
 *** ACTION CREATORS
 *************************/

type KnownAction = IUserRegisterRequest | IUserRegistered | IUserRegistrationFailed |
    IUserLoginRequest | IUserLoginSuccess | IUserLoginFailed | RouterAction |
    IRequestCurrentUser | IGetCurrentUserSuccessfully | IGetCurrentUserUnsuccessfully

export const actionCreator = {
    userRegister: (registerRequest: IRegisterRequest): AppThunkAction<KnownAction> => async (dispatch, getState) => {

        dispatch({ type: REQUEST_USER_REGISTER, request: registerRequest });

        try {
            let responseUser = await UserService.registerUser(registerRequest);
            dispatch({ type: USER_REGISTERED, user: responseUser });
            dispatch(push('/login'));

        } catch (err) {
            dispatch({ type: USER_REGISTRATION_FAILED, message: err.message });
        }

    },
    login: (loginRequest: ILoginRequest): AppThunkAction<KnownAction> => async (dispatch, getState) => {

        dispatch({ type: USER_LOGIN_REQUEST, request: loginRequest });

        try {

            let loginResponse = await UserService.login(loginRequest);
            dispatch({ type: USER_LOGIN_SUCCESS, response: loginResponse });
            Cookies.write('ms-token', loginResponse.token);
            dispatch(push('/'));

        } catch (err) {
            dispatch({ type: USER_LOGIN_FAILED, message: err.message });
        }
    },
    getCurrentUser: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {

        var state = getState();

        if (state.account.user != null) {
            return;
        }

        let getUserTask = async () => {
            try {
                let currentUser = await UserService.getCurrentUser(state.account.token);
                dispatch({ type: GET_CURRENT_USER_SUCCESSFULLY, user: currentUser });
            } catch (err) {
                dispatch({ type: GET_CURRENT_USER_UNSUCCESSFULLY });
            }
        }

        addTask(getUserTask());

        dispatch({ type: REQUEST_CURRENT_USER });

    }
}

/*************************
 *** REDUCERS
 *************************/

const unloadedState: IAccountState = { isLoading: false, errorMessage: null, token: null, user: null };

export const reducer: Reducer<IAccountState> = (state: IAccountState, action: KnownAction) => {

    switch (action.type) {
        case REQUEST_USER_REGISTER:
            return {
                isLoading: true,
                errorMessage: null,
                token: null,
                user: null
            };
        case USER_REGISTERED:
            return {
                isLoading: false,
                errorMessage: null,
                token: null,
                user: null
            };
        case USER_REGISTRATION_FAILED:
            let userRegistrationFailedAction = action as IUserRegistrationFailed;
            return {
                isLoading: false,
                errorMessage: userRegistrationFailedAction.message,
                token: null,
                user: null
            }
        case USER_LOGIN_REQUEST:
            return {
                isLoading: true,
                errorMessage: null,
                token: null,
                user: null
            }
        case USER_LOGIN_SUCCESS:
            let userLoginSuccessAction = action as IUserLoginSuccess;
            return {
                isLoading: false,
                errorMessage: null,
                token: userLoginSuccessAction.response.token,
                user: userLoginSuccessAction.response.user
            }
        case USER_LOGIN_FAILED:
            let userLoginFailedAction = action as IUserLoginFailed;
            return {
                isLoading: false,
                errorMessage: userLoginFailedAction.message,
                token: null,
                user: null
            }
        case REQUEST_CURRENT_USER:
            return {
                isLoading: true,
                errorMessage: null,
                token: state.token,
                user: null
            }
        case GET_CURRENT_USER_SUCCESSFULLY:
            let currentUserSuccessfullyAction = action as IGetCurrentUserSuccessfully;
            return {
                isLoading: false,
                errorMessage: null,
                token: state.token,
                user: currentUserSuccessfullyAction.user
            }
        case GET_CURRENT_USER_UNSUCCESSFULLY:
            return {
                isLoading: true,
                errorMessage: null,
                token: null,
                user: null
            }
        default:
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};

