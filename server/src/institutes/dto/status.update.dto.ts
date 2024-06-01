import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { instituteStatus } from 'src/Types/institute.types';

enum status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class StatusUpdateDto {
  @ApiProperty({
    description: 'New Status  of the institute',
    example: status.ACTIVE,
  })
  @IsEnum(instituteStatus)
  Status: instituteStatus;
}
