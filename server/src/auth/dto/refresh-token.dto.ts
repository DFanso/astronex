import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'The refresh token used to obtain a new access token',
    example: 'your-refresh-token',
  })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({
    description: 'The Cognito User ID associated with the refresh token',
    example: '692ab58c-5021-t0bb-3e2f-85b27f61cd42',
  })
  @IsNotEmpty()
  @IsString()
  cognitoUserId: string;
}
