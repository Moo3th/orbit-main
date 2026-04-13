'use client';

import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { AdminDashboard } from './newAdmin/AdminDashboard';
import { SiteDataProvider } from './newAdmin/SiteDataContext';

export default function AdminPage() {
  return (
    <SiteDataProvider>
      <Toaster position="top-right" />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-gray-500">Loading admin...</div>}>
        <AdminDashboard />
      </Suspense>
    </SiteDataProvider>
  );
}
