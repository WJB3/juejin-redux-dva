import React from 'react';
import { connect } from 'react-redux';
import { INPUT_CHANGE } from './../model/action/inputAction'


const mapStateToProps=state=>{
   
    return ({
        ...state
     })
};
const mapDispatchToProps=(dispatch)=>({
    handleChangeInput:(e)=>dispatch({type:INPUT_CHANGE,inputValue:e.target.value})
});

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

 
export default connect(mapStateToProps,mapDispatchToProps)(ReduxInputClass);

 
