export class CreateSubscriptionDto {
  priceId: string;
}

export function validateCreateSubscriptionDto(
  dto: CreateSubscriptionDto,
): string[] {
  const errors: string[] = [];

  if (!dto.priceId || dto.priceId.trim().length === 0) {
    errors.push('priceId is required');
  }

  return errors;
}
