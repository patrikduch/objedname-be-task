import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOrderQueryRequest } from '../requests/get-order-query.request';
import { OrdersService } from '../../../services/orders.service';
import { OrderItemResponseDto } from 'src/orders/dtos/responses/order-item-response.dto.';

@QueryHandler(GetOrderQueryRequest)
export class GetOrderQueryHandler
  implements IQueryHandler<GetOrderQueryRequest>
{
  constructor(private readonly ordersService: OrdersService) {}

  async execute(query: GetOrderQueryRequest): Promise<OrderItemResponseDto> {
    const order = await this.ordersService.findOne(
      query.orderId,
      query.includedDeleted,
    );
    const result = new OrderItemResponseDto(
      order.id,
      order.description,
      order.quantity,
      order.price,
      order.status,
      order.isDeleted,
    );

    return result;
  }
}
