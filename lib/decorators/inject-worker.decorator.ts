import { Inject } from '@nestjs/common';

export const InjectTemporalClient = (id: string): ParameterDecorator =>
  Inject(`Worker_${id}`);
