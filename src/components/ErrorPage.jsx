import React from 'react'

const ErrorPage = ({title,message,onConfirm}) => {
  return (
    <div className='error'> 
      <h2>{title}</h2>
      <p>{message}</p>
      {
        onConfirm && (
            <div id='confirmation-actions'>
                <button onClick={onConfirm} className='button'>Okay</button>
            </div>
        )
      }
    </div>
  )
}

export default ErrorPage
