import React from 'react';
import { connect,routerRedux } from '../dva';
 
@connect(()=>{
    
})
class TestRouter extends React.Component {
 
    toIndex=()=>{
        this.props.dispatch(routerRedux.push("/"))
    }

    render() {

        return (
            <div>
                <h1>TestRouter</h1>
                <button onClick={this.toIndex}>跳转到/路径</button>
            </div>
        )

    }
}

export default TestRouter;