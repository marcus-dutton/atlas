import { Injectable } from '../decorators/injectable';
import { Module } from '../decorators/backend';
import { Connection, connect, Model as MongooseModel, Schema } from 'mongoose';
import { ConfigService } from './config.service';

export interface ModelDefinition {
  name: string;
  schema: Schema;
  collection?: string;
}

@Injectable({ providedIn: 'root' })
export class MongooseService {
  private connection: Connection | null = null;
  private models = new Map<string, MongooseModel<any>>();

  constructor(private config: ConfigService) {
    console.log('🗄️ MongooseService initialized');
  }

  async connect(): Promise<void> {
    try {
      await connect(this.config.database.uri, {
        dbName: this.config.database.database
      });
      this.connection = require('mongoose').connection;
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  registerModel(definition: ModelDefinition): MongooseModel<any> {
    if (!this.connection) {
      throw new Error('Database not connected. Call connect() first.');
    }

    const model = this.connection.model(definition.name, definition.schema, definition.collection);
    this.models.set(definition.name, model);
    console.log(`📋 Model registered: ${definition.name}`);
    return model;
  }

  getModel<T = any>(name: string): MongooseModel<T> {
    const model = this.models.get(name);
    if (!model) {
      throw new Error(`Model ${name} not found. Make sure it's registered.`);
    }
    return model;
  }

  getConnection(): Connection {
    if (!this.connection) {
      throw new Error('Database not connected');
    }
    return this.connection;
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
      console.log('🔌 Database disconnected');
    }
  }
}

// Decorator for Mongoose models
export function Model(name: string, collection?: string) {
  return (target: any) => {
    Reflect.defineMetadata('model:name', name, target);
    Reflect.defineMetadata('model:collection', collection, target);
    Reflect.defineMetadata('model:registered', false, target);
  };
}

// Helper to get model metadata
export function getModelMetadata(target: any): ModelDefinition | null {
  const name = Reflect.getMetadata('model:name', target);
  if (!name) return null;

  const collection = Reflect.getMetadata('model:collection', target);
  const schema = Reflect.getMetadata('model:schema', target);

  return { name, schema, collection };
}

// Helper to set model schema
export function setModelSchema(target: any, schema: Schema): void {
  Reflect.defineMetadata('model:schema', schema, target);
}

@Module([
  { provide: MongooseService, useClass: MongooseService }
])
export class MongooseModule {
  constructor(private mongoose: MongooseService) {
    console.log('📦 MongooseModule initialized');
  }

  async connect(): Promise<void> {
    await this.mongoose.connect();
  }
}

// Provider function for Angular-style module setup
export function provideMongoose(): any {
  return {
    provide: MongooseService,
    useClass: MongooseService
  };
}
