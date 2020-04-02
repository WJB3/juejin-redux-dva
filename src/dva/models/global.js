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
        
            history.listen(({ pathname }) => {
                if (pathname === '/router') {
                  console.log("当前页面在/router路径")
                }
            });
      
        }
    }
}