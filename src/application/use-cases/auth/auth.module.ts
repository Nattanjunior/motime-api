import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infra/database/prisma/prisma.module';
import { RegisterUser } from './RegisterUser';
import { AuthenticateUser } from './AuthenticateUser';
import { UserRepository } from 'src/infra/database/repositories/UserRepository';
import { IUserRepository } from 'src/domain/auth/repositories/IUserRepository';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [
    RegisterUser,
    AuthenticateUser,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
  ],
  exports: [RegisterUser, AuthenticateUser, IUserRepository],
})
export class AuthModule {}
