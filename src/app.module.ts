import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './ormconfig';
import { AuthModule } from './auth/auth.module';
import { OrdersController } from './orders/orders.controller';
import { JwtMiddleware } from './auth/jwt.middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...ormConfig
    }),
    AuthModule,
    OrdersModule,
   
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes(OrdersController);
  }
}