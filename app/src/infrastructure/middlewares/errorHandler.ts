import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { OrderError } from '../../shared/errors/OrderError';

export const errorHandler: ErrorRequestHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error(`[ErrorHandler] Error occurred:`, {
        message: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    if (error instanceof OrderError) {
        res.status(error.statusCode).json({
            message: error.message,
            code: error.code,
            timestamp: new Date().toISOString()
        });
        return;
    }

    if (error.name === 'ValidationError') {
        res.status(400).json({
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: error.message,
            timestamp: new Date().toISOString()
        });
        return;
    }

    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        res.status(401).json({
            message: 'Unauthorized',
            code: 'AUTH_ERROR',
            timestamp: new Date().toISOString()
        });
        return;
    }

    const errorCode = (error as any).code;
    if (errorCode === 'CONDITIONAL_CHECK_FAILED') {
        res.status(409).json({
            message: 'Resource conflict',
            code: 'CONFLICT',
            timestamp: new Date().toISOString()
        });
        return;
    }

    if (error.name === 'ResourceNotFoundException' || errorCode === 'ResourceNotFoundException') {
        res.status(404).json({
            message: 'Resource not found',
            code: 'NOT_FOUND',
            timestamp: new Date().toISOString()
        });
        return;
    }

    res.status(500).json({
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
        timestamp: new Date().toISOString()
    });
};