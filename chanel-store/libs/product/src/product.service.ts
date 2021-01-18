import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  getData(): { message: string } {
    return { message: 'Welcome to product service!' };
  }
}
