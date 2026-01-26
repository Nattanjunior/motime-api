import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { CreatedSubsUseCase } from '../../application/use-cases/subscription/createdSubsUseCase';
import {
  CreateSubscriptionDto,
  validateCreateSubscriptionDto,
} from '../../interfaces/dtos/CreateSubscription.dto';
import { SubscriptionResponseDto } from '../../interfaces/dtos/SubscriptionResponse.dto';
import { SubscriptionRepository } from '../../domain/prisma/subscription.repository';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { BadRequestException } from '../../shared/exceptions/custom.exceptions';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(
    private readonly createdSubsUseCase: CreatedSubsUseCase,
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  @Post()
  @HttpCode(201)
  async create(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @CurrentUser() user: any,
  ): Promise<SubscriptionResponseDto> {
    const errors = validateCreateSubscriptionDto(createSubscriptionDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors.join(', '));
    }

    const userId = user.userId;
    const subscription = await this.createdSubsUseCase.execute({
      userId,
      priceId: createSubscriptionDto.priceId,
    });

    return {
      id: subscription.id,
      status: subscription.status,
      price: subscription.price,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
    };
  }

  @Get()
  async findAll(@CurrentUser() user: any): Promise<SubscriptionResponseDto[]> {
    const userId = user.userId;
    // TODO: Implement get all subscriptions for user
    return [];
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<SubscriptionResponseDto> {
    // TODO: Implement get subscription by ID with ownership check
    return {} as SubscriptionResponseDto;
  }
}
