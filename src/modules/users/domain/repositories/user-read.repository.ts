import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../projections/user.schema';

@Injectable()
export class UsersReadRepository {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async getAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
  async getUserById(id: number): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async projectUser(id: number, name: string, password: string, email: string, role: string): Promise<User> {
    console.log(id)
    return this.userModel.create({_id: id, name, password, email, role});
  }

  async updateUser(id: number, name: string, password: string, email: string, role: string): Promise<User | null> {
    const updatedUser = this.userModel.findOneAndUpdate(
      { _id: id },
      { $set: new this.userModel({ name: name, password: password, email: email, role: role, updatedAt: new Date()}) },
      { new: true });
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await this.userModel.deleteOne(
      { _id: id });

    return result.deletedCount > 0;
  }
}