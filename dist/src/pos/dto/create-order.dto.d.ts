import { PaymentMethod } from '@prisma/client';
export declare class OrderItemDto {
    menuId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    items: OrderItemDto[];
    paymentMethod: PaymentMethod;
}
