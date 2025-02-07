"use client";
import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [dots, setDots] = useState('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-base-100 z-50 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg font-medium animate-pulse">
            Loading your experience{dots}
          </p>
          <p className="text-sm text-gray-500">
            Setting up your personalized workspace
          </p>
        </div>
      </div>
    </div>
  );
}
