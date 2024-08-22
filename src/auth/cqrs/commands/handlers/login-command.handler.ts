import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { LoginCommandRequest } from '../requests/login-command.request';
import { AuthService } from '../../../auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { LoginResponseDto } from '../../../dtos/responses/login-response.dto';
import { LoginRequestDto } from 'src/auth/dtos/requests/login-request.dto';

@CommandHandler(LoginCommandRequest)
export class LoginCommandHandler
  implements ICommandHandler<LoginCommandRequest> {

  constructor(private readonly authService: AuthService) {}

  async execute(command: LoginCommandRequest): Promise<LoginResponseDto> {
    // Validate user credentials
    const user = await this.authService.validateUser(command.email, command.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const userInputData = new LoginRequestDto();
    userInputData.email = user.email;
    userInputData.password = command.password;

    const authState = await this.authService.login(userInputData);

    const response = new LoginResponseDto();
    response.accessToken = authState.accessToken;

    return response;
  }
}