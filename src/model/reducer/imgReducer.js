import {FETCH_DATA,CONCAT_DATA} from './../action/imgAction'

const initialState = {
    data:[]
}


export default function dataReducer(state=initialState, action) {
   console.log(action)
    switch (action.type) {
        case FETCH_DATA:
            return state;
        case CONCAT_DATA:
            return {data:state.data.concat(action.data)}
        default:
            return state;
    }
}
