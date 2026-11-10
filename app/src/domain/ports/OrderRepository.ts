import { Order } from '../models/Order';

export interface OrderRepository {
    create(order: Order): Promise<Order>;
    findById(id: string): Promise<Order | null>;
    update(order: Order): Promise<Order>;
    delete(id: string): Promise<void>;
    findByCustomerId(customerId: string): Promise<Order[]>;
}