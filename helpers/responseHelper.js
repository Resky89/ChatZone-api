const sendSuccessResponse = (res, data, statusCode = 200) => {
  const response = {
    status: true,
    message: "Request successful",
    data: data
  };
  res.status(statusCode).json(response);
};

const sendErrorResponse = (res, message, statusCode = 500, errors = {}) => {
  const response = {
    status: false,
    message: message,
    errors: errors
  };
  res.status(statusCode).json(response);
};

module.exports = {
  sendSuccessResponse,
  sendErrorResponse,
};
