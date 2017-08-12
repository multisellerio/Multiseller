import * as React from 'react';
import { Route } from 'react-router-dom';
import Layout  from './components/shared/layout/layout';
import Home from './components/home/home';
import Register from './components/account/register';

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route path='/account/register' component={Register} />
</Layout>;
