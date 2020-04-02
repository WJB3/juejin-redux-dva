import { createHashHistory  } from 'history';//一个history库，库里面有各种方法帮助我们实现history
import * as routerRedux from 'react-router-redux';
import { routerMiddleware, connectRouter, ConnectedRouter } from 'connected-react-router';
import { createStore,combineReducers,applyMiddleware } from '../model/redux';
import { Link } from 'react-router-dom';
import { Provider,connect,ReactReduxContext } from '../model/component';
import createSagaMiddleware from 'redux-saga';
//saga的功能 call请求 put触发action select选择等等
import * as sagaEffects from 'redux-saga/effects';
import React from 'react';
import ReactDom from 'react-dom';
import Plugin, { filterHooks } from './plugins/plugin';

//废弃
function __prefix(model){
  
    let allReducers=model.reducers;
    let reducers=Object.keys(allReducers).reduce((prev,next)=>{
        let newkey=model.namespace+"/"+next;
        prev[newkey]=allReducers[next];
        return prev;
    },{})//初始化prev为{} next为函数名
    model = { ...model, reducers }
    return model;
}


function getReducer(app,plugin){
   
    let reducers={
        router: connectRouter(app._history)
    };
 
    let extraReducers = plugin.get('extraReducers');
 
    for(let m of app._models){//m是每个model的配置
 
        reducers[m.namespace]=function(state=m.state,action){//组织每个模块的reducer 

            let allReducers=m.reducers//reducers的配置对象，里面是对象
            
            let reducer=allReducers[action.type];//是否存在reducer

            if(reducer){
                m.state=reducer(state,action);
                return reducer(state,action);
            }
      
            return state;
        }
    }
  
    return combineReducers({
        ...reducers,
        ...extraReducers
    });
}

function prefix(obj, namespace) {
    return Object.keys(obj).reduce((prev, next) => {//prev收集，next是每个函数名
        let newkey = namespace + '/' + next
        prev[newkey] = obj[next]
        return prev
    }, {})
}
 
function prefixResolve(model) {
    if (model.reducers) {
        model.reducers = prefix(model.reducers, model.namespace)
    }
    if (model.effects) {
        model.effects = prefix(model.effects, model.namespace)
    }
    return model
}
 
function prefixType(type, model) {
    if (type.indexOf('/') == -1) {//这个判断有点不严谨，可以自己再捣鼓下
        return model.namespace + '/' + type
    }
    return type//如果有前缀就不加，因为可能派发给别的model下的
}
 
function getWatcher(key, effect,model,onEffect) {//key为获取effects的名字,effect为函数
    function put(action) {
        return sagaEffects.put({ ...action, type: prefixType(action.type, model) })
    }
    return function* () {
        yield sagaEffects.takeEvery(key, function* (action) {//对action进行监控,调用下面这个saga
            if (onEffect) {
                for (const fn of onEffect) {//oneffect是数组
                    effect = fn(effect, { ...sagaEffects, put }, model, key)
                }
            }
            yield effect(action, {...sagaEffects,put})
        })
    }
}

function getSagas(app,plugin) {//遍历effects
    let sagas = []
    for (let m of app._models) {
        sagas.push(function* () {
            for (const key in m.effects) {//key就是每个函数名
                const watcher = getWatcher(key, m.effects[key],m,plugin.get("onEffect"))
                yield sagaEffects.fork(watcher) //用fork不会阻塞
            }
        })
    }
    return sagas
}
 

export default function(opt={}){
    let app={
        _models:[],
        _router:null,
        model,
        router,
        start,
        use,
        _history:opt.history||createHashHistory(),
        _store:{},
        _plugin:null
    }
 

    function use(useOption){
        app._useOption=useOption;
        app._plugin=new Plugin();
        app._plugin.use(filterHooks(useOption))
    }

    function model(m){
        let prefixmodel = prefixResolve(m)
        app._models.push(prefixmodel)
    }
    function router(router){
        app._router=router;
    }

    function createState(){
        let reducer=getReducer(app,app._plugin);
        let sagas=getSagas(app,app._plugin);
        let sagaMiddleware = createSagaMiddleware();
        let extraMiddleware=opt.onAction;
        
        app._store=createStore(reducer,applyMiddleware(routerMiddleware(app._history),sagaMiddleware,extraMiddleware));
        for(let m of app._models){
            if(m.subscriptions){
                for(let key in m.subscriptions){
                    let subscription=m.subscriptions[key];
                    subscription({history:app._history,dispatch:app._store.dispatch})
                }
            }
        }
        sagas.forEach(sagaMiddleware.run)   
        return app._store;
    }

    function start(container){
        createState()
        const { onStateChange }=opt;
        console.log(opt)
        app._store.subscribe(()=>{
            onStateChange(app._store.getState());
        })

        ReactDom.render(<Provider store={app._store} >
            <ConnectedRouter history={app._history} store={app._store} context={ReactReduxContext}>
                {app._router({app,history:app._history})}
            </ConnectedRouter>
        </Provider>,document.querySelector(container));
    
    }
    return app;
} 

export {
    connect,
    Link,
    routerRedux
}