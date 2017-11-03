import { addTask } from "domain-task";
import { push, RouterAction } from "react-router-redux";
import { Reducer } from "redux";
import { UserService } from "../../api/user";
import { setToken } from "../../api";
import { ILoginRequest, IRegisterRequest, IUser } from "../../models/account-models";
import {
    GET_CURRENT_USER_SUCCESSFULLY, GET_CURRENT_USER_UNSUCCESSFULLY, IGetCurrentUserSuccessfully,
    IGetCurrentUserUnsuccessfully, IRequestCurrentUser, IUserLoginFailed, IUserLoginRequest,
    IUserLoginSuccess, IUserLogoff, IUserRegistered,
    IUserRegisterRequest, IUserRegistrationFailed, REQUEST_CURRENT_USER,
    REQUEST_USER_REGISTER, USER_LOGIN_FAILED, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS,
    USER_LOGOFF, USER_REGISTERED, USER_REGISTRATION_FAILED,
    SET_TOKEN, SET_EXTERNAL_LOGIN,
    ISetToken, ISetExternalLogin
} from "../../types/actions/account-actions";
import { Cookies } from "../../util/cookies";
import { AppThunkAction } from ".././";

/*************************
 *** STORE
 *************************/

export interface IExternalLogin {
    facebookAuthUrl: string;
    twitterAuthUrl: string;
    googleAuthUrl: string;
}

export interface IAccountState {
    isLoading: boolean;
    errorMessage: string;
    isAuthorize: boolean;
    token: string;
    user: IUser;
    externalLogin: IExternalLogin;
}

/*************************
 *** ACTION CREATORS
 *************************/

type KnownAction = IUserRegisterRequest |
    IUserRegistered |
    IUserRegistrationFailed |
    IUserLoginRequest |
    IUserLoginSuccess |
    IUserLoginFailed |
    IRequestCurrentUser |
    IGetCurrentUserSuccessfully |
    IGetCurrentUserUnsuccessfully |
    IUserLogoff |
    ISetToken |
    RouterAction;

export const actionCreator = {
    userRegister: (registerRequest: IRegisterRequest): AppThunkAction<KnownAction> => async (dispatch, getState) => {

        dispatch({ type: REQUEST_USER_REGISTER, payload: registerRequest });

        try {
            const responseUser = await UserService.registerUser(registerRequest);
            dispatch({ type: USER_REGISTERED, payload: responseUser });
            dispatch(push("/login"));

        } catch (err) {
            dispatch({ type: USER_REGISTRATION_FAILED, payload: err.message });
        }

    },
    login: (loginRequest: ILoginRequest): AppThunkAction<KnownAction> => async (dispatch, getState) => {

        dispatch({ type: USER_LOGIN_REQUEST, payload: loginRequest });

        try {

            const loginResponse = await UserService.login(loginRequest);
            dispatch({ type: USER_LOGIN_SUCCESS, payload: loginResponse });
            Cookies.write("ms-token", loginResponse.token);
            setToken(loginResponse.token);
            dispatch(push("/"));

        } catch (err) {
            dispatch({ type: USER_LOGIN_FAILED, payload: err.message });
        }
    },
    getCurrentUser: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {

        const state = getState();

        if (state.account.user != null) {
            return;
        }

        const getUserTask = async () => {
            try {
                const currentUser = await UserService.getCurrentUser(state.account.token);
                dispatch({ type: GET_CURRENT_USER_SUCCESSFULLY, payload: currentUser });
            } catch (err) {
                dispatch({ type: GET_CURRENT_USER_UNSUCCESSFULLY });
            }
        };

        addTask(getUserTask());

        dispatch({ type: REQUEST_CURRENT_USER });

    },
    logOff: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: USER_LOGOFF });
        Cookies.write("ms-token", null);
        dispatch(push("/"));
    },
    setToken: (token: string): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        dispatch({ type: SET_TOKEN, payload: token });
        actionCreator.getCurrentUser();
        dispatch(push("/"));
    },
    setExternalLogin: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {

        const getExternalLogin = async () => {
            try {
                const externalLoginMeta = await UserService.getExternalSigninMeta();
                console.log(externalLoginMeta);
                dispatch({ type: SET_EXTERNAL_LOGIN, payload: externalLoginMeta });
            } catch (err) {
                console.log(err);
            }
        };

        addTask(getExternalLogin());

    }
};

