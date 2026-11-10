import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import { OrderController } from './infrastructure/controllers/OrderController';
import { errorHandler } from './infrastructure/middlewares/errorHandler';
import { validateDto } from './infrastructure/middlewares/validationMiddleware';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { CreateOrderDTO } from './shared/dto/CreateOrderDTO';
import { UpdateOrderDTO } from './shared/dto/UpdateOrderDTO';
import dotenv from 'dotenv';

dotenv.config();

const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'fakeAccessKeyId',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'fakeSecretAccessKey',
  },
});

const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const orderController = new OrderController(docClient as any);

app.post(
  '/orders',
  validateDto(CreateOrderDTO),
  (req: Request, res: Response, next: NextFunction) => {
    orderController.createOrder(req, res, next);
  }
);

app.get('/orders/:id', (req: Request, res: Response, next: NextFunction) => {
  orderController.getOrder(req, res, next);
});

app.put(
  '/orders/:id',
  validateDto(UpdateOrderDTO),
  (req: Request, res: Response, next: NextFunction) => {
    orderController.updateOrder(req, res, next);
  }
);

app.delete('/orders/:id', (req: Request, res: Response, next: NextFunction) => {
  orderController.deleteOrder(req, res, next);
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});