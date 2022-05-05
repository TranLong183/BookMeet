import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material'
import {useContext} from 'react'
import {Error} from '../../utils/variable'
import { ResourcesContext } from '../../context/resources/resourcesContext'

const fullName_regex =
  /^[A-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ' ']{8,255}$/
const email_regex =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b$/

const ModalUser = ({
  open,
  handleCloseModalUser,
  handleCloseModalEditUser,
  handleFormSubmit,
  editUserId,
  data,
}) => {
  const { resources } = useContext(ResourcesContext)
  const groups = resources[1].instances

  const strTobool = (value) => {
    if (value && typeof value === 'string') {
      if (value.toLowerCase() === 'true') return true
      if (value.toLowerCase() === 'false') return false
    } else return value
  }

  const {
    fullname,
    setFullName,
    email,
    setEmail,
    group,
    setGroup,
    supperUser,
    setSupperUser,
    validFullName,
    setValidFullName,
    validEmail,
    setValidEmail,
    invalidFullname,
    setInvalidFullname,
    invalidEmail,
    setInvalidEmail,
    fullNameFocus,
    setFullNameFocus,
    emailFocus,
    setEmailFocus,
    errMsg,
    setErrMsg,
  } = data

  return (
    <Dialog open={open} style={{userSelect: 'none'}}>
      <DialogTitle>{editUserId ? 'Update user' : 'Add new user'}</DialogTitle>
      <Divider />
      <DialogContent>
        <form>
          {/* Fullname */}
          <div className='w-[450px] pb-2 mb-2'>
            <div className='w-full'>
              <label className='flex flex-col cursor-pointer'>
                <p className='flex items-center'>
                  <span className='font-medium text-[#f47121] mr-1'>
                    Full Name
                  </span>
                </p>
                <div className='flex flex-col w-full'>
                  <div className='flex items-center'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 text-[#2a69ac]'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <input
                      autoFocus
                      id='fullname'
                      type='text'
                      className='px-3 pb-1 flex-1 border-b-[1px] border-[#2a69ac] outline-none bg-transparent text-[17px]'
                      value={fullname.replace(/\s+/g, ' ')}
                      onChange={(e) => {
                        setFullName(e.target.value)
                        setInvalidFullname('')
                      }}
                      autoComplete='off'
                      onFocus={() => {
                        setFullNameFocus(false)
                        setInvalidFullname('')
                      }}
                      onBlur={(e) => {
                        setFullNameFocus(true)
                        setFullName(e.target.value.trim())
                        const result = fullName_regex.test(fullname)
                        setValidFullName(result)
                      }}
                      maxLength={255}
                    />
                  </div>

                  {fullNameFocus && fullname && !validFullName && (
                    <p className='w-full rounded-md bg-red-600 text-white mt-2 text-sm font-medium p-1.5'>
                      <span className='flex items-center'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5 mr-1'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                        >
                          <path
                            fillRule='evenodd'
                            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                            clipRule='evenodd'
                          />
                        </svg>
                        <span>{Error.invalidFullname.leng}</span>
                      </span>
                      {Error.invalidFullname.notContainDigits}
                    </p>
                  )}
                </div>
              </label>
              {invalidFullname && (
                <p className='w-full rounded-md bg-red-600 text-white mt-2 text-sm font-medium p-1.5'>
                  <span className='flex items-center'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 mr-1'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <span>{invalidFullname}</span>
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className='w-[450px] pb-2 mb-2'>
            <div className='w-full'>
              <label className='flex flex-col cursor-pointer'>
                <p className='flex items-center'>
                  <span className='font-medium text-[#f47121] mr-1'>Email</span>
                  {errMsg && (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 text-red-600'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                        clipRule='evenodd'
                      />
                    </svg>
                  )}
                </p>
                <div className='flex flex-col w-full'>
                  <div className='flex items-center'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 text-[#2a69ac]'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <input
                      type='text'
                      disabled={editUserId ? true : false}
                      className={`${
                        !editUserId
                          ? 'px-3 pb-1 flex-1 border-b-[1px] border-[#2a69ac] outline-none bg-transparent text-[17px]'
                          : 'px-3 pb-1 flex-1 border-b-[1px] border-[#2a69ac] outline-none text-[17px] opacity-40 cursor-not-allowed'
                      }`}
                      value={email.replace(/\s+/g, '')}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setErrMsg('')
                        setInvalidEmail('')
                      }}
                      autoComplete='off'
                      onFocus={() => {
                        setEmailFocus(false)
                        setInvalidEmail('')
                      }}
                      onBlur={(e) => {
                        setEmailFocus(true)
                        setEmail(e.target.value.trim())
                        const result = email_regex.test(email)
                        setValidEmail(result)
                        setErrMsg('')
                      }}
                      maxLength={128}
                    />
                  </div>
                  {emailFocus && email && !validEmail && !editUserId && (
                    <p className='w-full rounded-md bg-red-600 text-white mt-2 text-sm font-medium p-1.5'>
                      <span className='flex items-center'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5 mr-1'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                        >
                          <path
                            fillRule='evenodd'
                            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                            clipRule='evenodd'
                          />
                        </svg>
                        <span>{Error.invalidEmail}</span>
                      </span>
                    </p>
                  )}
                  {errMsg && (
                    <p className='w-full rounded-md bg-red-600 text-white mt-2 text-sm font-medium p-1.5'>
                      <span className='flex items-center'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5 mr-1'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                        >
                          <path
                            fillRule='evenodd'
                            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                            clipRule='evenodd'
                          />
                        </svg>
                        <span>{errMsg}</span>
                      </span>
                    </p>
                  )}
                </div>
              </label>
              {invalidEmail && !editUserId && (
                <p className='w-full rounded-md bg-red-600 text-white mt-2 text-sm font-medium p-1.5'>
                  <span className='flex items-center'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 mr-1'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <span>{invalidEmail}</span>
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Group */}
          <div className='w-[450px] mb-2 flex items-center'>
            <p className='text-[#f47121] mr-3'>Group</p>
            <select
              className='w-full py-2 px-3 text-gray-700 bg-white outline-none rounded-lg 
              border-[1.5px] border-solid border-[#2a69ac] focus:border-blue-600 cursor-pointer text-[17px]'
              value={group}
              onChange={(e) => setGroup(e.target.value)}
            >
              <option value=''>None</option>
              {groups &&
                groups.length > 0 &&
                groups.map((group) => (
                  <option key={group.id} value={group.text}>
                    {group.text}
                  </option>
                ))}
            </select>
          </div>

          {/* Supper User*/}
          <FormControl margin='dense'>
            <span style={{color: '#f47121'}}>Supper User</span>
            <RadioGroup
              row
              aria-labelledby='demo-controlled-radio-buttons-group'
              name='controlled-radio-buttons-group'
              value={supperUser}
              onChange={(e) => setSupperUser(strTobool(e.target.value))}
            >
              <FormControlLabel value={true} control={<Radio />} label='True' />
              <FormControlLabel
                value={false}
                control={<Radio />}
                label='False'
              />
            </RadioGroup>
          </FormControl>
          <br />

          <DialogActions>
            <Button
              variant='outlined'
              color='error'
              onClick={() => {
                editUserId ? handleCloseModalEditUser() : handleCloseModalUser()
              }}
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              color='primary'
              onClick={handleFormSubmit}
              style={{marginLeft: 20}}
            >
              {editUserId ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ModalUser
