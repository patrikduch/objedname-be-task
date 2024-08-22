import { Module } from '@nestjs/common';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RegisterUserCommandRequest } from './cqrs/commands/requests/register-user-command.request';
import { RegisterUserCommandHandler } from './cqrs/commands/handlers/register-user-command.handler';
import { LoginCommandHandler } from './cqrs/commands/handlers/login-command.handler';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
        secret: 'yourSecretKey', // Ensure this is set
        signOptions: { expiresIn: '60m' },
      }),

    CqrsModule
  ],
  providers: [

    RegisterUserCommandHandler,
    LoginCommandHandler,
    AuthService,
    JwtStrategy,
    UserRepository

  ],
  controllers: [AuthController],
  exports: [JwtStrategy, UserRepository, JwtModule],
})
export class AuthModule {}
