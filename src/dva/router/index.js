import React from 'react';
import TestReducerPage from './../routes/TestReducer';
import TestRouter from './../routes/TestRouter';
import { Route, HashRouter, Switch } from 'react-router-dom';
import { dynamic } from './../dva';

export default ({ app, history }) => {

    return (
        <HashRouter>
            <Switch>
                <Route path="/" exact component={TestReducerPage} />
                <Route path="/router" exact component={TestRouter} />
            </Switch>
        </HashRouter>
    )
}





