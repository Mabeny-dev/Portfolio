export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

////////////////////////////////////////////////////////////////
/* OTHER WAYS OF WRITING IT*/
////////////////////////////////////////////////////////////////
// Method 1: Write as regular function
/*
export const asyncHandler = function(fn) {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}

*/

// Method 2:
/*
export const asyncHandler = function(fn) {
    return function (req, res, next) {

        // 1. Call fn with req, res, next and wrap result in a Promise
        const result = fn(req, res, next)
        Promise.resolve(result)

        // 2. If the promise rejects, pass the error to next()
        Promise.catch(next)

    }
}
*/

// Method 3: Full expansion
/*
export const asyncHandler = function (fn) {
  return function (req, res, next) {
    try {
      const result = fn(req, res, next);
      Promise.resolve(result);

      Promise.catch(function (error) {
        next(error);
      });
    } catch (error) {
      next(error);
    }
  };
};
*/
