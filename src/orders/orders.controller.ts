import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderRequestDto } from './dtos/requests/create-order-request.dto';
import { CreateOrderCommandRequest } from './cqrs/commands/requests/create-order-command.request';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { OrdersService } from './services/orders.service';
import { GetOrderQueryRequest } from './cqrs/queries/requests/get-order-query.request';
import { OrderItemResponseDto } from './dtos/responses/order-item-response.dto.';

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

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve details of a specific order' })
    @ApiParam({
      name: 'id',
      description: 'The ID of the order to retrieve',
      example: 1,
    })
    @ApiQuery({
      name: 'includeDeleted',
      type: Boolean,
      required: false,
      description: 'Include soft-deleted order',
    })
    @ApiResponse({ status: 404, description: 'Order not found.' })
    @ApiOkResponse({
      description: 'The order details.',
      type: OrderItemResponseDto, // Specify the DTO here
    })
    async findOne(
      @Param('id') id: number,
      @Query('includeDeleted') includeDeleted: string | boolean,
    ): Promise<OrderItemResponseDto> {
      const includeDeletedBoolean =
        includeDeleted === 'true' || includeDeleted === true;
    
      const query = new GetOrderQueryRequest(id, includeDeletedBoolean);
      return this.queryBus.execute(query);
    }

}
