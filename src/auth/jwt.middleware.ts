import {
    Injectable,
    Logger,
    NestMiddleware,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Request, Response, NextFunction } from 'express';
  
  @Injectable()
  export class JwtMiddleware implements NestMiddleware {
    private readonly logger = new Logger(JwtMiddleware.name); // Create a logger instance with the context
  
    constructor(private jwtService: JwtService) {}
  
    use(req: Request, res: Response, next: NextFunction) {
      this.logger.log('Middleware is being executed'); // Log middleware execution
  
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new UnauthorizedException('JWT token missing');
      }
  
      const token = authHeader.split(' ')[1];
      try {
        const decoded = this.jwtService.verify(token);
  
        // Add the user property to the request object
        req.user = { ...decoded, customProperty: 'customValue' };
  
        next();
      } catch (err) {
        throw new UnauthorizedException('Invalid JWT token');
      }
    }
  }