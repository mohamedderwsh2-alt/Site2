import mongoose, { Document, Model } from 'mongoose';

export interface ITradeHistory extends Document {
  userId: mongoose.Types.ObjectId;
  tradeAmount: number;
  profitAmount: number;
  balanceAfterTrade: number;
  timestamp: Date;
  createdAt: Date;
}

const TradeHistorySchema = new mongoose.Schema<ITradeHistory>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tradeAmount: {
      type: Number,
      required: true,
    },
    profitAmount: {
      type: Number,
      required: true,
    },
    balanceAfterTrade: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for faster queries
TradeHistorySchema.index({ userId: 1, timestamp: -1 });

const TradeHistory: Model<ITradeHistory> = 
  mongoose.models.TradeHistory || mongoose.model<ITradeHistory>('TradeHistory', TradeHistorySchema);

export default TradeHistory;
