import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateMenuDto {
  name!: string;
  description!: string;

  @Transform(({ value }) => parseFloat(value))
  price!: number;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Gambar menu makanan/minuman' })
  image?: any; // Handled as file upload, not part of JSON body

  @Transform(({ value }) => value === 'true' || value === true)
  isAvailable?: boolean;
}
