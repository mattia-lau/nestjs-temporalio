# Description

NestJs Module for Temporal that support multiple workers. 

# Installation

```bash
yarn add nestjs-temporalio
```

# Quick start

```typescript
// main.ts

const id = 'TestWorker';

async function bootstrap() {
  // You can also createApplicationContext.
  const app = await NestFactory.create(AppModule);

  // wait runtime bundle workflow
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });

  await app.listen(3000);

  // You can create multiple
  const workers = [
    // id is equal to identify / workerId
    app.get(`Worker_${id}`),
  ];

  // You may need to shutdown the worker using OnModuleDestroy hooks.
  await Promise.all(workers.map((worker) => worker.run()));
}
bootstrap();
```

```typescript
// test-service.interface.ts
export interface ITestService {
  greet(): Promise<string>;
}
```

```typescript
// test.service.ts
@Injectable()
export class TestService implements ITestService {
  async greet(): Promise<string> {
    return Promise.resolve('Hello');
  }
}
```

```typescript
// test.workflow.ts
const { greet } = proxyActivities<ITestService>({
  startToCloseTimeout: '10 seconds',
});

export const testWorkflow = async (): Promise<string> => {
  return greet();
};
```

```typescript
// app.module.ts
@Module({
  imports: [
    TemporalModule.forRootAsync({
      useFactory: async () => {
        const connection = await NativeConnection.connect();

        const workflowBundle = await bundleWorkflowCode({
          workflowsPath: path.join(__dirname, './workflows'),
        });

        return {
          workflowBundle,
          taskQueue: 'QueueName',
          connection,
          activities: [TestService],
        };
      },
      workerId,
    }),
  ],
  providers: [TestService],
})
export class AppModule {}
```
