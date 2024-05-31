import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class LocationDto {
  @ApiProperty({ description: 'Country of the institute', example: 'Country' })
  @IsString()
  @IsOptional()
  country: string;

  @ApiProperty({ description: 'City of the institute', example: 'City' })
  @IsString()
  @IsOptional()
  city: string;
}
