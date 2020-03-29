import { createStore,combineReducers } from 'redux';

//定义一个初始化的state  redux三要素之一store
const defaultState={
    input:{
        inputValue:"initial-redux"
    },
    text:{
        textValue:"默认文字"
    }
   
}
//actions的类型 redux三要素之一action
const actionsType={
    INPUT_CHANGE:"INPUT_CHANGE",
    TEXT_CHANGE:"TEXT_CHANGE"
}
//reducer定义处理数据的逻辑 redux三要素之一reducer
function inputReducer(state={},action){
    switch(action.type){
        case actionsType.INPUT_CHANGE:
            const newState=state;
            newState.inputValue=action.inputValue;
            return newState;
        default :
            return state;
    }
}

function textReducer(state={},action){

    switch(action.type){
        case actionsType.TEXT_CHANGE:
            const newState=state;
            newState.textValue=action.textValue;
            return newState;
        default :
            return state;
    }
}



let store=createStore(combineReducers({
    input:inputReducer,
    text:textReducer
}),defaultState);


export {
    store,
    actionsType
}
