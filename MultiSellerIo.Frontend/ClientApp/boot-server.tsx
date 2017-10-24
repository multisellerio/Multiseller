import { createServerRenderer, RenderResult } from "aspnet-prerendering";
import { createMemoryHistory } from "history";
import * as React from "react";
import { renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import { StaticRouter } from "react-router-dom";
import { replace } from "react-router-redux";
import configureStore from "./configureStore";
import { routes } from "./routes";
import { LocaleProvider } from 'antd';
import { setToken } from './api/';
import * as enUS from 'antd/lib/locale-provider/en_US';

export default createServerRenderer((params) => {
    return new Promise<RenderResult>((resolve, reject) => {

        // Get the token from parameters
        const token = params.data.token;

        setToken(token);

        const initialState = {
            account: {
                isAuthorize: false,
                token,
                isLoading: false,
                errorMessage: null,
                user: null,
            },
            products: null,
        };

        // Prepare Redux store with in-memory history, and dispatch a navigation event
        // corresponding to the incoming URL
        const store = configureStore(createMemoryHistory(), initialState);
        store.dispatch(replace(params.location));

        // Prepare an instance of the application and perform an inital render that will
        // cause any async tasks (e.g., data access) to begin
        const routerContext: any = {};
        const app = (
            <Provider store={store}>
                <LocaleProvider locale={enUS}>
                    <StaticRouter context={routerContext} location={params.location.path} children={routes} />
                </LocaleProvider>
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
