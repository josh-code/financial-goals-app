'use client';

import { useState } from 'react';
import BucketCreationForm from './BucketCreationForm';

interface Bucket {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
}

interface BucketListProps {
  buckets: Bucket[];
  onCreateBucket: (bucket: Bucket) => void;
}

export default function BucketList({ buckets, onCreateBucket }: BucketListProps) {
  const [showCreationForm, setShowCreationForm] = useState(false);

  const handleCreateBucket = (newBucket: Bucket) => {
    onCreateBucket(newBucket);
    setShowCreationForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Your Buckets</h2>
        <button
          onClick={() => setShowCreationForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Create New Bucket
        </button>
      </div>

      {showCreationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <BucketCreationForm onSubmit={handleCreateBucket} onCancel={() => setShowCreationForm(false)} />
          </div>
        </div>
      )}

      {buckets.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No buckets created yet. Click the button above to create one!</p>
      ) : (
        <div className="grid gap-4">
          {buckets.map((bucket) => (
            <div key={bucket.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium">{bucket.name}</h3>
              <div className="mt-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Current: ${bucket.currentAmount}</span>
                  <span>Target: ${bucket.targetAmount}</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{ width: `${(bucket.currentAmount / bucket.targetAmount) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 