import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { OrdersService } from './services/orders.service';
import { CreateOrderCommandHandler } from './cqrs/commands/handlers/create-order-command.handler';

@Module({
    imports: [TypeOrmModule.forFeature([Order]), CqrsModule],
    controllers: [OrdersController],
    providers: [OrdersService, CreateOrderCommandHandler]

})
export class OrdersModule {}
