import { Injectable } from '@nestjs/common';

@Injectable()
export class StatusValidationService {
  private readonly validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'completed'];

  isValidStatus(status: string): boolean {
    return this.validStatuses.includes(status);
  }
}