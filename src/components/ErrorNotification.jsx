import 'bootstrap';

const ErrorNotification = ({ message, type }) => {
  if (!message) {
    return null;
  }

  return (
    <div className={`alert ${type === 'error' ? 'alert-danger' : 'alert-success'} text-center`} role="alert">
      {message}
    </div>
  );
};

export default ErrorNotification;
