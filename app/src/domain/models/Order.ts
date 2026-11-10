import { v4 as uuidv4 } from 'uuid';

export interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

export class Order {
    private readonly _id: string;
    private _customerId: string;
    private _items: OrderItem[];
    private _status: OrderStatus;
    private _createdAt: Date;
    private _updatedAt: Date;

    constructor(customerId: string, items: OrderItem[], status: OrderStatus = OrderStatus.PENDING) {
        this._id = uuidv4();
        this._customerId = customerId;
        this._items = items;
        this._status = status;
        this._createdAt = new Date();
        this._updatedAt = new Date();
    }

    get id(): string {
        return this._id;
    }

    get customerId(): string {
        return this._customerId;
    }

    set customerId(value: string) {
        this._customerId = value;
        this._updatedAt = new Date();
    }

    get items(): OrderItem[] {
        return this._items;
    }

    set items(value: OrderItem[]) {
        this._items = value;
        this._updatedAt = new Date();
    }

    get status(): OrderStatus {
        return this._status;
    }

    set status(value: OrderStatus) {
        this._status = value;
        this._updatedAt = new Date();
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    calculateTotal(): number {
        return this._items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    addItem(item: OrderItem): void {
        this._items.push(item);
        this._updatedAt = new Date();
    }

    removeItem(productId: string): void {
        this._items = this._items.filter(item => item.productId !== productId);
        this._updatedAt = new Date();
    }
}