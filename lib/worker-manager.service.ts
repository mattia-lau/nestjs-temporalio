import { Injectable } from '@nestjs/common';
import { Worker } from '@temporalio/worker';

@Injectable()
export class WorkerManagerService {
  private worker: Map<string, Worker> = new Map();

  addWorker(name: string, worker: Worker) {
    this.worker.set(name, worker);
  }

  get(name: string): Worker | undefined {
    return this.worker.get(name);
  }

  async start(): Promise<void> {
    await Promise.all(
      Array.from(this.worker.values()).map((worker) => worker.run()),
    );
  }

  async stop(): Promise<void> {
    await Promise.all(
      Array.from(this.worker.values()).map((worker) => worker.shutdown()),
    );
  }
}
