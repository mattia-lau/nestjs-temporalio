import { proxyActivities } from '@temporalio/workflow';
import { ITestService } from './test-service.interface';

const { greet } = proxyActivities<ITestService>({
  startToCloseTimeout: '10 seconds',
});

export const testWorkflow = async (): Promise<string> => {
  return greet();
};