/*************************
 *** REDUCERS
 *************************/

const unloadedState: IAccountState =
    {
        isLoading: false, errorMessage: null, token: null, user: null, isAuthorize: false,
        externalLogin: {
            facebookAuthUrl: null,
            googleAuthUrl: null,
            twitterAuthUrl: null
        }
    };

export const reducer: Reducer<IAccountState> = (state: IAccountState, incomingAction: KnownAction) => {

    const action = incomingAction as KnownAction;

    switch (action.type) {
        case REQUEST_USER_REGISTER:
            return {
                ...state,
                isLoading: true,
                errorMessage: null,
                token: null,
                user: null,
                isAuthorize: false,
            };
        case USER_REGISTERED:
            return {
                ...state,
                isLoading: false,
                errorMessage: null,
                token: null,
                user: null,
                isAuthorize: false,
            };
        case USER_REGISTRATION_FAILED:
            const userRegistrationFailedAction = action as IUserRegistrationFailed;
            return {
                ...state,
                isLoading: false,
                errorMessage: userRegistrationFailedAction.payload,
                token: null,
                user: null,
                isAuthorize: false,
            };
        case USER_LOGIN_REQUEST:
            return {
                ...state,
                isLoading: true,
                errorMessage: null,
                token: null,
                user: null,
                isAuthorize: false,
            };
        case USER_LOGIN_SUCCESS:
            const userLoginSuccessAction = action as IUserLoginSuccess;
            return {
                ...state,
                isLoading: false,
                errorMessage: null,
                token: userLoginSuccessAction.payload.token,
                user: userLoginSuccessAction.payload.user,
                isAuthorize: true,
            };
        case USER_LOGIN_FAILED:
            const userLoginFailedAction = action as IUserLoginFailed;
            return {
                ...state,
                isLoading: false,
                errorMessage: userLoginFailedAction.payload,
                token: null,
                user: null,
                isAuthorize: false,
            };
        case REQUEST_CURRENT_USER:
            return {
                ...state,
                isLoading: true,
                errorMessage: null,
                token: state.token,
                user: null,
                isAuthorize: false,
            };
        case GET_CURRENT_USER_SUCCESSFULLY:
            const currentUserSuccessfullyAction = action as IGetCurrentUserSuccessfully;
            return {
                ...state,
                isLoading: false,
                errorMessage: null,
                token: state.token,
                user: currentUserSuccessfullyAction.payload,
                isAuthorize: true,
            };
        case GET_CURRENT_USER_UNSUCCESSFULLY:
            return {
                ...state,
                isLoading: false,
                errorMessage: null,
                token: null,
                user: null,
                isAuthorize: false,
            };
        case USER_LOGOFF:
            return {
                ...state,
                isLoading: false,
                errorMessage: null,
                token: null,
                user: null,
                isAuthorize: false,
            };
        case SET_TOKEN:
            const setTokenAction = action as ISetToken;
            return {
                ...state,
                isLoading: false,
                errorMessage: null,
                token: setTokenAction.payload,
                user: null,
                isAuthorize: true,
            }
        case SET_EXTERNAL_LOGIN:
            const setExternaLoginAction = action as ISetExternalLogin;
            return {
                ...state,
                externalLogin: {
                    facebookAuthUrl: setExternaLoginAction.payload.facebookAuthUrl,
                    googleAuthUrl: setExternaLoginAction.payload.googleAuthUrl,
                    twitterAuthUrl: setExternaLoginAction.payload.twitterAuthUrl
                }
            }
    }

    return state || unloadedState;
};
