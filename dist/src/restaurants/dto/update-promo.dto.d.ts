import { PromoType } from '@prisma/client';
export declare class UpdatePromoDto {
    type?: PromoType;
    discount?: number;
    startHour?: string;
    endHour?: string;
    menuIds?: string[];
}
