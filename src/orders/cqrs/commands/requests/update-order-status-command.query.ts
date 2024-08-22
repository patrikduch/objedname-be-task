export class UpdateOrderStatusCommandRequest {
  constructor(
    public readonly orderId: number,
    public readonly status: string,
  ) {}
}
