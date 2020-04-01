import React from 'react';
import { connect } from './../model/component';
import { FETCH_DATA } from './../model/action/imgAction';

class ReduxImgClass extends React.Component {

    constructor(props){
        super(props);
    }
 

    render() {
        const { img,handleFetchData }=this.props;

        return (
            <div>      
                <button onClick={handleFetchData}>获取数据</button>
                {
                    img.data.map(item=><img width="100" height="100" key={item.id} src={item.author.avatar_url} />)
                }
            </div>
        )

    }
}
const mapStateToProps=({img})=>{
    return {
        img
    }
};
const mapDispatchToProps=(dispatch)=>({
    handleFetchData:()=>dispatch({type:FETCH_DATA})
});

 
export default connect(mapStateToProps,mapDispatchToProps)(ReduxImgClass);