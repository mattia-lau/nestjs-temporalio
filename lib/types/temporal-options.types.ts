import { TemporalWorkerOptions } from './worker-options.type';

export interface TemporalOptionsFactory {
  createTemporalOptions():
    | Promise<TemporalWorkerOptions>
    | TemporalWorkerOptions;
}
