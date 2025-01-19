import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
  } from '@nestjs/common';
import { ApplicationException } from './application.exception';
  
  @Catch(ApplicationException)
  export class ApplicationExceptionFilter implements ExceptionFilter {
    catch(exception: ApplicationException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
  
      response.status(exception.statusCode).json({
        statusCode: exception.statusCode,
        error: exception.name,
        message: exception.message,
      });
    }
  }