import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOrdersQueryRequest } from '../requests/get-orders-query.request';
import { OrdersService } from '../../../services/orders.service';
import { Order } from '../../../entities/order.entity';
import { OrderItemResponseDto } from 'src/orders/dtos/responses/order-item-response.dto.';

@QueryHandler(GetOrdersQueryRequest)
export class GetOrdersQueryHandler implements IQueryHandler<GetOrdersQueryRequest> {
  constructor(private readonly ordersService: OrdersService) {}

  async execute(query: GetOrdersQueryRequest): Promise<OrderItemResponseDto[]> {
  const orders = await this.ordersService.findAll(query.includedDeleted);

  const result: OrderItemResponseDto[] = orders.map(order => {
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
}