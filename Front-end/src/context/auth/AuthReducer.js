const AuthReducer = (state, action) => {
  const {type, payload} = action
  switch (type) {
    case 'LOGIN':
      return {...state, user: payload.user, token: payload.token}
    case 'SAVE_COOKIE':
      return {...state, cookie: payload}
    default:
      return state
  }
}

export default AuthReducer
