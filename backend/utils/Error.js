function createNewError(status, message) {
  let err;
  err = new Error(message);
  err.status = status;
  return err;
}

export default createNewError;
