import axios from 'axios';

const LIST="https://cnodejs.org/api/v1/topics";

async function getlist(){
    return axios.get(LIST)
}

export {
    getlist
}