import mongoose, { Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  balance: number;
  totalEarnings: number;
  referralCode: string;
  referredBy?: string;
  hasPurchasedBot: boolean;
  botPurchaseDate?: Date;
  withdrawalAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
      min: 0,
    },
    referralCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    referredBy: {
      type: String,
      uppercase: true,
    },
    hasPurchasedBot: {
      type: Boolean,
      default: false,
    },
    botPurchaseDate: {
      type: Date,
    },
    withdrawalAddress: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ referralCode: 1 });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
