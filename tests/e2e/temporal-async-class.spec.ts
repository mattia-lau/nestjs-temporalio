import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TestWorkflowEnvironment } from '@temporalio/testing';
import { bundleWorkflowCode } from '@temporalio/worker';
import { randomUUID } from 'crypto';
import { resolve } from 'path';
import { TemporalModule } from '../../lib';
import { TestService } from '../src/test.service';
import { testWorkflow } from '../src/test.workflow';

describe('TypeOrm (async configuration)', () => {
  let app: INestApplication;
  let env: TestWorkflowEnvironment;

  const taskQueue = 'testing';
  const workerId = 'TestWorker';

  beforeAll(async () => {
    env = await TestWorkflowEnvironment.createLocal();

    const module = await Test.createTestingModule({
      imports: [
        TemporalModule.forRootAsync({
          useFactory: async () => {
            const workflowBundle = await bundleWorkflowCode({
              workflowsPath: resolve('./tests/src/test.workflow.ts'),
            });

            return {
              workflowBundle,
              taskQueue,
              connection: env.nativeConnection,
              activities: [TestService],
            };
          },
          workerId,
        }),
      ],
      // You can't mock function after compile
      // Because temporal already bundled the code
      providers: [TestService],
    }).compile();

    app = module.createNestApplication();
  });

  it(`should return Hello`, async () => {
    const { client } = env;

    const worker = app.get('Worker_TestWorker');

    const result = await worker.runUntil(() =>
      client.workflow.execute(testWorkflow, {
        workflowId: randomUUID(),
        args: [],
        taskQueue: 'testing',
      }),
    );

    expect(result).toBe('Hello');
  });

  afterAll(async () => {
    await env.teardown();
    await app.close();
  });
});
