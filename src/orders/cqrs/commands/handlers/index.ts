import { CreateOrderCommandHandler } from "./create-order-command.handler";
import { RemoveOrderCommandHandler } from "./remove-order-command.handler";
import { RestoreOrderCommandHandler } from "./restore-order-command.handler";
import { UpdateOrderStatusCommandHandler } from "./update-order-status-command.handler";

export const CommandHandlers = [CreateOrderCommandHandler, RemoveOrderCommandHandler, RestoreOrderCommandHandler, UpdateOrderStatusCommandHandler];