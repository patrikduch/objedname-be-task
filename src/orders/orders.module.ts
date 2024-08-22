import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { OrdersService } from './services/orders.service';
import { GetOrderQueryHandler } from './cqrs/queries/handlers/get-order-query.handler';
import { GetOrdersQueryHandler } from './cqrs/queries/handlers/get-orders-query.handler';
import { StatusValidationService } from './services/status-validation.service';
import { CommandHandlers } from './cqrs/commands/handlers';
import { QueryHandlers } from './cqrs/queries/handlers'

@Module({
  imports: [TypeOrmModule.forFeature([Order]), CqrsModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    StatusValidationService,

    // CQRS
    ...CommandHandlers,
    ...QueryHandlers
  ],
})
export class OrdersModule {}
