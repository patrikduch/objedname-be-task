import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { CreateOrderCommandRequest } from '../requests/create-order-command.request';
import { OrdersService } from '../../../services/orders.service';
import { Order } from '../../../entities/order.entity';
import { InternalServerErrorException } from '@nestjs/common';

@CommandHandler(CreateOrderCommandRequest)
export class CreateOrderCommandHandler implements ICommandHandler<CreateOrderCommandRequest> {
  constructor(private readonly ordersService: OrdersService) {}

  async execute(command: CreateOrderCommandRequest): Promise<Order> {
    const { description, quantity, price } = command;

    // Create a new order
    const order = await this.ordersService.create({
      description,
      quantity,
      price,
    });

    if (!order) {
      throw new InternalServerErrorException('Failed to create order');
    }

    return order;
  }
}