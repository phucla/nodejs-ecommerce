// Standard library
import { Test } from '@nestjs/testing';

// Internal
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('getData', () => {
    it('should return "Welcome to store-manager-portal!"', () => {
      expect(service.getData()).toEqual({
        message: 'Welcome to store-manager-portal!',
      });
    });
  });
});
