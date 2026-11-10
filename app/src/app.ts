import express, { Application, Request, Response, NextFunction } from 'express';
import 'reflect-metadata';
import { OrderController } from './infrastructure/controllers/OrderController';
import { errorHandler } from './infrastructure/middlewares/errorHandler';
import { validateQueryParams } from './infrastructure/middlewares/validationMiddleware';
import { createDynamoDBClient as createDynamoClient } from './infrastructure/config/dynamoConfig';
import { DynamoOrderRepository } from './infrastructure/repositories/DynamoOrderRepository';
import { OrderService } from './application/services/OrderService';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dynamoClient = createDynamoClient();
const orderRepository = new DynamoOrderRepository(dynamoClient, process.env.DYNAMODB_TABLE || 'Orders');
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(orderService);

app.use(validateQueryParams);

app.post('/orders', (req: Request, res: Response, next: NextFunction) => 
  orderController.createOrder(req, res, next));
app.get('/orders/:id', (req: Request, res: Response, next: NextFunction) => 
  orderController.getOrder(req, res, next));
app.put('/orders/:id', (req: Request, res: Response, next: NextFunction) => 
  orderController.updateOrder(req, res, next));
app.delete('/orders/:id', (req: Request, res: Response, next: NextFunction) => 
  orderController.deleteOrder(req, res, next));

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`DynamoDB Table: ${process.env.DYNAMODB_TABLE || 'Orders'}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;