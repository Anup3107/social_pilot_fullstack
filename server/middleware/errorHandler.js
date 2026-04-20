const errorHandler = (err, req, res, next) => {
  // Extract status and message safely — Error properties are non-enumerable
  // so spreading ({ ...err }) loses them
  let statusCode = err.statusCode || 500;
  let message    = err.message    || 'Server Error';

  console.error('Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'Field';
    statusCode = 400;
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(e => e.message).join(', ');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError')  { statusCode = 401; message = 'Invalid token'; }
  if (err.name === 'TokenExpiredError')  { statusCode = 401; message = 'Token expired, please login again'; }

  res.status(statusCode).json({ success: false, message });
};

module.exports = errorHandler;
