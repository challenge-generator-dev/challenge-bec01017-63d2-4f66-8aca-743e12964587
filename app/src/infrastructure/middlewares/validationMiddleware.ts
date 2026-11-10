import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { OrderError, OrderErrorType } from '../../shared/errors/OrderError';

export function validateDto<T extends object>(dtoClass: new (...args: any[]) => T) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dtoInstance = Object.assign(new dtoClass(), req.body);
      
      const errors: ValidationError[] = await validate(dtoInstance, {
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      });

      if (errors.length > 0) {
        const validationErrors = errors.map((error) => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : [],
        }));

        const error = new OrderError(
          'Validation failed',
          OrderErrorType.VALIDATION_ERROR,
          400,
          validationErrors
        );
        res.status(400).json({
          error: error.message,
          details: error.metadata,
        });
        return;
      }

      req.body = dtoInstance;
      next();
    } catch (err) {
      if (err instanceof OrderError) {
        res.status(400).json({
          error: err.message,
          details: err.metadata,
        });
        return;
      }

      const unexpectedError = new OrderError(
        'An unexpected error occurred during validation',
        OrderErrorType.INTERNAL_ERROR,
        500
      );
      res.status(500).json({
        error: unexpectedError.message,
      });
    }
  };
}

export function validateQueryParams(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { id } = req.params;

  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    const error = new OrderError(
      'Invalid order ID parameter',
      OrderErrorType.VALIDATION_ERROR,
      400
    );
    res.status(400).json({
      error: error.message,
    });
    return;
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id.trim())) {
    const error = new OrderError(
      'Order ID must be a valid UUID',
      OrderErrorType.VALIDATION_ERROR,
      400
    );
    res.status(400).json({
      error: error.message,
    });
    return;
  }

  next();
}

export function validationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  next();
}