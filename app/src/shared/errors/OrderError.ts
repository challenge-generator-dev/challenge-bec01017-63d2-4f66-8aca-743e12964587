export enum OrderErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CREATION_ERROR = 'CREATION_ERROR',
  UPDATE_ERROR = 'UPDATE_ERROR',
  DELETE_ERROR = 'DELETE_ERROR',
  NOT_AUTHORIZED = 'NOT_AUTHORIZED',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  INVALID_STATUS_TRANSITION = 'INVALID_STATUS_TRANSITION',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export class OrderError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly metadata?: any;

  constructor(message: string, code: string, statusCode: number = 500, metadata?: any) {
    super(message);
    this.name = 'OrderError';
    this.code = code;
    this.statusCode = statusCode;
    this.metadata = metadata;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class OrderNotFoundError extends OrderError {
  constructor(orderId: string) {
    super(`Orden con ID ${orderId} no encontrada`, OrderErrorType.NOT_FOUND, 404);
    this.name = 'OrderNotFoundError';
  }
}

export class OrderValidationError extends OrderError {
  constructor(message: string, public readonly field?: string) {
    super(message, OrderErrorType.VALIDATION_ERROR, 400, { field });
    this.name = 'OrderValidationError';
  }
}

export class OrderCreationError extends OrderError {
  constructor(message: string, public readonly cause?: Error) {
    super(message, OrderErrorType.CREATION_ERROR, 500, { cause: cause?.message });
    this.name = 'OrderCreationError';
  }
}

export class OrderUpdateError extends OrderError {
  constructor(message: string, public readonly cause?: Error) {
    super(message, OrderErrorType.UPDATE_ERROR, 500, { cause: cause?.message });
    this.name = 'OrderUpdateError';
  }
}

export class OrderDeleteError extends OrderError {
  constructor(message: string, public readonly cause?: Error) {
    super(message, OrderErrorType.DELETE_ERROR, 500, { cause: cause?.message });
    this.name = 'OrderDeleteError';
  }
}

export class OrderNotAuthorizedError extends OrderError {
  constructor(customerId: string, orderId: string) {
    super(
      `Cliente ${customerId} no autorizado para acceder a la orden ${orderId}`,
      OrderErrorType.NOT_AUTHORIZED,
      403,
      { customerId, orderId }
    );
    this.name = 'OrderNotAuthorizedError';
  }
}

export class OrderAlreadyExistsError extends OrderError {
  constructor(orderId: string) {
    super(`La orden con ID ${orderId} ya existe`, OrderErrorType.ALREADY_EXISTS, 409, { orderId });
    this.name = 'OrderAlreadyExistsError';
  }
}

export class InvalidOrderStatusTransitionError extends OrderError {
  constructor(currentStatus: string, targetStatus: string) {
    super(
      `Transición de estado inválida de ${currentStatus} a ${targetStatus}`,
      OrderErrorType.INVALID_STATUS_TRANSITION,
      400,
      { currentStatus, targetStatus }
    );
    this.name = 'InvalidOrderStatusTransitionError';
  }
}