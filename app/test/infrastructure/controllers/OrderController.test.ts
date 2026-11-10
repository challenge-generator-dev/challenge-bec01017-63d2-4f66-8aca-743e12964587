import request from 'supertest';
import express, { Express } from 'express';
import { OrderController } from '../../../src/infrastructure/controllers/OrderController';
import { OrderService } from '../../../src/application/services/OrderService';
import { OrderRepository } from '../../../src/domain/ports/OrderRepository';
import { Order, OrderStatus, OrderItem } from '../../../src/domain/models/Order';
import { validateDto, validateQueryParams } from '../../../src/infrastructure/middlewares/validationMiddleware';
import { errorHandler } from '../../../src/infrastructure/middlewares/errorHandler';
import { CreateOrderDTO } from '../../../src/shared/dto/CreateOrderDTO';
import { UpdateOrderDTO } from '../../../src/shared/dto/UpdateOrderDTO';

describe('OrderController', () => {
  let app: Express;
  let mockOrderService: jest.Mocked<OrderService>;
  let mockOrderRepository: jest.Mocked<OrderRepository>;

  const mockOrderItem: OrderItem = {
    productId: 'prod-123',
    productName: 'Test Product',
    quantity: 2,
    unitPrice: 25.00,
  };

  const mockOrder = new Order('cust-456', [mockOrderItem], OrderStatus.PENDING);

  beforeAll(() => {
    mockOrderRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByCustomerId: jest.fn(),
    };

    mockOrderService = {
      createOrder: jest.fn(),
      getOrder: jest.fn(),
      updateOrder: jest.fn(),
      deleteOrder: jest.fn(),
      getOrdersByCustomer: jest.fn(),
    } as unknown as jest.Mocked<OrderService>;
  });

  beforeEach(() => {
    app = express();
    app.use(express.json());

    const controller = new OrderController(mockOrderService);

    app.post(
      '/orders',
      validateDto(CreateOrderDTO),
      (req, res, next) => controller.createOrder(req, res, next)
    );
    app.get(
      '/orders/:id',
      validateQueryParams,
      (req, res, next) => controller.getOrder(req, res, next)
    );
    app.put(
      '/orders/:id',
      validateQueryParams,
      validateDto(UpdateOrderDTO),
      (req, res, next) => controller.updateOrder(req, res, next)
    );
    app.delete(
      '/orders/:id',
      validateQueryParams,
      (req, res, next) => controller.deleteOrder(req, res, next)
    );

    app.use(errorHandler);
  });

  describe('POST /orders', () => {
    it('should create order successfully', async () => {
      mockOrderService.createOrder.mockResolvedValue(mockOrder);

      const response = await request(app)
        .post('/orders')
        .send({
          customerId: 'cust-456',
          items: [mockOrderItem],
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.customerId).toBe('cust-456');
    });

    it('should return 400 for invalid request body', async () => {
      const response = await request(app)
        .post('/orders')
        .send({
          customerId: '',
          items: [],
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when customerId is missing', async () => {
      const response = await request(app)
        .post('/orders')
        .send({
          items: [mockOrderItem],
        });

      expect(response.status).toBe(400);
    });

    it('should return 400 when items array is empty', async () => {
      const response = await request(app)
        .post('/orders')
        .send({
          customerId: 'cust-456',
          items: [],
        });

      expect(response.status).toBe(400);
    });

    it('should return 500 when service throws error', async () => {
      mockOrderService.createOrder.mockRejectedValue(
        new Error('Database error')
      );

      const response = await request(app)
        .post('/orders')
        .send({
          customerId: 'cust-456',
          items: [mockOrderItem],
        });

      expect(response.status).toBe(500);
    });
  });

  describe('GET /orders/:id', () => {
    it('should return order when found', async () => {
      mockOrderService.getOrder.mockResolvedValue(mockOrder);

      const response = await request(app).get('/orders/550e8400-e29b-41d4-a716-446655440000');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.customerId).toBe('cust-456');
    });

    it('should return 404 when order not found', async () => {
      mockOrderService.getOrder.mockResolvedValue(null);

      const response = await request(app).get('/orders/550e8400-e29b-41d4-a716-446655440000');

      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid UUID format', async () => {
      const response = await request(app).get('/orders/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('UUID');
    });

    it('should return 500 when service throws error', async () => {
      mockOrderService.getOrder.mockRejectedValue(new Error('DB error'));

      const response = await request(app).get('/orders/550e8400-e29b-41d4-a716-446655440000');

      expect(response.status).toBe(500);
    });
  });

  describe('PUT /orders/:id', () => {
    it('should update order successfully', async () => {
      const updatedOrder = new Order('cust-456', [mockOrderItem], OrderStatus.CONFIRMED);
      mockOrderService.updateOrder.mockResolvedValue(updatedOrder);

      const response = await request(app)
        .put('/orders/550e8400-e29b-41d4-a716-446655440000')
        .send({
          status: OrderStatus.CONFIRMED,
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('CONFIRMED');
    });

    it('should return 404 when order not found', async () => {
      mockOrderService.updateOrder.mockResolvedValue(null as any);

      const response = await request(app)
        .put('/orders/550e8400-e29b-41d4-a716-446655440000')
        .send({
          status: OrderStatus.CONFIRMED,
        });

      expect(response.status).toBe(404);
    });

    it('should return 400 for empty update data', async () => {
      const response = await request(app)
        .put('/orders/550e8400-e29b-41d4-a716-446655440000')
        .send({});

      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid UUID', async () => {
      const response = await request(app)
        .put('/orders/invalid-uuid')
        .send({
          status: OrderStatus.CONFIRMED,
        });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /orders/:id', () => {
    it('should delete order successfully', async () => {
      mockOrderService.deleteOrder.mockResolvedValue();

      const response = await request(app).delete('/orders/550e8400-e29b-41d4-a716-446655440000');

      expect(response.status).toBe(204);
    });

    it('should return 404 when order not found', async () => {
      mockOrderService.deleteOrder.mockRejectedValue(
        Object.assign(new Error('Not found'), { type: 'NOT_FOUND' })
      );

      const response = await request(app).delete('/orders/550e8400-e29b-41d4-a716-446655440000');

      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid UUID', async () => {
      const response = await request(app).delete('/orders/bad-id');

      expect(response.status).toBe(400);
    });

    it('should return 500 when service throws unexpected error', async () => {
      mockOrderService.deleteOrder.mockRejectedValue(new Error('DB failure'));

      const response = await request(app).delete('/orders/550e8400-e29b-41d4-a716-446655440000');

      expect(response.status).toBe(500);
    });
  });

  describe('Error handling', () => {
    it('should handle validation errors from DTO middleware', async () => {
      const response = await request(app)
        .post('/orders')
        .send({
          customerId: 'valid-customer-id',
          items: [
            {
              productId: 'prod-1',
              productName: 'Product 1',
              quantity: 1,
              unitPrice: 10,
            },
          ],
        });

      expect(response.status).not.toBe(500);
    });

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/orders')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }');

      expect(response.status).toBe(400);
    });
  });
});