export interface AuthenticateDto {
  email: string;
  password: string;
}

export function validateAuthenticateDto(dto: AuthenticateDto): string[] {
  const errors: string[] = [];

  if (!dto.email || !dto.email.includes('@')) {
    errors.push('Email must be valid');
  }
  if (!dto.password || dto.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  return errors;
}
