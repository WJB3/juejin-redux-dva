import React from 'react';
import ReactDom from 'react-dom';
import ReduxInputClass from './routes/ReduxInputClass';
import ReduxImgClass from './routes/ReduxImgClass';
import { Route , HashRouter,Switch } from 'react-router-dom';
import  store  from './model/index';
import { Provider } from 'react-redux';


ReactDom.render(
    <Provider store={store}>
        <HashRouter>
            <Switch>
                <Route path="/" exact component={ReduxInputClass}/> 
                <Route path="/img" component={ReduxImgClass}/>
            </Switch>
        </HashRouter>
    </Provider>
,document.getElementById("root"));