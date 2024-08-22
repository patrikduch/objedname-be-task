import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { CreateOrderRequestDto } from '../dtos/requests/create-order-request.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(createOrderDto: CreateOrderRequestDto): Promise<Order> {
    const order = this.orderRepository.create(createOrderDto);
    order.isDeleted = 0;
    return this.orderRepository.save(order);
  }

  async findOne(id: number, includeDeleted: boolean = false): Promise<Order> {
    const whereClause = includeDeleted ? { id } : { id, isDeleted: 0 };
    this.logger.debug(
      `Executing findOne with whereClause: ${JSON.stringify(whereClause)}`,
    );
    const order = await this.orderRepository.findOne({ where: whereClause });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async findAll(includeDeleted: boolean = false): Promise<Order[]> {
    const whereClause = includeDeleted ? {} : { isDeleted: 0 };
    this.logger.debug(`Executing findAll with whereClause: ${JSON.stringify(whereClause)}`);
    return this.orderRepository.find({ where: whereClause });
  }
}
