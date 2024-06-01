import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
  ValidateNested,
  Matches,
} from 'class-validator';
import {
  UserStatus,
  UserType,
  FoundFrom,
  UserAuthType,
} from 'src/Types/user.types';
import { LocationDto } from './location.dto';

export class CreateUserDto {
  cognitoUserId?: string;

  userAuthType: UserAuthType;

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

  @ApiProperty({ description: 'Password of the user', example: 'password123' })
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
    {
      message:
        'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
    },
  )
  password?: string;

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;

  @IsEnum(UserType)
  @IsOptional()
  type?: UserType;

  @ApiProperty({ type: LocationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

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
