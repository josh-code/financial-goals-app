'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { calculateSIP } from '@/utils/financial-calculations';

const bucketSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string(),
  goalAmount: z.number().min(1, 'Goal amount must be greater than 0'),
  timeline: z.number().min(1, 'Timeline must be at least 1 year'),
  returnRate: z.number().min(1, 'Return rate must be greater than 0'),
  sipIncrease: z.number().min(0, 'SIP increase must be non-negative'),
  initialLumpsum: z.number().min(0, 'Initial lumpsum must be non-negative'),
});

type BucketFormData = z.infer<typeof bucketSchema>;

interface BucketCreationFormProps {
  onSubmit: (bucket: {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    monthlyContribution: number;
  }) => void;
  onCancel: () => void;
}

export default function BucketCreationForm({ onSubmit, onCancel }: BucketCreationFormProps) {
  const [calculatedSIP, setCalculatedSIP] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BucketFormData>({
    resolver: zodResolver(bucketSchema),
  });

  const handleFormSubmit = (data: BucketFormData) => {
    const result = calculateSIP({
      goalAmount: data.goalAmount,
      timeline: data.timeline,
      returnRate: data.returnRate,
      sipIncrease: data.sipIncrease,
      initialLumpsum: data.initialLumpsum,
    });

    setCalculatedSIP(result.monthlyAmount);

    // Create a new bucket
    onSubmit({
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      targetAmount: data.goalAmount,
      currentAmount: data.initialLumpsum,
      monthlyContribution: result.monthlyAmount,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Bucket Name
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          {...register('description')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="goalAmount" className="block text-sm font-medium text-gray-700">
          Goal Amount
        </label>
        <input
          type="number"
          id="goalAmount"
          {...register('goalAmount', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.goalAmount && (
          <p className="mt-1 text-sm text-red-600">{errors.goalAmount.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="timeline" className="block text-sm font-medium text-gray-700">
          Timeline (years)
        </label>
        <input
          type="number"
          id="timeline"
          {...register('timeline', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.timeline && (
          <p className="mt-1 text-sm text-red-600">{errors.timeline.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="returnRate" className="block text-sm font-medium text-gray-700">
          Expected Return Rate (%)
        </label>
        <input
          type="number"
          id="returnRate"
          {...register('returnRate', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.returnRate && (
          <p className="mt-1 text-sm text-red-600">{errors.returnRate.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="sipIncrease" className="block text-sm font-medium text-gray-700">
          Annual SIP Increase (%)
        </label>
        <input
          type="number"
          id="sipIncrease"
          {...register('sipIncrease', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.sipIncrease && (
          <p className="mt-1 text-sm text-red-600">{errors.sipIncrease.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="initialLumpsum" className="block text-sm font-medium text-gray-700">
          Initial Lumpsum (optional)
        </label>
        <input
          type="number"
          id="initialLumpsum"
          {...register('initialLumpsum', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.initialLumpsum && (
          <p className="mt-1 text-sm text-red-600">{errors.initialLumpsum.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Create Bucket
        </button>
      </div>

      {calculatedSIP && (
        <div className="mt-4 p-4 bg-green-50 rounded-md">
          <p className="text-green-700">
            Required Monthly SIP: ₹{calculatedSIP.toLocaleString()}
          </p>
        </div>
      )}
    </form>
  );
} 