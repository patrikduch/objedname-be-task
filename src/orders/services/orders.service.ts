import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { CreateOrderRequestDto } from '../dtos/create-order-request.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>
  ) {}

  async create(createOrderDto: CreateOrderRequestDto): Promise<Order> {
    const order = this.orderRepository.create(createOrderDto);
    order.isDeleted = 0;
    return this.orderRepository.save(order);
  }
}