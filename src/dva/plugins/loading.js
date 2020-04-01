const SHOW="@@DVA_LOADING/SHOW";
const HIDE="@@DVA_LOADING/HIDE";
const NAMESPACE="loading";

export default function createLoading(options){
    let initialState={
        global:false,//全局
        model:{},//用来确定每个namespace是true还是false
        effects:{}//用来收集每个namespace下的effects是true还是false
    }

    const extraReducers={//这里直接把写进combineReducer的reducer准备好，键名loading
        [NAMESPACE](state=initialState,{type,payload}){
            let {namespace,actionType}=payload||{};
            switch(type){
                case SHOW:
                    return {
                        ...state,
                        global:true,
                        model:{
                            ...state.model,[namespace]:true
                        },
                        effects:{
                            ...state.effects,[actionType]:true
                        }
                    }
                case HIDE:
                    {
                        let effects={...state.effects,[actionType]:false}//这里state被show都改成true了
                        let model={
                            //然后需要检查model的effects是不是都是true
                            ...state.model,
                            [namespace]:Object.keys(effects).some(actionType=>{//查找修改完的effects
                                let _namespace=actionType.split("/")[0]//把前缀取出
                                if(_namespace!=namespace){//如果不是当前model的effects就继续
                                    return false;
                                }//用some只要有一个true就会返回，是false就继续
                                return effects[actionType]//否则就返回这个effects的true或者false
                            })
                        }
                        let global=Object.keys(model).some(namespace=>{//要有一个namespace是true那就返回
                            return model[namespace]
                        })
                        return {
                            effects,
                            model,
                            global
                        }
                    }
                default:
                    return state;
            }
        }

    }

    function onEffect(effects,{put},model,actionType){//actiontype就是带前缀的saga名
        const { namespace }=model;
        return function * (...args){
            try{//这里加上try，防止本身的effects执行挂了，然后就一直不会hide，导致整个功能失效。
                yield put({type:SHOW,payload:{namespace,actionType}});
                yield effects(...args)
            }finally{
                yield put({type:HIDE,payload:{namespace,actionType}});
            }
        }
    }

    return {
        onEffect,
        extraReducers
    }
}