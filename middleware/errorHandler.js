
const errorHandler = (err, req, res, next) => {

    const statusCode = res.statusCode = res.statusCode || 500;

    res.status(statusCode).json({
        err: err,
        message: err.message,
        status: err.status,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,

    })

}

export default errorHandler

