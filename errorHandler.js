/* eslint-disable linebreak-style */
// eslint-disable-next-line no-unused-vars
const errorHandler = (error, request, response, next) => {
  error.statusCode = error.statusCode || 500
  error.message = error.message || 'error'

  response.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message
  })
}
module.exports = errorHandler