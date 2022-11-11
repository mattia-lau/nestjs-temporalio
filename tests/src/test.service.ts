import { Injectable } from '@nestjs/common';
import { ITestService } from './test-service.interface';

@Injectable()
export class TestService implements ITestService {
  async greet(): Promise<string> {
    return Promise.resolve('Hello');
  }
}
