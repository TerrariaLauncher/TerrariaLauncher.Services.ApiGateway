const asyncWrapper = function (func) {
    return (req, res, next) => {
        func(req, res, next).catch(err => {
            next(err);
        });
    };
};

export default asyncWrapper;
