import * as React from "react";
import { Route } from "react-router-dom";

import ExternalLogin from "./components/external-login";
import Login from "./components/account/login";
import Register from "./components/account/register";
import Home from "./components/home/home";
import Portal from "./components/portal";
import Layout from "./components/shared/layout/layout";


export const routes =
    <Layout>
        <Route exact path="/" component={Home} />
        <Route exact path="/external-login" component={ExternalLogin} />
        <Route path="/account/register" component={Register} />
        <Route path="/account/login" component={Login} />
        <Route path="/portal" component={Portal} />
    </Layout>;
