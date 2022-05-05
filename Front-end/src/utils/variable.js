export const Error = {
  timeOut: 'Time out ! Please log in again.',
  serverError: 'Internal Server Error !',
  networkError: 'Network connection error !',
  loginSuccess: 'Logged in successfully !',
  loginFailed: 'Login Failed ! Email and password fields are required.',
  samePass: 'The new password you entered is the same as your old password.',
  invalidFullname: {
    leng: 'Must be at least 8 characters.',
    notContainDigits: 'Fullname must not contain digits.',
  },
  invalidPass: {
    leng: 'Must be at least 8 characters.',
    include:
      'Must include uppercase and lowercase letters, a number and aspecial character.',
    specialCharacters: 'Allowed special characters: ! @ # $ %',
    match: 'Must match the first password input field.',
  },
  invalidEmail: 'Invalid email format.',
}
