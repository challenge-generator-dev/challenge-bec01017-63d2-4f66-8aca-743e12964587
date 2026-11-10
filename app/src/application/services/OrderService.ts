import { Order, OrderItem, OrderStatus } from '../../domain/models/Order';
import { OrderRepository } from '../../domain/ports/OrderRepository';
import {
  OrderNotFoundError,
  OrderValidationError,
  OrderCreationError,
  OrderUpdateError,
  OrderDeleteError
} from '../../shared/errors/OrderError';
import {
  validateOrderData,
  validateOrderItems,
  validateTotalCalculation,
  validateStatusTransition,
  validateOrderUpdate,
  validateOrderId
} from '../../shared/validations/orderValidation';

export interface CreateOrderInput {
  customerId: string;
  items: OrderItem[];
}

export interface UpdateOrderInput {
  customerId?: string;
  items?: OrderItem[];
  status?: OrderStatus;
}

export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {
    if (!orderRepository) {
      throw new OrderValidationError('El repositorio de órdenes es requerido');
    }
  }

  async createOrder(input: CreateOrderInput): Promise<Order> {
    const { customerId, items } = input;

    try {
      validateOrderData(customerId, items);
      validateOrderItems(items);

      const order = new Order(customerId, items, OrderStatus.PENDING);
      validateTotalCalculation(order);

      const createdOrder = await this.orderRepository.create(order);
      return createdOrder;
    } catch (error) {
      if (error instanceof OrderValidationError) {
        throw error;
      }
      throw new OrderCreationError(
        `Error al crear la orden: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  async getOrder(orderId: string): Promise<Order> {
    validateOrderId(orderId);

    try {
      const order = await this.orderRepository.findById(orderId);
      
      if (!order) {
        throw new OrderNotFoundError(orderId);
      }

      return order;
    } catch (error) {
      if (error instanceof OrderNotFoundError || error instanceof OrderValidationError) {
        throw error;
      }
      throw new OrderValidationError(
        `Error al obtener la orden: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  async updateOrder(orderId: string, input: UpdateOrderInput): Promise<Order> {
    validateOrderId(orderId);

    const itemsToValidate = input.items ?? [];
    if (input.customerId !== undefined || input.items !== undefined || input.status !== undefined) {
      validateOrderUpdate(input.customerId || '', itemsToValidate, input.status);
    }

    try {
      const existingOrder = await this.orderRepository.findById(orderId);

      if (!existingOrder) {
        throw new OrderNotFoundError(orderId);
      }

      if (input.status !== undefined) {
        const hasValidTransition = validateStatusTransition(existingOrder.status, input.status);
        if (!hasValidTransition) {
          throw new OrderValidationError(
            `Transición de estado inválida de ${existingOrder.status} a ${input.status}`
          );
        }
        existingOrder.status = input.status;
      }

      if (input.customerId !== undefined) {
        existingOrder.customerId = input.customerId;
      }

      if (input.items !== undefined && input.items.length > 0) {
        const itemsToValidate: OrderItem[] = input.items;
        validateOrderItems(itemsToValidate);
        existingOrder.items = itemsToValidate;
        validateTotalCalculation(existingOrder);
      }

      const updatedOrder = await this.orderRepository.update(existingOrder);
      return updatedOrder;
    } catch (error) {
      if (
        error instanceof OrderNotFoundError ||
        error instanceof OrderValidationError
      ) {
        throw error;
      }
      throw new OrderUpdateError(
        `Error al actualizar la orden: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  async deleteOrder(orderId: string): Promise<void> {
    validateOrderId(orderId);

    try {
      const existingOrder = await this.orderRepository.findById(orderId);

      if (!existingOrder) {
        throw new OrderNotFoundError(orderId);
      }

      await this.orderRepository.delete(orderId);
    } catch (error) {
      if (error instanceof OrderNotFoundError || error instanceof OrderValidationError) {
        throw error;
      }
      throw new OrderDeleteError(
        `Error al eliminar la orden: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    if (!customerId || customerId.trim().length === 0) {
      throw new OrderValidationError('El ID del cliente es requerido', 'customerId');
    }

    try {
      const orders = await this.orderRepository.findByCustomerId(customerId);
      return orders;
    } catch (error) {
      throw new OrderValidationError(
        `Error al obtener las órdenes del cliente: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}