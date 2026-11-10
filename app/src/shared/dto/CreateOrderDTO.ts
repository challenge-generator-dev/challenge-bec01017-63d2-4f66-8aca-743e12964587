import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional, Min, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDTO {
    @IsString()
    @IsNotEmpty()
    productId!: string;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsNumber()
    @Min(1)
    quantity!: number;

    @IsNumber()
    @Min(0)
    price!: number;
}

export class CreateOrderDTO {
    @IsString()
    @IsNotEmpty({ message: 'El ID del cliente es requerido' })
    customerId!: string;

    @IsArray({ message: 'Los items de la orden deben ser un arreglo' })
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDTO)
    @IsNotEmpty({ message: 'La orden debe contener al menos un item' })
    items!: CreateOrderItemDTO[];

    @IsOptional()
    @IsString()
    notes?: string;

    constructor(data?: Partial<CreateOrderDTO>) {
        if (data) {
            this.customerId = data.customerId!;
            this.items = data.items!;
            this.notes = data.notes;
        }
    }

    validate(): void {
        if (!this.customerId || this.customerId.trim().length === 0) {
            throw new Error('El ID del cliente no puede estar vacío');
        }
        if (!this.items || this.items.length === 0) {
            throw new Error('La orden debe contener al menos un item');
        }
        this.items.forEach((item, index) => {
            if (!item.productId || !item.name) {
                throw new Error(`Item en posición ${index}: producto inválido`);
            }
            if (item.quantity <= 0 || item.price < 0) {
                throw new Error(`Item en posición ${index}: cantidad o precio inválido`);
            }
        });
    }
}