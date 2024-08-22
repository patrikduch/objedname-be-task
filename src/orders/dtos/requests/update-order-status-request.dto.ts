import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderStatusRequestDto {
  @ApiProperty({ description: 'The new status of the order', example: 'completed' })
  @IsNotEmpty()
  @IsString()
  status: string;
}