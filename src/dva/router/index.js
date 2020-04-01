import React from 'react';
import TestReducerPage from './../routes/TestReducer';
import TestRouter from './../routes/TestRouter';
import { Route , HashRouter,Switch } from 'react-router-dom';
 
export default ({app,history})=>(
    <HashRouter>
        <Switch>
            <Route path="/" exact component={TestReducerPage}/> 
            <Route path="/router" exact component={TestRouter}/> 
        </Switch>
    </HashRouter>
)
 
 
 
       
 