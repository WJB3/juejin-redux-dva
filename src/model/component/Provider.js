import React,{Component} from "react";
import { ReactReduxContext } from './Context';

class Provider extends Component{
    // 定义一个Provider组件，以便Connect组件能够获取到store对象
    constructor(props) {
        super(props);
        this.store = props.store; // 保存通过props属性注入到Provider组件的store对象
    }

    render(){
        return(
            <ReactReduxContext.Provider value={this.store}>
                {this.props.children}
            </ReactReduxContext.Provider>
        )
    }
}

export default Provider;