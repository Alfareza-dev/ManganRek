import { PromoType } from '@prisma/client';

export class CreatePromoDto {
  type?: PromoType;
  discount!: number;
  startHour!: string; // Format HH:MM
  endHour!: string;   // Format HH:MM
  menuIds?: string[];
}
