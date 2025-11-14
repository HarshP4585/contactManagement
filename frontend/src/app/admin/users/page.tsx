'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Modal, Alert, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { UserForm } from '@/components/auth/UserForm';
import { authApi } from '@/lib/api/auth';
import { RegisterData } from '@/types';

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
    // Redirect if not admin
    if (!authLoading && isAuthenticated && user?.role_id !== 1) {
      router.push('/contacts');
    }
  }, [isAuthenticated, authLoading, user, router]);

  const handleCreateUser = async (data: RegisterData & { role_id: number }) => {
    try {
      await authApi.registerWithRole(data);
      setSuccess(
        `User created successfully as ${data.role_id === 1 ? 'Admin' : 'Regular User'}`
      );
      setIsCreateModalOpen(false);
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      throw err; // Let UserForm handle the error
    }
  };

  if (authLoading || !isAuthenticated || user?.role_id !== 1) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">User Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Create and manage users</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>Create New User</Button>
        </div>

        {success && (
          <Alert variant="success" onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {error && (
          <Alert variant="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Admin Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Admin users have elevated privileges and can:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>View all contacts from all users</li>
                <li>Create new admin users</li>
                <li>Create regular users</li>
                <li>Edit and delete their own contacts</li>
              </ul>
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Only admins can create other admin users. This ensures proper access control.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regular Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Regular users have standard access and can:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>View only their own contacts</li>
                <li>Create new contacts</li>
                <li>Edit their own contacts</li>
                <li>Delete their own contacts</li>
              </ul>
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Regular users are created by default during public registration.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Security Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p>
                  <strong>Admin Creation:</strong> Only create admin accounts for trusted
                  personnel who require elevated access.
                </p>
              </div>
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <p>
                  <strong>Strong Passwords:</strong> Ensure all users set strong passwords with
                  at least 6 characters.
                </p>
              </div>
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p>
                  <strong>Default Admin:</strong> Remember to change the default admin password
                  (admin@admin.com) if you haven't already.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create User Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New User"
        >
          <UserForm
            onSubmit={handleCreateUser}
            onCancel={() => setIsCreateModalOpen(false)}
            submitLabel="Create User"
            allowRoleSelection={true}
          />
        </Modal>
      </div>
  );
}
