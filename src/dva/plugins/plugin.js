const hooks=[
    "onEffect",//effect中间件
    "extraReducers"//添加reducer
];

export function filterHooks(options){//筛选符合钩子名的配置项
    return Object.keys(options).reduce((prev,next)=>{
        if(hooks.indexOf(next)>-1){
            prev[next]=options[next]
        }
        return prev
    },{})
}

export default class Plugin{//用来统一管理
    constructor(){//初始化把钩子都做成数组
        this.hooks=hooks.reduce((prev,next)=>{
            prev[next]=[];
            return prev;
        },{}) //{onEffect:[],extraReducers:[]}
    }

    use(plugin){//因为会多次使用use 所以就把函数或者对象push进对应的钩子里
        const {hooks}=this;
        for(let key in plugin){
            hooks[key].push(plugin[key])
        }//{onEffect:[fn],extraReducers:[obj]}
    }
    
    get(key){//不同的钩子进行不同处理
        if(key==="extraReducers"){//处理reducer就把所有对象并成总对象，这里只能是对象形式才能满足后面并入combine的操作。
            return Object.assign({},...this.hooks[key])
        }else{
            return this.hooks[key]//其他钩子就返回用户配置的函数或对象
        }

    }
}