import { OrderStatus } from '../../domain/models/Order';

export interface OrderItemResponse {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export class OrderResponseDTO {
    readonly id: string;
    readonly customerId: string;
    readonly items: OrderItemResponse[];
    readonly status: OrderStatus;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly total: number;
    readonly notes?: string;

    constructor(
        id: string,
        customerId: string,
        items: OrderItemResponse[],
        status: OrderStatus,
        createdAt: Date,
        updatedAt: Date,
        total: number,
        notes?: string
    ) {
        this.id = id;
        this.customerId = customerId;
        this.items = items;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.total = total;
        this.notes = notes;
    }

    static fromDomain(order: any): OrderResponseDTO {
        const items: OrderItemResponse[] = order.items.map((item: any) => ({
            productId: item.productId,
            productName: item.name,
            quantity: item.quantity,
            unitPrice: item.price,
            subtotal: (item.price || 0) * (item.quantity || 0)
        }));

        const total = order.calculateTotal ? order.calculateTotal() : 0;

        return new OrderResponseDTO(
            order.id,
            order.customerId,
            items,
            order.status,
            order.createdAt,
            order.updatedAt,
            total,
            (order as any).notes
        );
    }

    toJSON(): Record<string, any> {
        return {
            id: this.id,
            customerId: this.customerId,
            items: this.items,
            status: this.status,
            createdAt: this.createdAt instanceof Date ? this.createdAt.toISOString() : this.createdAt,
            updatedAt: this.updatedAt instanceof Date ? this.updatedAt.toISOString() : this.updatedAt,
            total: this.total,
            notes: this.notes
        };
    }

    isActive(): boolean {
        return this.status !== OrderStatus.CANCELLED && this.status !== OrderStatus.DELIVERED;
    }

    canTransitionTo(newStatus: OrderStatus): boolean {
        const validTransitions: Partial<Record<OrderStatus, OrderStatus[]>> = {
            [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
            [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
            [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
            [OrderStatus.DELIVERED]: [],
            [OrderStatus.CANCELLED]: []
        };
        const transitions = validTransitions[this.status];
        return transitions ? transitions.includes(newStatus) : false;
    }

    getItemCount(): number {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    getTotalItems(): number {
        return this.items.length;
    }
}