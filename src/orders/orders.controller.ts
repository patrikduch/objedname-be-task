import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderRequestDto } from './dtos/create-order-request.dto';
import { CreateOrderCommandRequest } from './cqrs/commands/requests/create-order-command.request';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { OrdersService } from './services/orders.service';

@ApiTags('Orders')
@Controller('Orders')
export class OrdersController {

    constructor(private readonly ordersService: OrdersService,
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,) {

    }

    @Post()
    @ApiOperation({ summary: 'Create a new order' })
    @ApiBody({ type: CreateOrderRequestDto })
    @ApiResponse({
      status: 201,
      description: 'The order has been successfully created.',
    })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async create(@Body() createOrderDto: CreateOrderRequestDto) {
      
      const command = new CreateOrderCommandRequest(createOrderDto.description, createOrderDto.quantity, createOrderDto.price);
      return this.commandBus.execute(command);
    }
  

}
