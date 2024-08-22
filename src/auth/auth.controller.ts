import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginRequestDto } from './dtos/requests/login-request.dto';
import { RegisterUserRequestDto } from './dtos/requests/register-user-request.dto';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterUserCommandRequest } from './cqrs/commands/requests/register-user-command.request';
import { RegisterUserResponseDto } from './dtos/responses/register-user-response.dto';
import { LoginCommandRequest } from './cqrs/commands/requests/login-command.request';
import { LoginResponseDto } from './dtos/responses/login-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Standard login with plain username and password' })
  @ApiBody({
    description: 'The login request model containing email, password, and remember me flag',
    type: LoginRequestDto,
  })
  @ApiResponse({
    status: 201,
    description: 'JWT token generated successfully.',
    type: LoginResponseDto, // Specify the response type here
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid credentials.',
  })
  async login(@Body() loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    return await this.commandBus.execute(new LoginCommandRequest(loginDto.email, loginDto.password));
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a brand new regular user.' })
  @ApiBody({
    description: 'The registration request model containing username, email, and password',
    type: RegisterUserRequestDto,
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully.',
    type: RegisterUserResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict. User with this email already exists.',
  })
  async register(@Body() createUserDto: RegisterUserRequestDto): Promise<RegisterUserResponseDto> {
    return this.commandBus.execute(
      new RegisterUserCommandRequest(
        createUserDto.username,
        createUserDto.email,
        createUserDto.password,
      ),
    );
  }
}