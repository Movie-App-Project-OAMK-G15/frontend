import '../styles/Error.css'
const ErrorNotification = ({ message, type }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className={type === 'error' ? 'error' : 'notify'}>
        {message}
      </div>
    )
  }

export default ErrorNotification