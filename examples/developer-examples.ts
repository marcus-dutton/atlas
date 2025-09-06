// Example: Creating a new service
import { Injectable } from '../decorators/injectable';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private config: ConfigService) {}

  async getUsers() {
    // Service logic here
    return [];
  }
}

// Example: Creating a controller
import { Controller } from '../decorators/backend';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers() {
    return this.userService.getUsers();
  }
}

// Example: Creating a model
import { Schema } from 'mongoose';
import { Model } from '../services/mongoose.service';

export interface IUser {
  name: string;
  email: string;
}

@Model('User')
export class UserModel {
  static schema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }
  });
}
