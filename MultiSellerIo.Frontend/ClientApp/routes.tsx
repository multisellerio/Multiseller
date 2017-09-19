import * as React from 'react';
import { Route } from 'react-router-dom';

import Layout from './components/shared/layout/layout';
import Home from './components/home/home';
import Register from './components/account/register';
import Login from './components/account/login';
import Portal from './components/portal';

export const routes =
    <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/account/register' component={Register} />
        <Route path='/account/login' component={Login} />
        <Route path='/portal' component={Portal} />
    </Layout>;
