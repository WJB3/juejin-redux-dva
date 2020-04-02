import React from 'react'
const DefaultLoadingComponent = props => <div>加载中</div>

export default function dynamic(config){
    let {app,models,component} =config;
    return class NewComponent extends React.Component{
        constructor(props){
            super(props)
            this.LoadingComponent = config.LoadingComponent || DefaultLoadingComponent
            this.state = { AsyncComponent: null }
            this.load()
 
        }

        async load(){
            let [resolvedmodule, AsyncComponent] = await Promise.all([Promise.all(models()), component()]);
            resolvedmodule = resolvedmodule.map((m) => m['default'] || m)
            AsyncComponent = AsyncComponent['default'] || AsyncComponent
            resolvedmodule.forEach((m) => app.model(m))
            this.setState({ AsyncComponent })
        }

        render(){
            let { AsyncComponent }=this.state; 
            let { LoadingComponent  }=this;
            return (
                AsyncComponent ? <AsyncComponent {...this.props}></AsyncComponent> : <LoadingComponent></LoadingComponent>
            )
 
        }
    }
}