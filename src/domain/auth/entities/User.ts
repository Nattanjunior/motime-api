import { Email } from '../value-objects/Email';
import { Password } from '../value-objects/Password';
import { Phone } from '../value-objects/Phone';
import { UserId } from '../value-objects/UserId';

export class User {
  private id: UserId;
  private name: string;
  private email: Email;
  private password: Password;
  private phone: Phone;
  private stripeCustomerId: string | null;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    id: UserId,
    name: string,
    email: Email,
    password: Password,
    phone: Phone,
    stripeCustomerId: string | null = null,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.stripeCustomerId = stripeCustomerId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  getId(): UserId {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): Email {
    return this.email;
  }

  getPassword(): Password {
    return this.password;
  }

  getPhone(): Phone {
    return this.phone;
  }

  getStripeCustomerId(): string | null {
    return this.stripeCustomerId;
  }

  setStripeCustomerId(customerId: string): void {
    this.stripeCustomerId = customerId;
    this.updatedAt = new Date();
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  updateProfile(name: string, phone: Phone): void {
    this.name = name;
    this.phone = phone;
    this.updatedAt = new Date();
  }

  static create(
    name: string,
    email: Email,
    password: Password,
    phone: Phone,
    stripeCustomerId?: string,
  ): User {
    return new User(
      UserId.create(),
      name,
      email,
      password,
      phone,
      stripeCustomerId || null,
    );
  }

  static reconstruct(
    id: string,
    name: string,
    email: string,
    password: string,
    phone: string,
    stripeCustomerId: string | null,
    createdAt: Date,
    updatedAt: Date,
  ): User {
    return new User(
      new UserId(id),
      name,
      new Email(email),
      new Password(password),
      new Phone(phone),
      stripeCustomerId,
      createdAt,
      updatedAt,
    );
  }
}
