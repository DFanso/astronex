import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { LocationDto } from './location.dto';

export class CreateInstituteDto {
  @ApiProperty({
    description: 'Name of the institute',
    example: 'Tech University',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Email address of the Institute',
    example: 'john.doe@example.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Description of the institute',
    example: 'A leading tech university',
  })
  @IsString()
  description: string;

  @ApiProperty({ type: LocationDto })
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsString()
  @IsOptional()
  secret: string;
}
