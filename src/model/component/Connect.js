import React,{Component} from 'react';
import { ReactReduxContext } from './Context';

export default (mapStateToProps, mapDispatchToProps)=>(WrappedComponent)=>{
    class NewComponent extends Component{
        static contextType = ReactReduxContext;
        constructor(props){
            super(props);
        }

        UNSAFE_componentWillMount(){
            let value = this.context;
            this.updateState(value)
            value.subscribe(()=>{this.updateState(value)});
        }
      
        updateState=(store)=>{
            let stateProps = mapStateToProps
            ? mapStateToProps(store.getState(), this.props)
            : {} // 防止 mapStateToProps 没有传入
            let dispatchProps = mapDispatchToProps
            ? mapDispatchToProps(store.dispatch, this.props)
            : {} // 防止 mapDispatchToProps 没有传入
            this.setState({
                allProps: {
                  ...stateProps,
                  ...dispatchProps,
                  ...this.props,
                  dispatch:store.dispatch
                }
            })
        }

        render(){
            return <ReactReduxContext.Consumer>
                {(value) => {
                    return <WrappedComponent {...this.state.allProps} />
                }}
            </ReactReduxContext.Consumer>
        }
    }
 
    return NewComponent;
}