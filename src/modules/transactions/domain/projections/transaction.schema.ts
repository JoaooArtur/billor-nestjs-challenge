import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TransactionType } from '../enumerations/transaction-type.enum';
import { TransactionStatus } from '../enumerations/transaction-status.enum';

@Schema()
export class Transaction extends Document {
  @Prop({ required: true })
  _id: number;

  @Prop({ required: true })
  status: TransactionStatus;

  @Prop({ required: true })
  type: TransactionType;

  @Prop({ required: true })
  amount: number;

  @Prop()
  category: string;

  @Prop()
  sourceWallet: number;

  @Prop()
  targetWallet: number;

  @Prop({ required: true })
  userId: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
