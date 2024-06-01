import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsMongoId,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { LocationDto } from './location.dto';
import { Types } from 'mongoose';

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
    description: 'Password of the Institute',
    example: '123@Institute',
  })
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
    {
      message:
        'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
    },
  )
  password: string;

  @ApiProperty({
    description: 'Avatar URL of the user',
    example: 'https://example.com/avatar.jpg',
  })
  @IsString()
  avatar: string;

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

  @IsMongoId()
  @IsOptional()
  account: Types.ObjectId;

  @IsOptional()
  _id?: unknown;
}
