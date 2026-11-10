import { IsString, IsOptional, IsArray, ValidateNested, IsEnum, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../../domain/models/Order';

export class UpdateOrderItemDTO {
    @IsString()
    @IsOptional()
    productId?: string;

    @IsString()
    @IsOptional()
    productName?: string;

    @IsNumber()
    @Min(1)
    @IsOptional()
    quantity?: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    unitPrice?: number;
}

export class UpdateOrderDTO {
    @IsOptional()
    @IsString({ message: 'El ID del cliente debe ser una cadena de texto' })
    customerId?: string;

    @IsOptional()
    @IsArray({ message: 'Los items deben ser un arreglo' })
    @ValidateNested({ each: true })
    @Type(() => UpdateOrderItemDTO)
    items?: UpdateOrderItemDTO[];

    @IsOptional()
    @IsEnum(OrderStatus, { message: 'Estado de orden inválido' })
    status?: OrderStatus;

    @IsOptional()
    @IsString({ message: 'Las notas deben ser texto' })
    notes?: string;

    constructor(data?: Partial<UpdateOrderDTO>) {
        if (data) {
            this.customerId = data.customerId;
            this.items = data.items;
            this.status = data.status;
            this.notes = data.notes;
        }
    }

    hasChanges(): boolean {
        return !!(
            this.customerId !== undefined ||
            this.items !== undefined ||
            this.status !== undefined ||
            this.notes !== undefined
        );
    }

    validatePartial(): void {
        if (this.items !== undefined && this.items.length === 0) {
            throw new Error('No se puede actualizar la orden con un arreglo de items vacío');
        }
        if (this.items) {
            this.items.forEach((item, index) => {
                if (item.quantity !== undefined && item.quantity <= 0) {
                    throw new Error(`Item en posición ${index}: la cantidad debe ser mayor a 0`);
                }
                if (item.unitPrice !== undefined && item.unitPrice < 0) {
                    throw new Error(`Item en posición ${index}: el precio no puede ser negativo`);
                }
            });
        }
    }
}