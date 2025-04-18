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
    name: string;
    description?: string;
    targetAmount: number;
    currentAmount: number;
    monthlyContribution: number;
    returnRate: number;
    timeline: number;
    sipIncrease: number;
  }) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function BucketCreationForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: BucketCreationFormProps) {
  const [calculatedSIP, setCalculatedSIP] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BucketFormData>({
    resolver: zodResolver(bucketSchema),
  });

  const handleFormSubmit = async (data: BucketFormData) => {
    try {
      console.log('Form data:', data);
      const result = calculateSIP({
        goalAmount: data.goalAmount,
        timeline: data.timeline,
        returnRate: data.returnRate,
        sipIncrease: data.sipIncrease,
        initialLumpsum: data.initialLumpsum,
      });

      console.log('SIP calculation result:', result);
      setCalculatedSIP(result.monthlyAmount);

      await onSubmit({
        name: data.name,
        description: data.description,
        targetAmount: data.goalAmount,
        currentAmount: data.initialLumpsum,
        monthlyContribution: result.monthlyAmount,
        returnRate: data.returnRate,
        timeline: data.timeline,
        sipIncrease: data.sipIncrease,
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      // You might want to show an error message to the user here
    }
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled={isSubmitting}
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled={isSubmitting}
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled={isSubmitting}
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled={isSubmitting}
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled={isSubmitting}
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled={isSubmitting}
        />
        {errors.sipIncrease && (
          <p className="mt-1 text-sm text-red-600">{errors.sipIncrease.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="initialLumpsum" className="block text-sm font-medium text-gray-700">
          Initial Investment
        </label>
        <input
          type="number"
          id="initialLumpsum"
          {...register('initialLumpsum', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled={isSubmitting}
        />
        {errors.initialLumpsum && (
          <p className="mt-1 text-sm text-red-600">{errors.initialLumpsum.message}</p>
        )}
      </div>

      {calculatedSIP && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
          <p className="font-medium">Required Monthly Investment:</p>
          <p className="text-2xl font-bold">₹{calculatedSIP.toLocaleString()}</p>
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Bucket'}
        </button>
      </div>
    </form>
  );
} 