function InputLogin({
  value,
  name,
  type,
  placeholder,
  onChange,
  formErrors,
  error,
  hideOrShowPass,
  showPassword,
  handleShowPassword,
  email,
}) {
  return (
    <div className='mb-2'>
      <div className='flex items-center'>
        {email ? (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6 text-[#2a69ac] mr-3'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
              clipRule='evenodd'
            />
          </svg>
        ) : (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6 text-[#2a69ac] mr-3'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z'
              clipRule='evenodd'
            />
          </svg>
        )}
        <input
          type={type}
          placeholder={placeholder}
          className='w-full py-2 border-b-[1px] border-[#2a69ac] outline-none bg-transparent text-[#e7e9ea] text-[17px]'
          name={name}
          value={value}
          onChange={onChange}
        />
        {hideOrShowPass &&
          (!showPassword ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 cursor-pointer text-gray-400 mr-3'
              viewBox='0 0 20 20'
              fill='currentColor'
              onClick={handleShowPassword}
            >
              <path
                fillRule='evenodd'
                d='M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z'
                clipRule='evenodd'
              />
              <path d='M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z' />
            </svg>
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 cursor-pointer text-gray-400 mr-3'
              viewBox='0 0 20 20'
              fill='currentColor'
              onClick={handleShowPassword}
            >
              <path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
              <path
                fillRule='evenodd'
                d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
                clipRule='evenodd'
              />
            </svg>
          ))}
      </div>
      {formErrors && error && (
        <p className='w-full text-red-900 font-medium p-1'>{error}</p>
      )}
    </div>
  )
}

export default InputLogin
