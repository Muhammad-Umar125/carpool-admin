'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('adminUser');
    if (!userData) {
      router.push('/');
      return;
    }
    setUser(JSON.parse(userData));
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect due to useEffect
  }

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    router.push('/');
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-gray-100">
      <Sidebar user={user} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-6 py-4 text-black">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span>Welcome, {user.name}</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                {user.role.replace('_', ' ').toUpperCase()}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}