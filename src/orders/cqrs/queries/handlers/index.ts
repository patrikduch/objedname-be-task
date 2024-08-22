import { GetOrderQueryRequest } from "../requests/get-order-query.request";
import { GetOrdersQueryHandler } from "./get-orders-query.handler";

export const QueryHandlers = [GetOrdersQueryHandler, GetOrderQueryRequest];