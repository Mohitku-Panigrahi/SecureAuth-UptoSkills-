import { ZodError } from 'zod';

export const errorHandler = (err, req, res, next) => {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const errorDetails = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message
    }));

    return res.status(400).json({
      success: false,
      message: err.errors[0]?.message || 'Validation failed',
      errors: errorDetails
    });
  }

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `An account with this ${field} already exists.`
    });
  }

  // Handle CastError
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid resource ID format.'
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  console.error('[Error Handler]', err);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
