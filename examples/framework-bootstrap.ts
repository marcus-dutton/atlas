// Example: Using Atlas with different frameworks

import { bootstrapFramework, expressAdapter, fastifyAdapter } from '@marcus-dutton/atlas';
import { AppModule } from './app-example';

// Bootstrap with Express
export async function bootstrapWithExpress() {
  console.log('🚀 Bootstrapping with Express...');

  const injector = await bootstrapFramework(AppModule, 'express', {
    autoProvideRoot: true,
    scanPaths: ['./src/services', './src/controllers'],
    providers: [
      { provide: 'FRAMEWORK', useValue: 'express' }
    ]
  });

  return injector;
}

// Bootstrap with Fastify
export async function bootstrapWithFastify() {
  console.log('🚀 Bootstrapping with Fastify...');

  const injector = await bootstrapFramework(AppModule, 'fastify', {
    autoProvideRoot: true,
    scanPaths: ['./src/services', './src/controllers'],
    providers: [
      { provide: 'FRAMEWORK', useValue: 'fastify' }
    ]
  });

  return injector;
}

// Custom framework adapter example
import { FrameworkAdapter } from '../core/bootstrap';

const customAdapter: FrameworkAdapter = {
  name: 'Custom Framework',
  setup: async (injector, config) => {
    console.log('🔧 Setting up custom framework...');
    // Custom setup logic here
  },
  start: async (injector, config) => {
    console.log('🚀 Starting custom framework...');
    // Custom start logic here
  }
};

export async function bootstrapWithCustom() {
  return await bootstrapFramework(AppModule, customAdapter, {
    autoProvideRoot: true,
    scanPaths: ['./src/services', './src/controllers']
  });
}
