import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../../../interfaces/dtos/Register.dto';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import type { UserRecord } from 'src/types/UserRecord';

export class RegisterUser {
  private readonly prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.prisma = prisma;
  }

  async execute(
    dto: RegisterDto,
  ): Promise<{ user: UserRecord; message: string }> {
    const { email, name, password, phone } = dto;

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      await this.prisma.$disconnect().catch(() => {});
      throw new Error('Email already exists');
    }

    const hashed = await bcrypt.hash(password, 10);
    const createUser = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashed,
        phone,
      },
    });
    return { user: createUser, message: 'User registered successfully' };
  }
}
