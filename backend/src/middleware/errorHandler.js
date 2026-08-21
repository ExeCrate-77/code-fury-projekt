export function errorHandler(err, _req, res, _next) {
  const status = err.status || err.statusCode || 500
  res.status(status).json({
    error: err.message || 'Internal server error',
    code: err.code,
  })
}
