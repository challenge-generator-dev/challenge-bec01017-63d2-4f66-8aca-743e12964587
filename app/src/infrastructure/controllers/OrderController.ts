import { Request, Response, NextFunction, Router } from 'express';
import { CreateOrderDTO } from '../../shared/dto/CreateOrderDTO';
import { UpdateOrderDTO } from '../../shared/dto/UpdateOrderDTO';
import { OrderResponseDTO } from '../../shared/dto/OrderResponseDTO';
import { OrderService, CreateOrderInput, UpdateOrderInput } from '../../application/services/OrderService';
import { OrderError } from '../../shared/errors/OrderError';

interface OrderItemInput {
    productId: string;
    quantity: number;
    name: string;
    price: number;
}

export class OrderController {
    private readonly router: Router;
    private readonly basePath = '/orders';

    constructor(private readonly orderService: OrderService) {
        this.router = Router();
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.router.post(this.basePath, this.createOrder.bind(this));
        this.router.get(`${this.basePath}/:id`, this.getOrder.bind(this));
        this.router.put(`${this.basePath}/:id`, this.updateOrder.bind(this));
        this.router.delete(`${this.basePath}/:id`, this.deleteOrder.bind(this));
    }

    getRouter(): Router {
        return this.router;
    }

    private mapItemsToOrderInput(items: Array<{ productId?: string; quantity?: number }>): OrderItemInput[] {
        return items.map((item): OrderItemInput => {
            const productId = item.productId ?? '';
            const quantity = item.quantity ?? 1;
            return {
                productId,
                quantity,
                name: productId,
                price: quantity * 100
            };
        });
    }

    async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const createOrderDTO: CreateOrderDTO = req.body;
            const input: CreateOrderInput = {
                customerId: createOrderDTO.customerId,
                items: this.mapItemsToOrderInput(createOrderDTO.items || [])
            };
            const order = await this.orderService.createOrder(input);
            const response: OrderResponseDTO = OrderResponseDTO.fromDomain(order);
            res.status(201).json(response.toJSON());
        } catch (error) {
            if (error instanceof OrderError) {
                res.status(500).json({ message: error.message, code: error.code });
                return;
            }
            next(error);
        }
    }

    async getOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const order = await this.orderService.getOrder(id);
            if (!order) {
                res.status(404).json({ message: 'Order not found', code: 'ORDER_NOT_FOUND' });
                return;
            }
            const response: OrderResponseDTO = OrderResponseDTO.fromDomain(order);
            res.status(200).json(response.toJSON());
        } catch (error) {
            if (error instanceof OrderError) {
                res.status(500).json({ message: error.message, code: error.code });
                return;
            }
            next(error);
        }
    }

    async updateOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const updateOrderDTO: UpdateOrderDTO = req.body;
            const input: UpdateOrderInput = {
                customerId: updateOrderDTO.customerId,
                items: updateOrderDTO.items ? this.mapItemsToOrderInput(updateOrderDTO.items) : undefined
            };
            const order = await this.orderService.updateOrder(id, input);
            if (!order) {
                res.status(404).json({ message: 'Order not found', code: 'ORDER_NOT_FOUND' });
                return;
            }
            const response: OrderResponseDTO = OrderResponseDTO.fromDomain(order);
            res.status(200).json(response.toJSON());
        } catch (error) {
            if (error instanceof OrderError) {
                res.status(500).json({ message: error.message, code: error.code });
                return;
            }
            next(error);
        }
    }

    async deleteOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            await this.orderService.deleteOrder(id);
            res.status(204).send();
        } catch (error) {
            if (error instanceof OrderError) {
                res.status(500).json({ message: error.message, code: error.code });
                return;
            }
            next(error);
        }
    }
}