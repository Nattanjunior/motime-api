import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { AuthenticateUser } from '../../application/use-cases/auth/AuthenticateUser';
import { RegisterUser } from '../../application/use-cases/auth/RegisterUser';
import { AuthenticateDto } from '../../interfaces/dtos/Authenticate.dto';
import { RegisterDto } from '../../interfaces/dtos/Register.dto';
import { LoginResponseDto } from '../../interfaces/dtos/LoginResponse.dto';
import { UserProfileDto } from '../../interfaces/dtos/UserProfile.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authenticateUser: AuthenticateUser,
    private readonly registerUser: RegisterUser,
  ) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() registerDto: RegisterDto): Promise<UserProfileDto> {
    const user = await this.registerUser.execute(registerDto);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() authenticateDto: AuthenticateDto): Promise<LoginResponseDto> {
    const result = await this.authenticateUser.execute(authenticateDto);
    return {
      accessToken: result.accessToken,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
      },
    };
  }

  @Get('profile')
  async getProfile(@Request() req: any): Promise<UserProfileDto> {
    // This would require JWT guard to be implemented
    const user = req.user;
    return {
      id: user.sub,
      name: user.name,
      email: user.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
