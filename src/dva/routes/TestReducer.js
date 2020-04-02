import React from 'react';
import { connect,Link } from '../dva';

@connect(({global,loading})=>({
    global,
    imgLoading:loading.effects["global/getImages"]
}))
class TestReducer extends React.Component {

    componentDidMount(){
        
    }
 
    handleShow = () => {
        const { global:{show},dispatch } = this.props;
        dispatch({
            type:"global/toggle",
            payload:{
                show:!show
            }
        })
    }

    handleFetch=()=>{
        const { dispatch } = this.props;
        dispatch({
            type:"global/getImages",   
        })
       
    }

    render() {

        const {
            global:{show,data},
            imgLoading
        }=this.props;


        return (
            <div>
                {show && <h1>hello</h1>}
                <button onClick={this.handleShow}>点击出现/消失</button>
                <button onClick={this.handleFetch}>获取图片</button>
                {imgLoading && <p>Loadinging...</p>}
                <Link to="/router"><button>Link标签跳转</button></Link>
                {
                    data.map(item=><img width="100" height="100" key={item.id} src={item.author.avatar_url} />)
                }
            </div>
        )

    }
}

export default TestReducer;