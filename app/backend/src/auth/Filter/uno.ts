import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    BadGatewayException,
    BadRequestException,
   } from '@nestjs/common';
   import { Response } from 'express';
      
   @Catch(BadRequestException)
   export class FormCheck implements ExceptionFilter {
     catch(exception: HttpException, host: ArgumentsHost) {
      console.log('YES PROBLEM 222222')
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const status = exception.getStatus();
      const str: string = exception.getResponse().toString();
      // const res = JSON.parse(str);
      return response.status(status).send(exception.message);
     }
   }
   