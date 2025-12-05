'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  user: any;
  onLogout: () => void;
}

export default function Sidebar({ user, onLogout }: SidebarProps) {
  const pathname = usePathname();

  // Define menu items with their respective permissions
  const menuItems = [
    {
      href: '/dashboard',
      label: 'Home',
      icon: '📊',
      roles: ['super_admin', 'feedback_manager', 'driver_authenticator', 'support_agent']
    },
    {
      href: '/dashboard/users',
      label: 'User',
      icon: '👥',
      roles: ['super_admin']
    },
    {
      href: '/dashboard/cars',
      label: 'Car',
      icon: '🚗',
      roles: ['super_admin', 'driver_authenticator']
    },
    {
      href: '/dashboard/drivers',
      label: 'Driver',
      icon: '🚗',
      roles: ['super_admin', 'driver_authenticator']
    },
{
      href: '/dashboard/rides',
      label: 'Ride Management',
      icon: '📍',
      roles: ['super_admin', 'support_agent']
    },
        { 
      href: '/dashboard/trip-lists', 
      label: 'Trip List', 
      icon: '🚗', 
      roles: ['super_admin', 'driver_authenticator'] 
    },
    {
      href: '/dashboard/feedback',
      label: 'User Feedback',
      icon: '💬',
      roles: ['super_admin', 'feedback_manager', 'support_agent']
    },
    {
      href: '/dashboard/transaction',
      label: 'Transaction',
      icon: '📈',
      roles: ['super_admin']
    },
    {
      href: '/dashboard/settings',
      label: 'Settings',
      icon: '⚙️',
      roles: ['super_admin']
    },
  ];

  // Check if user has access to a menu item
  const canAccess = (roles: string[]) => {
    return roles.includes(user.role);
  };

  return (
    <div className="w-64 bg-blue-800 text-white flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-blue-700">
        <h2 className="text-lg font-semibold">Admin Panel</h2>
        <div className="mt-2 text-sm text-blue-200">
          <div>Logged in as: {user.name}</div>
          <div className="bg-blue-600 px-2 py-1 rounded mt-1 text-xs inline-block">
            {user.role.replace('_', ' ').toUpperCase()}
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="py-4 space-y-1">
          {menuItems.map((item) =>
            canAccess(item.roles) && (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${pathname === item.href
                    ? 'bg-blue-900 text-white border-r-4 border-white'
                    : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                    }`}
                >
                  <span className="mr-3 text-base">{item.icon}</span>
                  {item.label}
                  {pathname === item.href && (
                    <span className="ml-auto w-2 h-2 bg-white rounded-full"></span>
                  )}
                </Link>
              </li>
            )
          )}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-blue-700">
        <button
          onClick={onLogout}
          className="flex items-center w-full px-3 py-2 text-sm text-blue-100 hover:bg-blue-700 hover:text-white rounded-md transition-colors duration-200"
        >
          <span className="mr-3">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
}