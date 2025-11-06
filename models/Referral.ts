import mongoose, { Document, Model } from 'mongoose';

export interface IReferral extends Document {
  referrerId: mongoose.Types.ObjectId;
  referredUserId: mongoose.Types.ObjectId;
  initialDepositCommission: number;
  totalProfitCommission: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReferralSchema = new mongoose.Schema<IReferral>(
  {
    referrerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    referredUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    initialDepositCommission: {
      type: Number,
      default: 0,
    },
    totalProfitCommission: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create index
ReferralSchema.index({ referrerId: 1 });
ReferralSchema.index({ referredUserId: 1 });

const Referral: Model<IReferral> = 
  mongoose.models.Referral || mongoose.model<IReferral>('Referral', ReferralSchema);

export default Referral;
