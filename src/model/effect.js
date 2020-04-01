import { call,put,takeEvery} from 'redux-saga/effects';
import { getlist } from '../services/index';
import { FETCH_DATA,CONCAT_DATA } from './action/imgAction';

/**
 * 副作用处理effects
 * 用于处理异步请求
 */
const effects={
    *fetchData({payload,callback}){
        const res=yield call(getlist,payload);   
        if(res.status===200){
            yield put({
                type:CONCAT_DATA,
                data:res.data.data,
            })
            if(callback){
                callback(res.data.data)
            }
            
        }
       
    }
}

/**
 * 异步action监听
 * dispatch对应的action时，调用对应的异步处理方式
 */
function* watcher(){
    yield takeEvery(FETCH_DATA,effects.fetchData);
}

export {
    watcher,
    effects
}