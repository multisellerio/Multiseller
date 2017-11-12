import { addTask } from "domain-task";
import { push, RouterAction } from "react-router-redux";
import { Reducer } from "redux";
import { UserService } from "../../api/user";
import { setToken } from "../../api";
import { ILoginRequest, IRegisterRequest, IUser, IResetPasswordRequest, IEmailConfirmationRequest } from "../../models/account-models";
import {
    GET_CURRENT_USER_SUCCESSFULLY, GET_CURRENT_USER_UNSUCCESSFULLY, IGetCurrentUserSuccessfully,
    IGetCurrentUserUnsuccessfully, IRequestCurrentUser, IUserLoginFailed, IUserLoginRequest,
    IUserLoginSuccess, IUserLogoff, IUserRegistered,
    IUserRegisterRequest, IUserRegistrationFailed, REQUEST_CURRENT_USER,
    REQUEST_USER_REGISTER, USER_LOGIN_FAILED, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS,
    USER_LOGOFF, USER_REGISTERED, USER_REGISTRATION_FAILED,
    SET_TOKEN, SET_EXTERNAL_LOGIN,
    ISetToken, ISetExternalLogin,
    FORGET_PASSWORD_REQUEST, FORGET_PASSWORD_REQUEST_SUCCESSFULLY, FORGET_PASSWORD_REQUEST_UNSUCCESSFULLY,
    IForgetPasswordRequest, IForgetPasswordRequestSuccessfully, IForgetPasswordRequestUnsuccessfully,
    REQUEST_RESET_PASSWORD, RESET_PASSWORD_SUCCESSFULLY, RESET_PASSWORD_UNSUCCESSFULLY,
    IRequestResetPassword, IResetPasswordSuccessfully, IResetPasswordUnsuccessfully,
    REQUEST_SEND_EMAIL_CONFIRMATION, SEND_EMAIL_CONFIRMATION_SUCCESSFULLY, SEND_EMAIL_CONFIRMATION_UNSUCCESSFULLY,
    IRequestSendEmailConfirmation, ISendEmailConfirmationSuccess, ISendEmailConfirmationUnsuccess,
    REQUEST_EMAIL_CONFIRMATION, EMAIL_CONFIRMATION_SUCCESSFULLY, EMAIL_CONFIRMATION_UNSUCCESSFULLY,
    IRequestEmailConfirmation, IEmailConfirmationSuccess, IEmailConfirmationUnsuccess
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

export interface IResetPasswordState {
    isLoading: boolean;
    message: string;
    success: boolean;
}

export interface IForgetPasswordState {
    isLoading: boolean;
    message: string;
    success: boolean;
}

export interface IEmailConfirmationRequestState {
    isLoading: boolean;
    message: string;
    success: boolean;
}

export interface IEmailConfirmationState {
    isLoading: boolean;
    message: string;
    success: boolean;
}

export interface IAccountState {
    isLoading: boolean;
    errorMessage: string;
    isAuthorize: boolean;
    token: string;
    user: IUser;
    externalLogin: IExternalLogin;
    resetPasswordState: IResetPasswordState;
    forgetPasswordState: IForgetPasswordState;
    emailConfirmationRequestState: IEmailConfirmationRequestState;
    emailConfirmationState: IEmailConfirmationState;
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
    IForgetPasswordRequest |
    IForgetPasswordRequestSuccessfully |
    IForgetPasswordRequestUnsuccessfully |
    IRequestResetPassword |
    IResetPasswordSuccessfully |
    IResetPasswordUnsuccessfully |
    IRequestSendEmailConfirmation |
    ISendEmailConfirmationSuccess |
    ISendEmailConfirmationUnsuccess |
    IRequestEmailConfirmation |
    IEmailConfirmationSuccess |
    IEmailConfirmationUnsuccess |

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
                dispatch({ type: SET_EXTERNAL_LOGIN, payload: externalLoginMeta });
            } catch (err) {
                console.log(err);
            }
        };

        addTask(getExternalLogin());

    },
    forgetPassword: (email: string): AppThunkAction<KnownAction> => async (dispatch, getState) => {

        dispatch({ type: FORGET_PASSWORD_REQUEST, payload: email });

        const resetPasswordRequestTask = async () => {
            try {
                await UserService.forgetPassword(email);
                dispatch({ type: FORGET_PASSWORD_REQUEST_SUCCESSFULLY });
            } catch (err) {
                dispatch({ type: FORGET_PASSWORD_REQUEST_UNSUCCESSFULLY, payload: err.message });
            }
        };

        addTask(resetPasswordRequestTask());

    },
    resetPassword: (request: IResetPasswordRequest): AppThunkAction<KnownAction> => async (dispatch, getState) => {

        dispatch({ type: REQUEST_RESET_PASSWORD, payload: request });

        try {
            await UserService.resetPassword(request);
            dispatch({ type: RESET_PASSWORD_SUCCESSFULLY });
        } catch (err) {
            dispatch({ type: RESET_PASSWORD_UNSUCCESSFULLY, payload: err.message });
        }

    },
    sendEmailConfirmation: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {

        dispatch({ type: REQUEST_SEND_EMAIL_CONFIRMATION });

        try {
            await UserService.sendEmailConfirmation();
            dispatch({ type: SEND_EMAIL_CONFIRMATION_SUCCESSFULLY });
        } catch (err) {
            dispatch({ type: SEND_EMAIL_CONFIRMATION_UNSUCCESSFULLY, payload: err.message });
        }

    },
    confirmEmail: (request: IEmailConfirmationRequest): AppThunkAction<KnownAction> => async (dispatch, getState) => {

        dispatch({ type: REQUEST_EMAIL_CONFIRMATION });

        const task = async () => {
            try {
                await UserService.emailConfirmation(request);
                dispatch({ type: EMAIL_CONFIRMATION_SUCCESSFULLY });
                dispatch({ type: USER_LOGOFF });
                dispatch(push('/email-confirm'));
            } catch (err) {
                dispatch({ type: EMAIL_CONFIRMATION_UNSUCCESSFULLY, payload: err.message });
            }
        }

        addTask(task());

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
        },
        resetPasswordState: {
            isLoading: false,
            message: null,
            success: false,
        },
        forgetPasswordState: {
            isLoading: false,
            message: null,
            success: false,
        },
        emailConfirmationRequestState: {
            isLoading: false,
            message: null,
            success: false,
        },
        emailConfirmationState: {
            isLoading: false,
            message: null,
            success: false,
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
        case FORGET_PASSWORD_REQUEST:
            return {
                ...state,
                forgetPasswordState: {
                    isLoading: true,
                    message: null,
                    success: false,
                }
            }
        case FORGET_PASSWORD_REQUEST_SUCCESSFULLY:
            return {
                ...state,
                forgetPasswordState: {
                    isLoading: false,
                    message: "You will receive an email shortly with a link to reset your password",
                    success: true,
                }
            }
        case FORGET_PASSWORD_REQUEST_UNSUCCESSFULLY:
            var forgetPasswordUnsuccesfully = action as IForgetPasswordRequestUnsuccessfully;
            return {
                ...state,
                forgetPasswordState: {
                    isLoading: false,
                    message: forgetPasswordUnsuccesfully.payload,
                    success: false,
                }
            }
        case REQUEST_RESET_PASSWORD:
            return {
                ...state,
                resetPasswordState: {
                    isLoading: true,
                    message: null,
                    success: false,
                }
            }
        case RESET_PASSWORD_SUCCESSFULLY:
            return {
                ...state,
                resetPasswordState: {
                    isLoading: false,
                    message: "We've reset your password successfully. Now you'll able to use your new password for login to your account",
                    success: true,
                }
            }
        case RESET_PASSWORD_UNSUCCESSFULLY:
            var resetPasswordUnsuccesfullyAction = action as IResetPasswordUnsuccessfully;
            return {
                ...state,
                resetPasswordState: {
                    isLoading: false,
                    message: resetPasswordUnsuccesfullyAction.payload,
                    success: false,
                }
            }
        case REQUEST_SEND_EMAIL_CONFIRMATION:
            return {
                ...state,
                emailConfirmationRequestState: {
                    isLoading: true,
                    message: null,
                    success: false,
                }
            }
        case SEND_EMAIL_CONFIRMATION_SUCCESSFULLY:
            return {
                ...state,
                emailConfirmationRequestState: {
                    isLoading: false,
                    message: "Please check your inbox for confirmation email. Click the link in the mail to confirm your email address",
                    success: true,
                }
            }
        case SEND_EMAIL_CONFIRMATION_UNSUCCESSFULLY:
            var sendEmailConfirmationUnsuccess = action as ISendEmailConfirmationUnsuccess;
            return {
                ...state,
                emailConfirmationRequestState: {
                    isLoading: false,
                    message: sendEmailConfirmationUnsuccess.payload,
                    success: false,
                }
            }
        case REQUEST_EMAIL_CONFIRMATION:
            return {
                ...state,
                emailConfirmationState: {
                    isLoading: true,
                    message: null,
                    success: false,
                }
            }
        case EMAIL_CONFIRMATION_SUCCESSFULLY:
            return {
                ...state,
                emailConfirmationState: {
                    isLoading: false,
                    message: "Thank you for confirming your account. Please log again",
                    success: true,
                }
            }
        case EMAIL_CONFIRMATION_UNSUCCESSFULLY:
            let emailConfirmationUnsuccessfully = action as IEmailConfirmationUnsuccess;
            return {
                ...state,
                emailConfirmationState: {
                    isLoading: false,
                    message: emailConfirmationUnsuccessfully.payload,
                    success: false,
                }
            }
    }

    return state || unloadedState;
};
