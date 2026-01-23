import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { CreatedSubsUseCase } from '../../application/use-cases/subscription/createdSubsUseCase';
import { CreateSubscriptionDto } from '../../interfaces/dtos/CreateSubscription.dto';
import { SubscriptionResponseDto } from '../../interfaces/dtos/SubscriptionResponse.dto';
import { SubscriptionRepository } from '../../domain/prisma/subscription.repository';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly createdSubsUseCase: CreatedSubsUseCase,
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  @Post()
  @HttpCode(201)
  async create(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @Request() req: any,
  ): Promise<SubscriptionResponseDto> {
    const userId = req.user.sub; // From JWT token
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
  async findAll(@Request() req: any): Promise<SubscriptionResponseDto[]> {
    const userId = req.user.sub;
    // This would need a method to get subscriptions by user ID
    // Placeholder for future implementation
    return [];
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<SubscriptionResponseDto> {
    const userId = req.user.sub;
    // This would need a method to get a subscription by ID and verify ownership
    // Placeholder for future implementation
    return {} as SubscriptionResponseDto;
  }
}
