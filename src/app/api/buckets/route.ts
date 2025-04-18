import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Bucket from '@/models/Bucket';
import { calculateSIP } from '@/utils/financial-calculations';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const buckets = await Bucket.find({ userId: session.user.id });

    return NextResponse.json(buckets);
  } catch (error) {
    console.error('Error fetching buckets:', error);
    return NextResponse.json(
      { message: 'Error fetching buckets' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      targetAmount,
      currentAmount,
      timeline,
      returnRate,
      sipIncrease,
    } = body;

    // Validate required fields
    if (!name || !targetAmount || !timeline || !returnRate) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate SIP and payment schedule
    const result = calculateSIP({
      goalAmount: targetAmount,
      timeline,
      returnRate,
      sipIncrease: sipIncrease || 0,
      initialLumpsum: currentAmount || 0,
    });

    // Map the yearly breakdown to the required payment schedule format
    const paymentSchedule = result.yearlyBreakdown.map(breakdown => ({
      year: breakdown.year,
      monthlyAmount: breakdown.sipAmount,
      totalContribution: breakdown.totalInvestment,
      totalValue: breakdown.expectedValue,
    }));

    await connectDB();

    const bucket = await Bucket.create({
      name,
      description,
      targetAmount,
      currentAmount: currentAmount || 0,
      monthlyContribution: result.monthlyAmount,
      returnRate,
      timeline,
      sipIncrease: sipIncrease || 0,
      paymentSchedule,
      userId: session.user.id,
    });

    return NextResponse.json(bucket, { status: 201 });
  } catch (error) {
    console.error('Error creating bucket:', error);
    return NextResponse.json(
      { message: 'Error creating bucket' },
      { status: 500 }
    );
  }
} 