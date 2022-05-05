export default function dialogReducer(state, action) {
    switch(action.type) {
        case 'OPEN':
            return action.data
        case 'CLOSE':
            return action.data
        case 'OPEN1':
            return action.data
            case 'CLOSE1':
                return action.bool
        default :
            return state
    }
}