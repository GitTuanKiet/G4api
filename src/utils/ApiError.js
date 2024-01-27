//ApiError.js là một class kế thừa từ Error, nó sẽ được sử dụng để bắt lỗi và trả về cho client.

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    Error.captureStackTrace(this, this.constructor)
  }
}

export default ApiError