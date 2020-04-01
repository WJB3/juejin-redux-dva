import {INPUT_CHANGE} from './../action/inputAction';

const initialState = {
    inputValue: "initial-redux"
}

export default function inputReducer(state=initialState, action) {
     
    switch (action.type) {
        case INPUT_CHANGE:
            const newState =  state;
            newState.inputValue = action.inputValue;
            return newState;
        default:
            return state;
    }
}