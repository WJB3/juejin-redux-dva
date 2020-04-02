const logger = ({ dispatch, getState }) => next => action => {
    let prevState = getState()
    next(action)
    let nextState = getState()

    console.group(
        `%caction %c${action.type} %c@${new Date().toLocaleTimeString()}`,
        `color:grey;font-weight:lighter`,
        `font-weight:bold`,
        'color:grey;font-weight:lighter'
    )
    console.log('%cprev state', `color:#9E9E9E; font-weight:bold`, prevState);
    console.log('%caction', `color:#03A9F4; font-weight:bold`, action);
    console.log('%cnext state', `color:#4CAF50; font-weight:bold`, nextState);
    console.groupEnd()
}
export default function (){
    return logger;
}