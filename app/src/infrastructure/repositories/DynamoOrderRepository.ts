import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { Order, OrderItem, OrderStatus } from '../../domain/models/Order';
import { OrderRepository } from '../../domain/ports/OrderRepository';

export class DynamoOrderRepository implements OrderRepository {
    private readonly client: DynamoDBDocumentClient;
    private readonly tableName: string;

    constructor(client: DynamoDBClient, tableName: string = 'Orders') {
        this.client = DynamoDBDocumentClient.from(client);
        this.tableName = tableName;
    }

    async create(order: Order): Promise<Order> {
        const params = {
            TableName: this.tableName,
            Item: {
                id: order.id,
                customerId: order.customerId,
                items: order.items.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                status: order.status,
                total: order.calculateTotal(),
                createdAt: order.createdAt.toISOString(),
                updatedAt: order.updatedAt.toISOString()
            },
            ConditionExpression: 'attribute_not_exists(id)'
        };

        try {
            await this.client.send(new PutCommand(params));
            return order;
        } catch (error) {
            if (error instanceof Error && error.name === 'ConditionalCheckFailedException') {
                throw new Error('Order with this ID already exists');
            }
            throw error;
        }
    }

    async findById(id: string): Promise<Order | null> {
        const params = {
            TableName: this.tableName,
            Key: { id }
        };

        const result = await this.client.send(new GetCommand(params));
        if (!result.Item) {
            return null;
        }

        return this.mapDynamoItemToOrder(result.Item);
    }

    async update(order: Order): Promise<Order> {
        const params = {
            TableName: this.tableName,
            Key: { id: order.id },
            UpdateExpression: 'SET customerId = :customerId, items = :items, status = :status, total = :total, updatedAt = :updatedAt',
            ExpressionAttributeValues: {
                ':customerId': order.customerId,
                ':items': order.items.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                ':status': order.status,
                ':total': order.calculateTotal(),
                ':updatedAt': order.updatedAt.toISOString()
            },
            ReturnValues: 'ALL_NEW' as const
        };

        const result = await this.client.send(new UpdateCommand(params));
        if (!result.Attributes) {
            throw new Error('Order not found');
        }

        return this.mapDynamoItemToOrder(result.Attributes);
    }

    async delete(id: string): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: { id }
        };

        await this.client.send(new DeleteCommand(params));
    }

    async findByCustomerId(customerId: string): Promise<Order[]> {
        const params = {
            TableName: this.tableName,
            IndexName: 'customerId-index',
            KeyConditionExpression: 'customerId = :customerId',
            ExpressionAttributeValues: {
                ':customerId': customerId
            }
        };

        const result = await this.client.send(new QueryCommand(params));
        if (!result.Items) {
            return [];
        }

        return result.Items.map(item => this.mapDynamoItemToOrder(item));
    }

    private mapDynamoItemToOrder(item: Record<string, unknown>): Order {
        const items = (item.items as Array<Record<string, unknown>>).map((i) => ({
            productId: i.productId as string,
            name: i.name as string,
            price: i.price as number,
            quantity: i.quantity as number
        }));

        const order = new Order(
            item.customerId as string,
            items,
            item.status as OrderStatus
        );

        Object.defineProperty(order, '_id', { value: item.id });
        Object.defineProperty(order, '_createdAt', { value: new Date(item.createdAt as string) });
        Object.defineProperty(order, '_updatedAt', { value: new Date(item.updatedAt as string) });

        return order;
    }
}