'use client';

import { useState } from 'react';
import { Bucket } from '@/types/bucket';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/utils/financial-calculations';

interface BucketListProps {
  buckets: Bucket[];
  onCreateBucket: (bucket: Omit<Bucket, '_id' | 'monthlyContribution'>) => Promise<void>;
  onDeleteBucket: (id: string) => Promise<void>;
}

export default function BucketList({ buckets, onCreateBucket, onDeleteBucket }: BucketListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBucket, setNewBucket] = useState<Omit<Bucket, '_id' | 'monthlyContribution'>>({
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    description: '',
    returnRate: 0,
    timeline: 0,
    sipIncrease: 0,
    userId: '',
  });
  const router = useRouter();

  const handleCreateBucket = async () => {
    try {
      await onCreateBucket(newBucket);
      setIsModalOpen(false);
      setNewBucket({
        name: '',
        targetAmount: 0,
        currentAmount: 0,
        description: '',
        returnRate: 0,
        timeline: 0,
        sipIncrease: 0,
        userId: '',
      });
    } catch (error) {
      console.error('Error creating bucket:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Buckets</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Bucket
        </button>
      </div>

      {buckets.length === 0 ? (
        <p className="text-gray-500">No buckets yet. Create one to get started!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {buckets.map((bucket) => (
            <div
              key={bucket._id}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/dashboard/bucket/${bucket._id}`)}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold">{bucket.name}</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteBucket(bucket._id);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
              <p className="text-gray-600 mt-2">{bucket.description}</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Target Amount:</span>
                  <span>₹{bucket.targetAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Amount:</span>
                  <span>₹{bucket.currentAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly SIP:</span>
                  <span>₹{bucket.monthlyContribution.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Create New Bucket</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={newBucket.name}
                  onChange={(e) => setNewBucket({ ...newBucket, name: e.target.value })}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Target Amount</label>
                <input
                  type="number"
                  value={newBucket.targetAmount}
                  onChange={(e) => setNewBucket({ ...newBucket, targetAmount: Number(e.target.value) })}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Initial Investment</label>
                <input
                  type="number"
                  value={newBucket.currentAmount}
                  onChange={(e) => setNewBucket({ ...newBucket, currentAmount: Number(e.target.value) })}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={newBucket.description}
                  onChange={(e) => setNewBucket({ ...newBucket, description: e.target.value })}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Return Rate (%)</label>
                <input
                  type="number"
                  value={newBucket.returnRate}
                  onChange={(e) => setNewBucket({ ...newBucket, returnRate: Number(e.target.value) })}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Timeline (years)</label>
                <input
                  type="number"
                  value={newBucket.timeline}
                  onChange={(e) => setNewBucket({ ...newBucket, timeline: Number(e.target.value) })}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">SIP Increase (%)</label>
                <input
                  type="number"
                  value={newBucket.sipIncrease}
                  onChange={(e) => setNewBucket({ ...newBucket, sipIncrease: Number(e.target.value) })}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateBucket}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 