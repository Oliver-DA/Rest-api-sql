const notFoundError = (req, res) => {

    res.status(404).json({
        message: 'Route Not Found',
    });

}

const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

const globalErrorHandler = (err, req, res, next) => {

    if (enableGlobalErrorLogging) {
        console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
    }
    res.status(err.status || 500).json({
        message: err.message,
        error: {},
    });
    
}

module.exports = { notFoundError, globalErrorHandler }