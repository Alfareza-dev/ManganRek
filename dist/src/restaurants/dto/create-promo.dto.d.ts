import { PromoType } from '@prisma/client';
export declare class CreatePromoDto {
    type?: PromoType;
    discount: number;
    startHour: string;
    endHour: string;
    menuIds?: string[];
}
