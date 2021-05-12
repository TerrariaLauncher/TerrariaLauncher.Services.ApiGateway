/**
 * Express 5.0 does not need this wrapper.
 * @param {Function} func 
 * @returns {Promise}
 */
const asyncWrapper = function (func) {
    return (req, res, next) => {
        func(req, res, next).catch(err => {
            next(err);
        });
    };
};

export default asyncWrapper;
