export interface UserRecord {
  id?: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  stripeCustomerId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
