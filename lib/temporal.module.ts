import { DynamicModule, Module } from '@nestjs/common';
import { TemporalCoreModule } from './temporal-core.module';
import { TemporalModuleAsyncOptions } from './types/temporal-async-options.factory.type';
import { TemporalWorkerOptions } from './types/worker-options.type';

@Module({})
export class TemporalModule {
  static forRoot(options: TemporalWorkerOptions): DynamicModule {
    return {
      module: TemporalModule,
      imports: [TemporalCoreModule.forRoot(options)],
    };
  }

  static forRootAsync(options: TemporalModuleAsyncOptions): DynamicModule {
    return {
      module: TemporalModule,
      imports: [TemporalCoreModule.forRootAsync(options)],
    };
  }
}
