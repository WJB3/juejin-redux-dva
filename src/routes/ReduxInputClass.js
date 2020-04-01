import React from 'react';
import { connect } from './../model/component';
import { INPUT_CHANGE } from './../model/action/inputAction'

class ReduxInputClass extends React.Component {

    handleChangeInput=(e)=>{
        const { handleChangeInput }=this.props;
        if(handleChangeInput){
            handleChangeInput(e)
        }
    }

    render() {

        const { input }=this.props;

        return (
            <div>
                <input value={input.inputValue} onChange={this.handleChangeInput} />
            </div>
        )

    }
}

const mapStateToProps=({input})=>{
    console.log("mapStateToProps")
    console.log(input)
    return {
        input,
        isInitial:input.inputValue==="initial-redux"
    }
};
const mapDispatchToProps=(dispatch)=>({
    handleChangeInput:(e)=>dispatch({type:INPUT_CHANGE,inputValue:e.target.value})
});

 
export default connect(mapStateToProps,mapDispatchToProps)(ReduxInputClass);

 
