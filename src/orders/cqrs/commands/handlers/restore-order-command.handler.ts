import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { RestoreOrderCommandRequest } from '../requests/restore-order-command.request';
import { OrdersService } from '../../../services/orders.service';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(RestoreOrderCommandRequest)
export class RestoreOrderCommandHandler implements ICommandHandler<RestoreOrderCommandRequest> {
  constructor(private readonly ordersService: OrdersService) {}

  async execute(command: RestoreOrderCommandRequest): Promise<void> {
    const { orderId } = command;

    const currOrder = await this.ordersService.findOne(orderId, true);

    if (currOrder.isDeleted == 0) {

        throw new BadRequestException('Restoring failed, item is not flagged as deleted.');
    }

    await this.ordersService.restore(orderId);
  }
}