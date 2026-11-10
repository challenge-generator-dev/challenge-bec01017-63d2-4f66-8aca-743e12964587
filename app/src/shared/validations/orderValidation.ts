import { Order, OrderItem, OrderStatus } from '../../domain/models/Order';
import { OrderValidationError } from '../errors/OrderError';

export interface OrderValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateOrderData(customerId: string, items: OrderItem[]): void {
  const errors: string[] = [];

  if (!customerId || customerId.trim().length === 0) {
    errors.push('El ID del cliente es requerido');
  }

  if (!items || items.length === 0) {
    errors.push('La orden debe contener al menos un ítem');
  }

  if (errors.length > 0) {
    throw new OrderValidationError(errors.join('; '));
  }
}

export function validateOrderItem(item: OrderItem): void {
  const errors: string[] = [];

  if (!item.productId || item.productId.trim().length === 0) {
    errors.push('El ID del producto es requerido');
  }

  if (item.quantity === undefined || item.quantity <= 0) {
    errors.push('La cantidad del producto debe ser mayor a 0');
  }

  if (item.price === undefined || item.price < 0) {
    errors.push('El precio unitario no puede ser negativo');
  }

  if (errors.length > 0) {
    throw new OrderValidationError(errors.join('; '), 'items');
  }
}

export function validateOrderItems(items: OrderItem[]): void {
  if (!items || items.length === 0) {
    throw new OrderValidationError('La orden debe contener al menos un ítem', 'items');
  }

  items.forEach((item, index) => {
    try {
      validateOrderItem(item);
    } catch (error) {
      if (error instanceof OrderValidationError) {
        throw new OrderValidationError(`Ítem ${index + 1}: ${error.message}`, 'items');
      }
      throw error;
    }
  });
}

export function validateTotalCalculation(order: Order): void {
  const calculatedTotal = order.calculateTotal();
  
  if (calculatedTotal < 0) {
    throw new OrderValidationError('El total de la orden no puede ser negativo', 'total');
  }
}

export function validateStatusTransition(currentStatus: OrderStatus, targetStatus: OrderStatus): boolean {
  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
    [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
    [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
    [OrderStatus.DELIVERED]: [],
    [OrderStatus.CANCELLED]: []
  };

  const allowedTransitions = validTransitions[currentStatus];
  return allowedTransitions ? allowedTransitions.includes(targetStatus) : false;
}

export function validateOrderUpdate(customerId: string, items: OrderItem[], status?: OrderStatus): void {
  const errors: string[] = [];

  if (customerId && customerId.trim().length === 0) {
    errors.push('El ID del cliente no puede estar vacío');
  }

  if (items && items.length > 0) {
    try {
      validateOrderItems(items);
    } catch (error) {
      if (error instanceof OrderValidationError) {
        errors.push(error.message);
      }
    }
  }

  if (status !== undefined && !Object.values(OrderStatus).includes(status)) {
    errors.push(`Estado '${status}' no es válido`);
  }

  if (errors.length > 0) {
    throw new OrderValidationError(errors.join('; '));
  }
}

export function validateOrderId(orderId: string): void {
  if (!orderId || orderId.trim().length === 0) {
    throw new OrderValidationError('El ID de la orden es requerido', 'id');
  }
}