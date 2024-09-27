// Handles errors that may be missed in manual error checking so a page still renders

module.exports = (err, req, res, next) => {
  console.error(err.stack); // Show error on console

  const status = err.status || 500; // Default error status
  const message = err.message || 'Error found';

  // Renders a view based on the status code received from the server
  if (status === 404) {
    res.status(404).render('404error', {
      message: message,
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  } else {
    res.status(status).render('404error', { 
      message: message,
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  }
};