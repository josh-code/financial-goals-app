'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // For now, always redirect to login
    router.push('/login');
  }, [router]);

  return null;
}
