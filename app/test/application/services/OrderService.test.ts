import { OrderService } from '../../../src/application/services/OrderService';
import { OrderRepository } from '../../../src/domain/ports/OrderRepository';
import { Order, OrderStatus, OrderItem } from '../../../src/domain/models/Order';
import { OrderError } from '../../../src/shared/errors/OrderError';

describe('OrderService', () => {
  let orderService: OrderService;
  let mockOrderRepository: jest.Mocked<OrderRepository>;

  const mockOrderItem: OrderItem = {
    productId: 'prod-123',
    productName: 'Test Product',
    quantity: 2,
    unitPrice: 25.00,
  };

  const mockOrderData = {
    customerId: 'cust-456',
    items: [mockOrderItem],
    status: OrderStatus.PENDING,
  };

  beforeEach(() => {
    mockOrderRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByCustomerId: jest.fn(),
    };

    orderService = new OrderService(mockOrderRepository);
  });

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      const expectedOrder = new Order(
        mockOrderData.customerId,
        mockOrderData.items,
        mockOrderData.status
      );

      mockOrderRepository.create.mockResolvedValue(expectedOrder);

      const result = await orderService.createOrder(
        mockOrderData.customerId,
        mockOrderData.items
      );

      expect(mockOrderRepository.create).toHaveBeenCalledTimes(1);
      expect(result.customerId).toBe(mockOrderData.customerId);
      expect(result.items).toHaveLength(1);
    });

    it('should throw error when items array is empty', async () => {
      await expect(
        orderService.createOrder(mockOrderData.customerId, [])
      ).rejects.toThrow(OrderError);

      expect(mockOrderRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error when customer ID is empty', async () => {
      await expect(
        orderService.createOrder('', mockOrderData.items)
      ).rejects.toThrow(OrderError);

      expect(mockOrderRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error when repository fails', async () => {
      mockOrderRepository.create.mockRejectedValue(
        new Error('DynamoDB connection failed')
      );

      await expect(
        orderService.createOrder(mockOrderData.customerId, mockOrderData.items)
      ).rejects.toThrow(OrderError);
    });
  });

  describe('getOrder', () => {
    it('should return order when found', async () => {
      const expectedOrder = new Order(
        mockOrderData.customerId,
        mockOrderData.items,
        mockOrderData.status
      );

      mockOrderRepository.findById.mockResolvedValue(expectedOrder);

      const result = await orderService.getOrder('order-123');

      expect(mockOrderRepository.findById).toHaveBeenCalledWith('order-123');
      expect(result).toBeDefined();
      expect(result?.customerId).toBe(mockOrderData.customerId);
    });

    it('should return null when order not found', async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      const result = await orderService.getOrder('non-existent-id');

      expect(result).toBeNull();
    });

    it('should throw error when ID is invalid', async () => {
      await expect(orderService.getOrder('')).rejects.toThrow(OrderError);
      await expect(orderService.getOrder('   ')).rejects.toThrow(OrderError);
    });
  });

  describe('updateOrder', () => {
    it('should update order status successfully', async () => {
      const existingOrder = new Order(
        mockOrderData.customerId,
        mockOrderData.items,
        OrderStatus.PENDING
      );

      const updatedOrder = new Order(
        mockOrderData.customerId,
        mockOrderData.items,
        OrderStatus.CONFIRMED
      );

      mockOrderRepository.findById.mockResolvedValue(existingOrder);
      mockOrderRepository.update.mockResolvedValue(updatedOrder);

      const result = await orderService.updateOrder('order-123', {
        status: OrderStatus.CONFIRMED,
      });

      expect(mockOrderRepository.update).toHaveBeenCalledTimes(1);
      expect(result.status).toBe(OrderStatus.CONFIRMED);
    });

    it('should throw error when order not found', async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(
        orderService.updateOrder('non-existent', { status: OrderStatus.CONFIRMED })
      ).rejects.toThrow(OrderError);
    });

    it('should throw error when update data is empty', async () => {
      await expect(
        orderService.updateOrder('order-123', {})
      ).rejects.toThrow(OrderError);
    });
  });

  describe('deleteOrder', () => {
    it('should delete order successfully', async () => {
      const existingOrder = new Order(
        mockOrderData.customerId,
        mockOrderData.items,
        OrderStatus.PENDING
      );

      mockOrderRepository.findById.mockResolvedValue(existingOrder);
      mockOrderRepository.delete.mockResolvedValue();

      await orderService.deleteOrder('order-123');

      expect(mockOrderRepository.delete).toHaveBeenCalledWith('order-123');
    });

    it('should throw error when order not found', async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(orderService.deleteOrder('non-existent')).rejects.toThrow(
        OrderError
      );
    });

    it('should throw error when trying to delete cancelled order', async () => {
      const cancelledOrder = new Order(
        mockOrderData.customerId,
        mockOrderData.items,
        OrderStatus.CANCELLED
      );

      mockOrderRepository.findById.mockResolvedValue(cancelledOrder);

      await expect(orderService.deleteOrder('order-123')).rejects.toThrow(
        OrderError
      );
    });
  });

  describe('getOrdersByCustomer', () => {
    it('should return orders for a customer', async () => {
      const orders = [
        new Order(mockOrderData.customerId, [mockOrderItem], OrderStatus.PENDING),
        new Order(mockOrderData.customerId, [mockOrderItem], OrderStatus.CONFIRMED),
      ];

      mockOrderRepository.findByCustomerId.mockResolvedValue(orders);

      const result = await orderService.getOrdersByCustomer('cust-456');

      expect(mockOrderRepository.findByCustomerId).toHaveBeenCalledWith('cust-456');
      expect(result).toHaveLength(2);
    });

    it('should return empty array when customer has no orders', async () => {
      mockOrderRepository.findByCustomerId.mockResolvedValue([]);

      const result = await orderService.getOrdersByCustomer('cust-456');

      expect(result).toHaveLength(0);
    });
  });
});