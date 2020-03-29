import createSagaMiddleware from 'redux-saga';
import { watcher } from './effect';

const initialState = {
    input: {
        inputValue: "initial-redux"
    },
    text: {
        textValue: "默认文字"
    },
    data:[]
}

//actions的类型 redux三要素之一action
const actionsType = {
    INPUT_CHANGE: "INPUT_CHANGE",
    TEXT_CHANGE: "TEXT_CHANGE",
    FETCH_DATA:"FETCH_DATA",
    CONCAT_DATA:"CONCAT_DATA"
}

function inputReducer(state, action) {
    switch (action.type) {
        case actionsType.INPUT_CHANGE:
            const newState = state;
            newState.inputValue = action.inputValue;
            return newState;
        default:
            return state;
    }
}

function textReducer(state, action) {
    switch (action.type) {
        case actionsType.TEXT_CHANGE:
            const newState = state;
            newState.textValue = action.textValue;
            return newState;
        default:
            return state;
    }
}

function dataReducer(state, action) {
    switch (action.type) {
        case actionsType.FETCH_DATA:
            return state;
        case actionsType.CONCAT_DATA:
            
            return action.data;
        default:
            return state;
    }
}

function compose(...funcs) {
    if (funcs.length === 1) {
      return funcs[0]
    }
    return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

function applyMiddleware(...middlewares) {
    //返回一个重写createStore的方法
    return function rewriteCreateStoreFunc(oldCreateStore) {
        //返回一个重写新的createStore
        return function newCreateStore(reducer, initState) {
            //生成store
            const store = oldCreateStore(reducer, initState);
            /*给每个 middleware 传下store，相当于 const logger = loggerMiddleware(store);*/
            /* const chain = [exception,logger]*/
            /*const chain = middlewares.map(middleware => middleware(store));*/
            const simpleStore={getState:store.getState};
            const chain=middlewares.map(middleware=>middleware(simpleStore));
            let dispatch = store.dispatch;
            /* 实现 exception(logger(dispatch))*/
            // chain.reverse().map(middleware => {
            //     dispatch = middleware(dispatch);
            // });
            dispatch = compose(...chain)(store.dispatch)
            /*2. 重写 dispatch*/
            store.dispatch = dispatch;
            return store;
        }
    }
}

function combineReducers(reducers) {
    const reducerKeys = Object.keys(reducers);
    return function (state = {}, action) {
        //生成新的state
        const nextState = {}
        //遍历执行所有的reducers，整合成为一个你的state
        for (let i = 0; i < reducerKeys.length; i++) {
            const key = reducerKeys[i];
            const reducer = reducers[key];
            /**
             * key对应的state
             */
            const previousStateForKey = state[key]
            const nextStateForKey = reducer(previousStateForKey, action)
            nextState[key] = nextStateForKey
        }
        return nextState;
    }
}

function createStore(reducer = {}, initialState, rewriteCreateStoreFunc) {

    if (typeof initState === 'function'){
        rewriteCreateStoreFunc = initState;
        initState = undefined;
    }

    /*如果有 rewriteCreateStoreFunc，那就采用新的 createStore */
    if(rewriteCreateStoreFunc){
        const newCreateStore =  rewriteCreateStoreFunc(createStore);
        return newCreateStore(reducer, initialState);
     }

    let state = initialState;
    let listeners = [];

    function subscribe(listener) {
        listeners.push(listener);
    }

    function unsubscribe(listener){
        const index=listeners.indexOf(listener);
        listeners.splice(index,1);
    }

    function dispatch(action) {
        state = reducer(initialState, action);
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i];
            listener();
        }
    }

    dispatch({ type: Symbol() })

    function getState() {
        return state;
    }

    const store = {
        getState,
        dispatch,
        subscribe,
        unsubscribe
    }

    return store;
}

/**
 * 重写action.dispatch
 */
const loggerMiddleware = (store) => (middle) => (action) => {
 
    console.log("this state", store.getState());
    middle(action);
    console.log("next state", store.getState());
}

const exceptionMiddleware = (store) => (middle) => (action) => {
    try {
        middle(action)
    } catch (err) {
        console.error('错误报告: ', err)
    }
}

const sagaMiddleware=createSagaMiddleware();

const rewriteCreateStoreFunc = applyMiddleware(exceptionMiddleware,loggerMiddleware,sagaMiddleware);

let store = createStore(combineReducers({
    input: inputReducer,
    text: textReducer,
    data:dataReducer
}), initialState,rewriteCreateStoreFunc);

sagaMiddleware.run(watcher);

export {
    store,
    actionsType
}   