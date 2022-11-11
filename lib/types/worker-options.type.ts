import { InjectionToken } from '@nestjs/common';
import { WorkerOptions } from '@temporalio/worker';

export type TemporalWorkerOptions = Omit<WorkerOptions, 'activities'> & {
  activities: InjectionToken[];
};
