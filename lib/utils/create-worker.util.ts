import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Worker } from '@temporalio/worker';
import { TemporalWorkerOptions } from '../types/worker-options.type';

export const createWorker = async (
  opts: TemporalWorkerOptions,
  discoveryService: DiscoveryService,
  metadataScanner: MetadataScanner,
) => {
  const { activities = [], ...rest } = opts;

  const set = new Set(activities);

  const methods: any = {};

  discoveryService
    .getProviders()
    .filter((wrapper: InstanceWrapper) => set.has(wrapper.token))
    .forEach((service) => {
      const { instance } = service;
      metadataScanner.scanFromPrototype(
        instance,
        Object.getPrototypeOf(instance),
        async (key: string) => {
          methods[key] = instance[key].bind(instance);
        },
      );
    });

  return Worker.create({
    ...rest,
    activities: methods,
  });
};
