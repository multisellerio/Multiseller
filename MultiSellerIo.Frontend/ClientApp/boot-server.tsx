import { createServerRenderer, RenderResult } from "aspnet-prerendering";
import { createMemoryHistory } from "history";
import * as React from "react";
import { renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import { StaticRouter } from "react-router-dom";
import { replace } from "react-router-redux";
import configureStore from "./configureStore";
import { routes } from "./routes";
import { setToken } from './api/';

export default createServerRenderer((params) => {
    return new Promise<RenderResult>((resolve, reject) => {

        // Get the token from parameters
        const token = params.data.token;
        setToken(token);

        const isAuthorize: boolean = token != null;

        const initialState = {
            account: {
                isAuthorize: isAuthorize, 
                token: token,
                isLoading: false,
                errorMessage: null,
                user: null,
                externalLogin: {
                    facebookAuthUrl: null,
                    googleAuthUrl: null,
                    twitterAuthUrl: null
                },
                resetPasswordState: {
                    isLoading: false,
                    message: null,
                    success: false
                },
                forgetPasswordState: {
                    isLoading: false,
                    message: null,
                    success: false
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
            },
            products: null,
            catelog: null,
            settings: null,
            common: null
        };

        // Prepare Redux store with in-memory history, and dispatch a navigation event
        // corresponding to the incoming URL
        const basename = params.baseUrl.substring(0, params.baseUrl.length - 1); // Remove trailing slash
        const urlAfterBasename = params.url.substring(basename.length);
        const store = configureStore(createMemoryHistory(), initialState);
        store.dispatch(replace(urlAfterBasename));

        // Prepare an instance of the application and perform an inital render that will
        // cause any async tasks (e.g., data access) to begin
        const routerContext: any = {};
        const app = (
            <Provider store={store}>
                <StaticRouter context={routerContext} location={params.location.path} children={routes} />
            </Provider>
        );
        renderToString(app);

        // If there's a redirection, just send this information back to the host application
        if (routerContext.url) {
            resolve({ redirectUrl: routerContext.url });
            return;
        }

        // Once any async tasks are done, we can perform the final render
        // We also send the redux store state, so the client can continue execution where the server left off
        params.domainTasks.then(() => {
            resolve({
                html: renderToString(app),
                globals: { initialReduxState: store.getState() },
            });
        }, reject); // Also propagate any errors back into the host application
    });
});
