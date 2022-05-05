const initialState = {}

const LoadingReducer = (state = initialState, action) => {
  const {type, payload} = action
  switch (type) {
    case 'LOADING':
      return payload
    default:
      return state
  }
}

export default LoadingReducer
