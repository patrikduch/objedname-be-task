import { ApiProperty } from '@nestjs/swagger';

export class OrderItemResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the order item',
    example: 1,
  })
  public id: number;

  @ApiProperty({
    description: 'The description of the order item',
    example: 'Blue Widget',
  })
  public description: string;

  @ApiProperty({
    description: 'The quantity of the order item',
    example: 2,
  })
  public quantity: number;

  @ApiProperty({
    description: 'The price of the order item',
    example: 19.99,
  })
  public price: number;

  @ApiProperty({
    description: 'The status of the order item',
    example: 'Shipped',
  })
  public status: string;

  @ApiProperty({
    description: 'Indicates whether the order item is soft-deleted (1 = true, 0 = false)',
    example: 0,
  })
  public isDeleted: number;

  constructor(
    id: number,
    description: string,
    quantity: number,
    price: number,
    status: string,
    isDeleted: number,
  ) {
    this.id = id;
    this.description = description;
    this.quantity = quantity;
    this.price = price;
    this.status = status;
    this.isDeleted = isDeleted;
  }
}
