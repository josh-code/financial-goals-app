'use client';

import { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import BucketList from '@/components/BucketList';

interface Bucket {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
}

export default function Home() {
  const [buckets, setBuckets] = useState<Bucket[]>([]);

  const handleCreateBucket = (newBucket: Bucket) => {
    setBuckets([...buckets, newBucket]);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Financial Goal Planner</h1>
      <div className="max-w-7xl mx-auto space-y-8">
        <Dashboard buckets={buckets} />
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <BucketList buckets={buckets} onCreateBucket={handleCreateBucket} />
        </div>
      </div>
    </main>
  );
}
