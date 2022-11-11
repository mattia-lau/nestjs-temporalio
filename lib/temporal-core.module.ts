import { DynamicModule, Global, Module, Provider, Type } from '@nestjs/common';
import {
  DiscoveryModule,
  DiscoveryService,
  MetadataScanner,
} from '@nestjs/core';
import { TemporalModuleAsyncOptions } from './types/temporal-async-options.factory.type';
import { TemporalOptionsFactory } from './types/temporal-options.types';
import { TemporalWorkerOptions } from './types/worker-options.type';
import { createWorker } from './utils/create-worker.util';

const TEMPORAL_CORE_MODULE_OPTIONS = Symbol('TEMPORAL_CORE_MODULE_OPTIONS');

@Global()
@Module({
  imports: [DiscoveryModule],
})
export class TemporalCoreModule {
  public static forRoot(options: TemporalWorkerOptions): DynamicModule {
    const provider: Provider = this.createWorkerProvider(options);

    return {
      global: true,
      exports: [provider],
      module: TemporalCoreModule,
      providers: [provider],
    };
  }

  public static forRootAsync(
    options: TemporalModuleAsyncOptions,
  ): DynamicModule {
    const provider: Provider = {
      inject: [TEMPORAL_CORE_MODULE_OPTIONS, DiscoveryService, MetadataScanner],
      provide: `Worker_${options.workerId}`,
      useFactory: async (
        opts: TemporalWorkerOptions,
        discoveryService: DiscoveryService,
        metadataScanner: MetadataScanner,
      ) => {
        const worker = await createWorker(
          opts,
          discoveryService,
          metadataScanner,
        );

        return worker;
      },
    };

    const asyncProviders = this.createAsyncProviders(options);

    return {
      global: true,
      exports: [provider],
      imports: options.imports,
      module: TemporalCoreModule,
      providers: [...asyncProviders, provider],
    };
  }

  private static createAsyncProviders(
    options: TemporalModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<TemporalOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: TemporalModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: TEMPORAL_CORE_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    const inject = [
      (options.useClass || options.useExisting) as Type<TemporalOptionsFactory>,
    ];
    return {
      provide: TEMPORAL_CORE_MODULE_OPTIONS,
      useFactory: async (optionsFactory: TemporalOptionsFactory) =>
        await optionsFactory.createTemporalOptions(),
      inject,
    };
  }

  private static createWorkerProvider(
    options: TemporalWorkerOptions,
  ): Provider {
    return {
      provide: `Worker_${options.identity}`,
      inject: [DiscoveryService, MetadataScanner],
      useFactory: async (
        discoveryService: DiscoveryService,
        metadataScanner: MetadataScanner,
      ) => {
        const worker = await createWorker(
          options,
          discoveryService,
          metadataScanner,
        );

        await worker.run();

        return worker;
      },
    };
  }
}
