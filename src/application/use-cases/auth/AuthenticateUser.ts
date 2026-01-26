import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthenticateDto } from '../../../interfaces/dtos/Authenticate.dto';
import { IUserRepository } from '../../../domain/auth/repositories/IUserRepository';
import { InvalidCredentialsError } from '../../../domain/auth/errors/AuthErrors';
import { UnauthorizedException } from 'src/shared/exceptions/custom.exceptions';

@Injectable()
export class AuthenticateUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(
    dto: AuthenticateDto,
  ): Promise<{
    accessToken: string;
    user: { id: string; name: string; email: string };
  }> {
    const { email, password } = dto;

    // Find user by email from repository
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const validPassword = await bcrypt.compare(
      password,
      user.getPassword().getValue(),
    );
    if (!validPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const token = this.jwtService.sign({
      name: user.getName(),
      email: user.getEmail().getValue(),
      sub: user.getId().getValue(),
    });

    return {
      accessToken: token,
      user: {
        id: user.getId().getValue(),
        name: user.getName(),
        email: user.getEmail().getValue(),
      },
    };
  }
}
