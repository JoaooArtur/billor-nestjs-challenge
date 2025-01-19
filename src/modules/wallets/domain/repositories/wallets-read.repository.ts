import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wallet } from '../projections/wallet.schema';

@Injectable()
export class WalletsReadRepository {
  constructor(@InjectModel('Wallet') private readonly WalletModel: Model<Wallet>) {}

  async getAll(): Promise<Wallet[]> {
    return this.WalletModel.find().exec();
  }
  async getWalletById(id: number): Promise<Wallet> {
    return this.WalletModel.findById(id).exec();
  }

  async projectWallet(id: number, name: string, userId: number, balance: number): Promise<Wallet> {
    console.log(id)
    return this.WalletModel.create({_id: id, name, userId, balance});
  }

  async updateWallet(id: number, name: string): Promise<Wallet | null> {
    const updatedWallet = this.WalletModel.findOneAndUpdate(
      { _id: id },
      { $set: new this.WalletModel({ name: name, updatedAt: new Date()}) },
      { new: true });
    return updatedWallet;
  }
  
  async updateWalletBalance(id: number, balance: number): Promise<Wallet | null> {
    const updatedWallet = this.WalletModel.findOneAndUpdate(
      { _id: id },
      { $set: new this.WalletModel({ balance: balance, updatedAt: new Date()}) },
      { new: true });
    return updatedWallet;
  }

  async deleteWallet(id: number): Promise<boolean> {
    const result = await this.WalletModel.deleteOne(
      { _id: id });

    return result.deletedCount > 0;
  }
}