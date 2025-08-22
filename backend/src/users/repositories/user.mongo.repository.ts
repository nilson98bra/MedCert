import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserRepository } from '../contracts/user.repository.interface';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(UserEntity.name) private readonly model: Model<UserEntity>,
  ) {}

  async create(user: Partial<UserEntity>): Promise<UserEntity> {
    const newUser = new this.model(user);
    return newUser.save();
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.model.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.model.findById(id).exec();
  }
}
