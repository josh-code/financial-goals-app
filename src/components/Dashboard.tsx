'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/utils/financial-calculations';
import { Bucket } from '@/types/bucket';

interface DashboardProps {
  buckets: Bucket[];
}

export default function Dashboard({ buckets }: DashboardProps) {
  const totalPortfolioValue = buckets.reduce((sum, bucket) => sum + bucket.currentAmount, 0);
  const totalMonthlyContribution = buckets.reduce((sum, bucket) => sum + bucket.monthlyContribution, 0);
  const totalTargetAmount = buckets.reduce((sum, bucket) => sum + bucket.targetAmount, 0);
  const overallProgress = totalTargetAmount === 0 ? 0 : (totalPortfolioValue / totalTargetAmount) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900">
              Portfolio Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {formatCurrency(totalPortfolioValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900">
              Monthly Investment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(totalMonthlyContribution)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900">
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Current: {formatCurrency(totalPortfolioValue)}</span>
              <span>Target: {formatCurrency(totalTargetAmount)}</span>
            </div>
            <div className="w-full">
              <Progress 
                value={isNaN(overallProgress) ? 0 : overallProgress}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm font-medium text-gray-900">
                {isNaN(overallProgress) ? 0 : Math.round(overallProgress)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 