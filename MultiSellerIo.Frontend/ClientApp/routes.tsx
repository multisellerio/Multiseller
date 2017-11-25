import * as React from "react";
import { Route } from "react-router-dom";

import ExternalLogin from "./components/external-login";
import EmailConfirm from "./components/email-confirm";
import Login from "./components/account/login";
import Register from "./components/account/register";
import ResetPassword from "./components/account/reset-password";
import ForgetPassword from "./components/account/reset-password/forget";
import Products from "./components/products";
import Home from "./components/home/home";
import Portal from "./components/portal";
import Layout from "./components/shared/layout/layout";


export const routes =
    <Layout>
        <Route exact path="/" component={Home} />
        <Route exact path="/external-login" component={ExternalLogin} />
        <Route exact path="/email-confirm" component={EmailConfirm} />
        <Route exact path="/account/reset-password" component={ResetPassword} />
        <Route exact path="/account/forget" component={ForgetPassword} />
        <Route path="/products/:category" component={Products} />
        <Route path="/account/register" component={Register} />
        <Route path="/account/login" component={Login} />
        <Route path="/portal" component={Portal} />
    </Layout>;
