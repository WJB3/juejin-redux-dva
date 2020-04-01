import { createStore,combineReducers,applyMiddleware } from './redux';
import createSagaMiddleware from 'redux-saga';
import { watcher } from './effect';
import imgReducer from './reducer/imgReducer';
import inputReducer from './reducer/inputReducer';

let sagaMiddleware=createSagaMiddleware();

const store=createStore(combineReducers({
        img:imgReducer,
        input:inputReducer
    }),
    applyMiddleware(sagaMiddleware)
)


sagaMiddleware.run(watcher);

export default store;