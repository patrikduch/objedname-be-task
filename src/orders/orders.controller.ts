import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateOrderRequestDto } from './dtos/requests/create-order-request.dto';
import { CreateOrderCommandRequest } from './cqrs/commands/requests/create-order-command.request';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetOrderQueryRequest } from './cqrs/queries/requests/get-order-query.request';
import { OrderItemResponseDto } from './dtos/responses/order-item-response.dto.';
import { GetOrdersQueryRequest } from './cqrs/queries/requests/get-orders-query.request';
import { RemoveOrderCommandRequest } from './cqrs/commands/requests/remove-order-command.request';
import { RestoreOrderCommandRequest } from './cqrs/commands/requests/restore-order-command.request';
import { UpdateOrderStatusRequestDto } from './dtos/requests/update-order-status-request.dto';
import { UpdateOrderStatusCommandRequest } from './cqrs/commands/requests/update-order-status-command.query';

@ApiTags('Orders')
@Controller('Orders')
@ApiBearerAuth('access-token')
export class OrdersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderRequestDto })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(@Body() createOrderDto: CreateOrderRequestDto) {
    const command = new CreateOrderCommandRequest(
      createOrderDto.description,
      createOrderDto.quantity,
      createOrderDto.price,
    );
    return this.commandBus.execute(command);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete an order' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the order to delete',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'The order has been soft-deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  async softDelete(@Param('id') id: number) {
    const command = new RemoveOrderCommandRequest(id);
    return this.commandBus.execute(command);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted order' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the order to restore',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'The order has been restored.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  async restore(@Param('id') id: number) {
    const query = new RestoreOrderCommandRequest(id);
    return this.commandBus.execute(query);
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
    type: OrderItemResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findOne(
    @Param('id') id: number,
    @Query('includeDeleted') includeDeleted: string | boolean,
  ): Promise<OrderItemResponseDto> {
    const includeDeletedBoolean =
      includeDeleted === 'true' || includeDeleted === true;

    const query = new GetOrderQueryRequest(id, includeDeletedBoolean);
    return this.queryBus.execute(query);
  }

  @HttpCode(200)
  @Get()
  @ApiOperation({ summary: 'Retrieve a list of orders' })
  @ApiQuery({
    name: 'includeDeleted',
    type: Boolean,
    required: false,
    description: 'Include soft-deleted orders',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiOkResponse({
    status: 200,
    description: 'List of orders.',
    type: OrderItemResponseDto,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(
    @Query('includeDeleted') includeDeleted: string | boolean,
  ): Promise<OrderItemResponseDto[]> {
    const includeDeletedBoolean =
      includeDeleted === 'true' || includeDeleted === true;

    const query = new GetOrdersQueryRequest(includeDeletedBoolean);

    const orders = await this.queryBus.execute(query);
    const result: OrderItemResponseDto[] = orders.map((order) => {
      return new OrderItemResponseDto(
        order.id,
        order.description,
        order.quantity,
        order.price,
        order.status,
        order.isDeleted,
      );
    });

    return result;
  }


  @Put(':id/status')
  @ApiOperation({ summary: 'Update the status of an order' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the order to update',
    example: 1,
  })
  @ApiBody({ type: UpdateOrderStatusRequestDto })
  @ApiResponse({
    status: 200,
    description: 'The status of the order has been updated.',
  })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async updateStatus(
    @Param('id') id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusRequestDto,
  ) {
    const { status } = updateOrderStatusDto;
    const command = new UpdateOrderStatusCommandRequest(id, status);

    return this.commandBus.execute(command);
  }
}
