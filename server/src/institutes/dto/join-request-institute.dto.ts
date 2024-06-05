import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { JoinRequestStatus } from 'src/Types/institute.types';

export class CreateJoinRequestDto {
  @IsOptional()
  @IsString()
  member: Types.ObjectId;

  @ApiProperty({
    description: 'ID of the institute to which the request is made',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  readonly institute: Types.ObjectId;

  @IsOptional()
  @IsEnum(JoinRequestStatus)
  status: JoinRequestStatus;
}
