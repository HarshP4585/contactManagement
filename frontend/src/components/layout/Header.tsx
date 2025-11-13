'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui';

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/contacts') {
      return pathname === '/contacts';
    }
    if (path === '/admin/users') {
      return pathname.startsWith('/admin');
    }
    return pathname === path;
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              Contact Manager
            </Link>
            {isAuthenticated && (
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/contacts"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/contacts')
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Contacts
                </Link>
                {user?.role_id === 1 && (
                  <Link
                    href="/admin/users"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/admin/users')
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    Admin
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">
                    Welcome, {user?.first_name} {user?.last_name}
                  </span>
                  {user?.role_id === 1 && (
                    <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                      Admin
                    </span>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
