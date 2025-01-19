import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
  } from '@nestjs/common';
import { DomainException } from './domain.exception';
  
  @Catch(DomainException)
  export class DomainExceptionFilter implements ExceptionFilter {
    catch(exception: DomainException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
  
      response.status(exception.statusCode).json({
        statusCode: exception.statusCode,
        error: exception.name,
        message: exception.message,
      });
    }
  }