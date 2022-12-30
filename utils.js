const { ValidationError, CastError } = require('mongoose').Error;
const { NotFound } = require('./errorTypes');
const {
  NOT_FOUND_CODE, BAD_REQUEST_CODE, SERVER_ERROR_CODE, SERVER_ERROR_MSG,
} = require('./constants');

function removeUndefinedEntries(object) {
  return Object.entries(object).reduce((prev, [key, value]) => {
    if (typeof value === 'undefined') {
      return prev;
    }

    return { ...prev, [key]: value };
  }, {});
}

function makeCatchHandler(res) {
  return (err) => {
    if (err instanceof NotFound) {
      res.status(NOT_FOUND_CODE).send({ message: err.message });
      return;
    }

    if (err instanceof CastError) {
      res.status(BAD_REQUEST_CODE).send({ message: err.message });
      return;
    }

    if (err instanceof ValidationError) {
      res.status(BAD_REQUEST_CODE).send({ message: err.message });
      return;
    }

    console.error(err);
    res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MSG });
  };
}

module.exports = { removeUndefinedEntries, makeCatchHandler };
