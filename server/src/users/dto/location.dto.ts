import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LocationDto {
  @ApiProperty({ description: 'Country of the institute', example: 'Country' })
  @IsString()
  country: string;

  @ApiProperty({ description: 'City of the institute', example: 'City' })
  @IsString()
  city: string;
}
