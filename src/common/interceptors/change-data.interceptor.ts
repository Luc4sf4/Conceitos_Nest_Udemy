/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';

@Injectable()
export class ChangeDataInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    console.log('ChangeDataInterceptor executado antes');
    return next.handle().pipe(
      map(data => {
        if (Array.isArray(data)) {
          return {
            data,
            count: data.length,
          };
        }
        return data;
      }),
    );
  }
}
