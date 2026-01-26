export interface RegisterDto {
  email: string;
  name: string;
  password: string;
  phone: string;
}

export function validateRegisterDto(dto: RegisterDto): string[] {
  const errors: string[] = [];

  if (!dto.email || !dto.email.includes('@')) {
    errors.push('Email must be valid');
  }
  if (!dto.name || dto.name.length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  if (!dto.password || dto.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  if (!dto.phone || dto.phone.length < 10) {
    errors.push('Phone must be at least 10 characters');
  }

  return errors;
}
