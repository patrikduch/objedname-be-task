import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { OrdersService } from './services/orders.service';
import { CreateOrderCommandHandler } from './cqrs/commands/handlers/create-order-command.handler';
import { GetOrderQueryHandler } from './cqrs/queries/handlers/get-order-query.handler';
import { GetOrdersQueryHandler } from './cqrs/queries/handlers/get-orders-query.handler';
import { RemoveOrderCommandHandler } from './cqrs/commands/handlers/remove-order-command.handler';
import { RestoreOrderCommandHandler } from './cqrs/commands/handlers/restore-order-command.handler';
import { UpdateOrderStatusCommandHandler } from './cqrs/commands/handlers/update-order-status-command.handler';
import { StatusValidationService } from './services/status-validation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), CqrsModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    StatusValidationService,
    CreateOrderCommandHandler,
    GetOrderQueryHandler,
    GetOrdersQueryHandler,
    RemoveOrderCommandHandler,
    RestoreOrderCommandHandler,
    UpdateOrderStatusCommandHandler,
  ],
})
export class OrdersModule {}
