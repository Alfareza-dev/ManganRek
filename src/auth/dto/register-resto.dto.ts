import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class RegisterRestoDto {
  email!: string;
  password!: string;
  name!: string;
  restaurantName!: string;
  address!: string;

  @Transform(({ value }) => parseFloat(value))
  latitude!: number;

  @Transform(({ value }) => parseFloat(value))
  longitude!: number;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Berkas foto bukti legalitas restoran' })
  legalPhoto?: any; // Handled as file upload, not part of JSON body
}
