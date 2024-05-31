import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
  Res,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CognitoService } from './CognitoService';
import { AuthGuard } from '@nestjs/passport';
import { ClsService } from 'nestjs-cls';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ConfirmForgotPasswordDto } from './dto/confirm-forgot-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UserAuthType, UserStatus, UserType } from 'src/Types/user.types';
import { ReRequestCodeDto } from './dto/re-request-code.dto';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Response } from 'express';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cognitoService: CognitoService,
    private readonly clsService: ClsService,
    private readonly usersService: UsersService,
    private configService: ConfigService,
  ) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      createUserDto.userAuthType = UserAuthType.COGNITO;
      const user = await this.cognitoService.registerUser(createUserDto);
      return user;
    } catch (err) {
      throw new HttpException(`${err.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: UserLoginDto })
  @ApiResponse({ status: 200, description: 'User login successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto) {
    try {
      const user = await this.usersService.findOne({
        email: userLoginDto.email,
      });
      if (!user) {
        throw new HttpException(`User not found!`, HttpStatus.NOT_FOUND);
      } else if (user.status == UserStatus.UNVERIFIED) {
        throw new HttpException(
          'User Email not Confirmed',
          HttpStatus.UNAUTHORIZED,
        );
      } else if (user.status == UserStatus.INACTIVE) {
        throw new HttpException('Institute_Inactive', HttpStatus.UNAUTHORIZED);
      }
      const tokens = await this.cognitoService.authenticateUser(
        userLoginDto.email,
        userLoginDto.password,
      );
      return { message: 'User login successfully', profile: user, tokens };
    } catch (err) {
      throw new HttpException(`${err.message}`, HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token using a refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    try {
      const tokens = await this.cognitoService.refreshToken(refreshTokenDto);
      return {
        message: 'Token refreshed successfully',
        tokens,
      };
    } catch (err) {
      throw new HttpException(`${err.message}`, HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify user email' })
  @ApiBody({ type: VerifyEmailDto })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    try {
      await this.cognitoService.verifyEmail(verifyEmailDto);
      return { statusCode: 200, message: 'Email verified successfully' };
    } catch (error) {
      throw new HttpException(`${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Initiate forgot password process' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: 'Verification code sent' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    try {
      await this.cognitoService.forgotPassword(forgotPasswordDto.email);
      return {
        statusCode: 200,
        message:
          'Verification code sent to your email. Please check your inbox.',
      };
    } catch (error) {
      throw new HttpException(`${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Confirm new password with verification code' })
  @ApiBody({ type: ConfirmForgotPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('confirm-forgot-password')
  async confirmForgotPassword(
    @Body() confirmForgotPasswordDto: ConfirmForgotPasswordDto,
  ) {
    try {
      await this.cognitoService.confirmForgotPassword(
        confirmForgotPasswordDto.email,
        confirmForgotPasswordDto.confirmationCode,
        confirmForgotPasswordDto.newPassword,
      );
      return {
        statusCode: 200,
        message: 'Your password has been reset successfully.',
      };
    } catch (error) {
      throw new HttpException(`${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'User Profile' })
  @ApiResponse({ status: 200, description: 'JWT Token is valid' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('profile')
  testJwt() {
    return this.authService.profile();
  }

  @ApiOperation({ summary: 'Request a new verification code' })
  @ApiBody({ type: ReRequestCodeDto })
  @ApiResponse({ status: 200, description: 'Verification code sent' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 405, description: 'Not Allowed' })
  @Post('request-verification-code')
  async requestVerificationCode(@Body() reRequestCodeDto: ReRequestCodeDto) {
    const user = await this.usersService.findOne({
      email: reRequestCodeDto.email,
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.status === UserStatus.VERIFIED) {
      throw new HttpException(
        'User already verified',
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    }

    try {
      await this.cognitoService.resendConfirmationCode(reRequestCodeDto);
      return {
        statusCode: 200,
        message:
          'Verification code has been sent to your email. Please check your inbox.',
      };
    } catch (error) {
      throw new HttpException(`${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('sso-sing-in')
  googleSignIn(@Res() res: Response) {
    const url = this.cognitoService.getGoogleSignInUrl();
    res.redirect(url);
  }

  @Get('sso-callback')
  async handleCallback(@Query('code') code: string, @Res() res: Response) {
    try {
      const tokens = await this.cognitoService.exchangeCodeForToken(code);
      const idToken = tokens.id_token;
      const refreshToken = tokens.refresh_token;

      // Decode the ID token
      const decodedToken = this.authService.decodeJwtToken(idToken);

      // Extract user information from the decoded token
      const email = decodedToken.email;
      const firstName = decodedToken.given_name;
      const lastName = decodedToken.family_name || '‎';
      const picture = decodedToken.picture;
      const userId = decodedToken.sub;

      // Check if the user already exists in your database
      let user = await this.usersService.findOne({ email });

      if (!user) {
        // If the user doesn't exist, create a new user record
        const createUserDto: CreateUserDto = {
          email,
          firstName,
          lastName: lastName || '‎',
          avatar: picture,
          type: UserType.MEMBER,
          status: UserStatus.INITIATE,
          cognitoUserId: userId,
          userAuthType: UserAuthType.GOOGLE,
        };
        user = await this.usersService.create(createUserDto);
      }
      // Redirect the user to the frontend with the token
      const frontendUrl = `${this.configService.get<string>('FRONTEND_URL')}/ProfileHandler?token=${idToken}?refreshToken=${refreshToken}`;
      res.redirect(frontendUrl);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('An error occurred');
    }
  }
}
