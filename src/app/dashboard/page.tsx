'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Dashboard from '@/components/Dashboard';
import BucketList from '@/components/BucketList';
import { Bucket } from '@/types/bucket';

export default function DashboardPage() {
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchBuckets();
    }
  }, [status, router]);

  const fetchBuckets = async () => {
    try {
      const response = await fetch('/api/buckets');
      if (!response.ok) {
        throw new Error('Failed to fetch buckets');
      }
      const data = await response.json();
      setBuckets(data);
    } catch (err) {
      console.error('Error fetching buckets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBucket = async (newBucket: Omit<Bucket, '_id' | 'monthlyContribution'>) => {
    try {
      console.log('Creating bucket with data:', newBucket);
      const response = await fetch('/api/buckets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBucket),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to create bucket:', errorData);
        throw new Error(errorData.message || 'Failed to create bucket');
      }

      const createdBucket = await response.json();
      console.log('Successfully created bucket:', createdBucket);
      setBuckets([...buckets, createdBucket]);
    } catch (err) {
      console.error('Error creating bucket:', err);
      throw err;
    }
  };

  const handleDeleteBucket = async (id: string) => {
    try {
      const response = await fetch(`/api/buckets/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete bucket');
      }

      setBuckets(buckets.filter(bucket => bucket._id !== id));
    } catch (err) {
      console.error('Error deleting bucket:', err);
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      setError(null);
      // Clear any local storage or cookies if needed
      localStorage.clear();
      // Sign out and redirect
      await signOut({ 
        redirect: false,
        callbackUrl: '/login'
      });
      // Force a hard navigation to ensure complete cleanup
      window.location.href = '/login';
    } catch (err) {
      console.error('Error during logout:', err);
      setError('Failed to logout. Please try again.');
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex flex-col items-end">
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>
      </div>
      <Dashboard buckets={buckets} />
      <BucketList 
        buckets={buckets} 
        onCreateBucket={handleCreateBucket} 
        onDeleteBucket={handleDeleteBucket}
      />
    </div>
  );
} 