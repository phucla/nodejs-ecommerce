import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable()
export class LoggingInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    const logger = new Logger();
    logger.log('Before...');
    const request = context.switchToHttp().getRequest();
    const now = moment();
    return next.handle().pipe(
      tap(() => {
        logger.log(`${request.method} ${request.url} ${moment().diff(now)}ms`);
      })
    );
  }
}
