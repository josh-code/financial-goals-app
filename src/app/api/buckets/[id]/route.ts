import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Bucket from '@/models/Bucket';
import { calculateSIP } from '@/utils/financial-calculations';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const bucket = await Bucket.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!bucket) {
      return NextResponse.json(
        { message: 'Bucket not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(bucket);
  } catch (error) {
    console.error('Error fetching bucket:', error);
    return NextResponse.json(
      { message: 'Error fetching bucket' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
      timeline,
      returnRate,
      sipIncrease,
      currentAmount,
    } = body;

    await connectDB();

    const bucket = await Bucket.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!bucket) {
      return NextResponse.json(
        { message: 'Bucket not found' },
        { status: 404 }
      );
    }

    // Calculate new payment schedule if relevant fields changed
    if (targetAmount || timeline || returnRate || sipIncrease) {
      const result = calculateSIP({
        goalAmount: targetAmount || bucket.targetAmount,
        timeline: timeline || bucket.timeline,
        returnRate: returnRate || bucket.returnRate,
        sipIncrease: sipIncrease || bucket.sipIncrease,
        initialLumpsum: currentAmount || bucket.currentAmount,
      });

      bucket.paymentSchedule = result.yearlyBreakdown;
      bucket.monthlyContribution = result.monthlyAmount;
    }

    // Update other fields
    if (name) bucket.name = name;
    if (description) bucket.description = description;
    if (targetAmount) bucket.targetAmount = targetAmount;
    if (timeline) bucket.timeline = timeline;
    if (returnRate) bucket.returnRate = returnRate;
    if (sipIncrease) bucket.sipIncrease = sipIncrease;
    if (currentAmount) bucket.currentAmount = currentAmount;

    await bucket.save();

    return NextResponse.json(bucket);
  } catch (error) {
    console.error('Error updating bucket:', error);
    return NextResponse.json(
      { message: 'Error updating bucket' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const bucket = await Bucket.findOneAndDelete({
      _id: params.id,
      userId: session.user.id,
    });

    if (!bucket) {
      return NextResponse.json(
        { message: 'Bucket not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Bucket deleted successfully' });
  } catch (error) {
    console.error('Error deleting bucket:', error);
    return NextResponse.json(
      { message: 'Error deleting bucket' },
      { status: 500 }
    );
  }
} 