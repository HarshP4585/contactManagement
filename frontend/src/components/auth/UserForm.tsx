'use client';

import React, { useState, FormEvent } from 'react';
import { Button, Input, Alert } from '@/components/ui';
import { RegisterData } from '@/types';

interface UserFormProps {
  onSubmit: (data: RegisterData & { role_id: number }) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  allowRoleSelection?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  onSubmit,
  onCancel,
  submitLabel = 'Create User',
  allowRoleSelection = false,
}) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role_id: 2,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.name === 'role_id' ? parseInt(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        role_id: formData.role_id,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <Alert variant="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            name="first_name"
            type="text"
            placeholder="John"
            value={formData.first_name}
            onChange={handleChange}
            required
          />

          <Input
            label="Last Name"
            name="last_name"
            type="text"
            placeholder="Doe"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>

        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {allowRoleSelection && (
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              required
            >
              <option value={2}>User (Regular)</option>
              <option value={1}>Admin</option>
            </select>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {formData.role_id === 1
                ? 'Admin users can view all contacts and create other admin users'
                : 'Regular users can only manage their own contacts'}
            </p>
          </div>
        )}

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          helperText="Minimum 6 characters"
          required
        />

        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <div className="flex space-x-3 pt-4">
          <Button type="submit" fullWidth loading={loading} disabled={loading}>
            {submitLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
