import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { UserStatus, UserType, FoundFrom } from 'src/Types/user.types';
import { LocationDto } from './location.dto';

export class CreateUserDto {
  @ApiProperty({ description: 'First name of the user', example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Last name of the user', example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Avatar URL of the user',
    example: 'https://example.com/avatar.jpg',
  })
  @IsString()
  avatar: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @IsString()
  email: string;

  @ApiPropertyOptional({
    enum: UserStatus,
    description: 'Status of the user',
    example: UserStatus.VERIFIED,
  })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;

  @ApiPropertyOptional({
    enum: UserType,
    description: 'Type of the user',
    example: UserType.MEMBER,
  })
  @IsEnum(UserType)
  @IsOptional()
  type?: UserType;

  @ApiProperty({ type: LocationDto })
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ApiPropertyOptional({
    description: 'Birthday of the user',
    example: '1990-01-01',
  })
  @IsDateString()
  @IsOptional()
  birthday?: Date;

  @ApiPropertyOptional({
    description: 'Phone number of the user',
    example: '+94123456789',
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({
    enum: FoundFrom,
    description: 'How the user found the platform',
    example: FoundFrom.FACEBOOK,
  })
  @IsEnum(FoundFrom)
  @IsOptional()
  foundFrom?: FoundFrom;

  @ApiPropertyOptional({
    description: 'Institute ID of the user',
    type: String,
    example: '60d0fe4f5311236168a109ca',
  })
  @IsString()
  @IsOptional()
  institute?: string;
}
