export class CreateOrderCommandRequest {
    constructor(
      public readonly description: string,
      public readonly quantity: number,
      public readonly price: number,
      public readonly status: string = 'pending',
    ) {}
  }
  