import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { UpdateOrderStatusCommandRequest } from '../requests/update-order-status-command.query';
import { OrdersService } from '../../../services/orders.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { StatusValidationService } from 'src/orders/services/status-validation.service';

@CommandHandler(UpdateOrderStatusCommandRequest)
export class UpdateOrderStatusCommandHandler implements ICommandHandler<UpdateOrderStatusCommandRequest> {
  constructor(private readonly ordersService: OrdersService, private readonly statusValidationService: StatusValidationService) {}

  async execute(command: UpdateOrderStatusCommandRequest): Promise<void> {
    const { orderId, status } = command;

    const order = await this.ordersService.findOne(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found.`);
    }

    if (!this.statusValidationService.isValidStatus(status)) {
      throw new BadRequestException(`Invalid status: ${status}`);
    }

    await this.ordersService.updateStatus(orderId, status);
  }
}