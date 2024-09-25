// Handles uncaught synchronous and asynchronous errors in the application
module.exports = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    message:'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
};