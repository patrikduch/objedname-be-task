export class GetOrderQueryRequest {
  constructor(
    public readonly orderId: number,
    public readonly includedDeleted: boolean,
  ) {}
}
