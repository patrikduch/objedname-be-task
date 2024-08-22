import { ICommandHandler, CommandHandler } from "@nestjs/cqrs";
import { RegisterUserCommandRequest } from "../requests/register-user-command.request";
import { AuthService } from "src/auth/auth.service";
import { RegisterUserRequestDto } from "src/auth/dtos/requests/register-user-request.dto";
import { ConflictException } from "@nestjs/common";
import { RegisterUserResponseDto } from "src/auth/dtos/responses/register-user-response.dto";

@CommandHandler(RegisterUserCommandRequest)
export class RegisterUserCommandHandler
  implements ICommandHandler<RegisterUserCommandRequest> {

  constructor(private readonly authService: AuthService) {}

  async execute(command: RegisterUserCommandRequest): Promise<RegisterUserResponseDto> {

    const existingUser = await this.authService.findByEmail(command.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists.');
    }

    const dto = new RegisterUserRequestDto();
    dto.email = command.email;
    dto.password = command.password;
    dto.username = command.username;
    dto.roles = ['user'];

    const user = await this.authService.register(dto);

    const result = new RegisterUserResponseDto();
    result.email = user.email;
    result.roles = user.roles;
    result.username = user.username;

    return result;
  }
}