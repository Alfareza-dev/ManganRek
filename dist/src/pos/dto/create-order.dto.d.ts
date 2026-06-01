import { PaymentMethod } from '@prisma/client';
export declare class OrderItemDto {
    menuId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    customerName: string;
    items: OrderItemDto[];
    paymentMethod: PaymentMethod;
}
