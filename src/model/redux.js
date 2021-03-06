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
            const simpleStore={getState:store.getState,dispatch:store.dispatch};
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

    if (typeof initialState === 'function'){
        rewriteCreateStoreFunc = initialState;
        initialState = undefined;
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

    function replaceReducer(nextReducer) {
        reducer = nextReducer
        /*刷新一遍 state 的值，新来的 reducer 把自己的默认状态放到 state 树上去*/
        dispatch({ type: Symbol() })
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
        unsubscribe,
        replaceReducer
    }

    return store;
}
 
export  {
    createStore,
    combineReducers,
    applyMiddleware
};