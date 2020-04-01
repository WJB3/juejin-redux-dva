import  { getlist } from './../../services/index';

export default {
    namespace:"global",
    state:{
        show:true,
        data:[]
    },
    effects:{
        *getImages({payload},{call,put}){
            const response=yield call(getlist);
           
            yield put({
                type:"toggle",
                payload:{
                    data:response.data.data
                }
            })
        }
    },
    reducers:{
        toggle(state,action){
            return { ...state, ...action.payload };
        }
    },
    subscriptions:{
        listener({history,dispatch}){
            console.log(history)
            console.log(dispatch)
        }
    }
}