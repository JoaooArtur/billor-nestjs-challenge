import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from '../projections/transaction.schema';
import { TransactionType } from '../enumerations/transaction-type.enum';
import { TransactionStatus } from '../enumerations/transaction-status.enum';

@Injectable()
export class TransactionsReadRepository {
  constructor(@InjectModel('Transaction') private readonly TransactionModel: Model<Transaction>) {}

  async getAll(): Promise<Transaction[]> {
    return this.TransactionModel.find().exec();
  }
  async getTransactionById(id: number): Promise<Transaction> {
    return this.TransactionModel.findById(id).exec();
  }

  async projectTransaction(id: number,
    type: TransactionType,
    status: TransactionStatus,
    amount: number,
    category: string,
    sourceWallet: number,
    targetWallet: number,
    userId: number): Promise<Transaction> {
    return this.TransactionModel.create({_id: id, type, status, amount, category, sourceWallet, targetWallet, userId});
  }

  async updateTransactionStatus(id: number, status: TransactionStatus): Promise<Transaction | null> {
    const updatedTransaction = this.TransactionModel.findOneAndUpdate(
      { _id: id },
      { $set: new this.TransactionModel({ status, updatedAt: new Date()}) },
      { new: true });
    return updatedTransaction;
  }

  async getFiltered(
    walletId?: number,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Transaction[]> {
    const filters: any = {};
    if (walletId) {
      filters.sourceWallet = walletId;
    }

    if (startDate && endDate) {
      filters.createdAt = { $gte: startDate, $lte: endDate };
    }
    return this.TransactionModel.find(filters).exec();
  }
}