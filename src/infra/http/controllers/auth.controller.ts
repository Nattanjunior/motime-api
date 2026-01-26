import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AuthenticateUser } from '../../application/use-cases/auth/AuthenticateUser';
import { RegisterUser } from '../../application/use-cases/auth/RegisterUser';
import {
  AuthenticateDto,
  validateAuthenticateDto,
} from '../../interfaces/dtos/Authenticate.dto';
import {
  RegisterDto,
  validateRegisterDto,
} from '../../interfaces/dtos/Register.dto';
import { LoginResponseDto } from '../../interfaces/dtos/LoginResponse.dto';
import { UserProfileDto } from '../../interfaces/dtos/UserProfile.dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { BadRequestException } from '../../shared/exceptions/custom.exceptions';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authenticateUser: AuthenticateUser,
    private readonly registerUser: RegisterUser,
  ) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() registerDto: RegisterDto): Promise<UserProfileDto> {
    const errors = validateRegisterDto(registerDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors.join(', '));
    }

    const result = await this.registerUser.execute(registerDto);
    return {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      createdAt: result.user.createdAt,
      updatedAt: result.user.updatedAt,
    };
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() authenticateDto: AuthenticateDto,
  ): Promise<LoginResponseDto> {
    const errors = validateAuthenticateDto(authenticateDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors.join(', '));
    }

    const result = await this.authenticateUser.execute(authenticateDto);
    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: any): Promise<UserProfileDto> {
    return {
      id: user.userId,
      name: user.name,
      email: user.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
