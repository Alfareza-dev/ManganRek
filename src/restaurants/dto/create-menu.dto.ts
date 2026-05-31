export class CreateMenuDto {
  name!: string;
  description!: string;
  price!: number;
  image!: string;
  isAvailable?: boolean;
}
