import { ModuleMetadata, Type } from '@nestjs/common';
import { TemporalOptionsFactory } from './temporal-options.types';
import { TemporalWorkerOptions } from './worker-options.type';

export type TemporalModuleAsyncOptions = Pick<ModuleMetadata, 'imports'> & {
  useFactory?: (
    ...args: any[]
  ) => Promise<TemporalWorkerOptions> | TemporalWorkerOptions;
  useClass?: Type<TemporalOptionsFactory>;
  useExisting?: Type<TemporalOptionsFactory>;
  inject?: any[];
  workerId: string;
};
