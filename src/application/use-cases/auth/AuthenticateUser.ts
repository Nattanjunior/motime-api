import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthenticateDto } from '../../../interfaces/dtos/Authenticate.dto';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';

export class AuthenticateUser {
  private readonly jwt: JwtService;
  private readonly prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.jwt = new JwtService({
      secret: process.env.JWT_SECRET ?? 'dev-secret',
    });
    this.prisma = prisma;
  }

  async execute(dto: AuthenticateDto): Promise<{ access_token: string }> {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid Credentials');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Invalid Credentials');
    }

    const token = await this.jwt.signAsync({
      name: user.name,
      email: user.email,
      sub: user.id,
    });

    return { access_token: token };
  }
}
