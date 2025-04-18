export interface Bucket {
  _id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  description?: string;
  returnRate: number;
  timeline: number;
  sipIncrease: number;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
  paymentSchedule?: Array<{
    year: number;
    monthlyAmount: number;
    totalContribution: number;
    totalValue: number;
  }>;
} 