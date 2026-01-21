import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infra/database/prisma/prisma.module';
import { RegisterUser } from './RegisterUser';
import { AuthenticateUser } from './AuthenticateUser';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [RegisterUser, AuthenticateUser],
})
export class AuthModule {}
