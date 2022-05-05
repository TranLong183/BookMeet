function Loading() {
  return (
    <div className='fixed w-full h-full bg-white z-50 opacity-60'>
      <div
        className='flex flex-col items-center absolute left-1/2 
        top-1/2 -translate-x-1/2 -translate-y-1/2'
      >
        <div className='lds-spinner'>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  )
}

export default Loading
