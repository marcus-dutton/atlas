import { FrameworkAdapter } from '../core/bootstrap';
import { bootstrapApplication } from '../core/bootstrap';
import { ConfigService } from '../services/config.service';

// Express Framework Adapter
export const expressAdapter: FrameworkAdapter = {
  name: 'Express',
  setup: async (injector, config) => {
    try {
      const express = require('express');
      const app = express();

      // Get config from DI
      const configService = injector.get(ConfigService) as ConfigService;

      // Basic Express setup
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));

      console.log('✅ Express app configured');
      return app;
    } catch (error) {
      console.error('❌ Express setup failed:', error);
      throw error;
    }
  },
  start: async (injector, config) => {
    const configService = injector.get(ConfigService) as ConfigService;
    const port = configService.app.port;

    // Create and start Express app
    const express = require('express');
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.listen(port, () => {
      console.log(`🚀 Express server running on port ${port}`);
    });
  }
};

// Fastify Framework Adapter
export const fastifyAdapter: FrameworkAdapter = {
  name: 'Fastify',
  setup: async (injector, config) => {
    try {
      const fastify = require('fastify')({ logger: true });

      // Get config from DI
      const configService = injector.get(ConfigService) as ConfigService;

      // Basic Fastify setup
      await fastify.register(require('@fastify/cors'));
      await fastify.register(require('@fastify/helmet'));

      console.log('✅ Fastify app configured');
      return fastify;
    } catch (error) {
      console.error('❌ Fastify setup failed:', error);
      throw error;
    }
  },
  start: async (injector, config) => {
    const configService = injector.get(ConfigService) as ConfigService;
    const port = configService.app.port;

    // Create and start Fastify app
    const fastify = require('fastify')({ logger: true });

    // Basic setup
    await fastify.register(require('@fastify/cors'));
    await fastify.register(require('@fastify/helmet'));

    await fastify.listen({ port });
    console.log(`🚀 Fastify server running on port ${port}`);
  }
};

// Generic Framework Bootstrap Function
export async function bootstrapFramework(
  moduleClass: any,
  framework: 'express' | 'fastify' | FrameworkAdapter,
  options: any = {}
) {
  const adapter = typeof framework === 'string'
    ? (framework === 'express' ? expressAdapter : fastifyAdapter)
    : framework;

  const injector = bootstrapApplication(moduleClass, {
    ...options,
    framework: adapter
  });

  // Start the framework
  if (adapter.start) {
    await adapter.start(injector, options);
  }

  return injector;
}
