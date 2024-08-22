import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { RemoveOrderCommandRequest } from '../requests/remove-order-command.request';
import { OrdersService } from '../../../services/orders.service';

@CommandHandler(RemoveOrderCommandRequest)
export class RemoveOrderCommandHandler implements ICommandHandler<RemoveOrderCommandRequest> {
  constructor(private readonly ordersService: OrdersService) {}

  async execute(command: RemoveOrderCommandRequest): Promise<void> {
    const { orderId } = command;

    await this.ordersService.softDelete(orderId);    
  }
}