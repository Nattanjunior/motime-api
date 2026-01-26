import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../../../interfaces/dtos/Register.dto';
import { IUserRepository } from '../../../domain/auth/repositories/IUserRepository';
import { User } from '../../../domain/auth/entities/User';
import { Email } from '../../../domain/auth/value-objects/Email';
import { Password } from '../../../domain/auth/value-objects/Password';
import { Phone } from '../../../domain/auth/value-objects/Phone';
import { UserAlreadyExistsError } from '../../../domain/auth/errors/AuthErrors';
import { ConflictException } from 'src/shared/exceptions/custom.exceptions';
import type { UserRecord } from 'src/types/UserRecord';

@Injectable()
export class RegisterUser {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    dto: RegisterDto,
  ): Promise<{ user: UserRecord; message: string }> {
    const { email, name, password, phone } = dto;

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    try {
      // Create domain value objects
      const emailVO = new Email(email);
      const passwordVO = new Password(password);
      const phoneVO = new Phone(phone);

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      const hashedPasswordVO = new Password(hashedPassword);

      // Create domain entity
      const user = User.create(name, emailVO, hashedPasswordVO, phoneVO);

      // Persist to repository
      const createdUser = await this.userRepository.create(user);

      // Return response
      return {
        user: {
          id: createdUser.getId().getValue(),
          name: createdUser.getName(),
          email: createdUser.getEmail().getValue(),
          phone: createdUser.getPhone().getValue(),
          password: createdUser.getPassword().getValue(),
          createdAt: createdUser.getCreatedAt(),
          updatedAt: createdUser.getUpdatedAt(),
        },
        message: 'User registered successfully',
      };
    } catch (error) {
      if (error.name === 'ConflictException') {
        throw error;
      }
      throw new ConflictException(error.message);
    }
  }
}
