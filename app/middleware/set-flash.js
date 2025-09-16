const setFlash = (req, res, next) => {
  const flash = {
    errors: [],
    warnings: [],
  };

  const hasMessage = (grade, message) => flash[grade].some(error => error.customMessage === message);
  const setMessage = (grade, message, status) => flash[grade].push({ customMessage: message, status });

  const hasErrorMessage = (message) => hasMessage('errors', message);
  const hasWarningMessage = (message) => hasMessage('warnings', message);

  const setErrorMessage = (message, status) => setMessage('errors', message, status);
  const setWarningMessage = (message, status) => setMessage('warnings', message, status);

  req.flash = flash;

  req.flash.setError = (message, status = null) => {
    if (!hasErrorMessage(message)) {
      setErrorMessage(message, status);
    }
  };

  req.flash.setWarning = (message, status = null) => {
    if (!hasWarningMessage(message)) {
      setWarningMessage(message, status);
    }
  };

  next();
};

module.exports = setFlash;
