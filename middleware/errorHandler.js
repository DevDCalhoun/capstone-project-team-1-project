// middleware/errorHandler.js

module.exports = (err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging

  const status = err.status || 500; // Default to 500 if no status is set
  const message = err.message || 'Error found';

  // Renders a view based on the status code received from the server
  if (status === 404) {
    res.status(404).render('404error', {
      message: message,
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  } else {
    res.status(status).render('500error', { 
      message: message,
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  }
};