class NotFound extends Error { };
class InvalidRequest extends Error { };
class UnauthorizedError extends Error { };

module.exports = { NotFound, InvalidRequest, UnauthorizedError };
