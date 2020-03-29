import React from 'react';
import { store as storeI ,actionsType as actionsTypeI} from './../utils/redux';
import {store,actionsType} from './../store/redux';

class ReduxClass extends React.Component {

    constructor(props){
        super(props);
        this.state={
            inputValue:storeI.getState().input.inputValue,
            textValue:storeI.getState().text.textValue,
            dataValue:[]
        }
        
        storeI.subscribe(function(){
            console.log("subscribe....")
        })
        storeI.unsubscribe(function(){
            console.log("unsubscribe....")
        })
    
    }


    handleChangeInput=(e)=>{
        storeI.dispatch({
            type:actionsTypeI.INPUT_CHANGE,
            inputValue:e.target.value
        })
        this.setState({
            inputValue:storeI.getState().input.inputValue
        })
    }

    handleChangeText=()=>{
        storeI.dispatch({
            type:actionsTypeI.TEXT_CHANGE,
            textValue:"改变文字的值"
        })
        this.setState({
            textValue:storeI.getState().text.textValue
        })
    }

    handleFetchData=()=>{
        storeI.dispatch({
            type:actionsTypeI.FETCH_DATA,
            callback:(res)=>{
                console.log(res)
                this.setState({
                    dataValue:res
                })
            }
        })
    }

    render() {
        const { inputValue,textValue,dataValue }=this.state;

        return (
            <div>
                <input value={inputValue} onChange={this.handleChangeInput}/>
                <p>文字：{textValue}</p>
                <button onClick={this.handleChangeText}>改变文字</button>
                <button onClick={this.handleFetchData}>获取数据</button>
                {
                    dataValue.map(item=><img width="100" height="100" key={item.id} src={item.author.avatar_url} />)
                }
            </div>
        )

    }
}

export default ReduxClass;