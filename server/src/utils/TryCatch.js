export const TryCatch = (passedFunction) => {
  return (req, res, next) => {
    Promise.resolve(passedFunction(req, res, next)).
    catch((error=>next(error)))
  }
};