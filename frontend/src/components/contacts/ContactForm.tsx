'use client';

import React, { useState, FormEvent } from 'react';
import { Contact, ContactFormData } from '@/types';
import { Button, Input, Alert } from '@/components/ui';

interface ContactFormProps {
  contact?: Contact;
  onSubmit: (data: ContactFormData) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  contact,
  onSubmit,
  onCancel,
  submitLabel = 'Save Contact',
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: contact?.name || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    photo: contact?.photo || '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save contact. Please try again.');
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
        <Input
          label="Name"
          name="name"
          type="text"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          label="Phone"
          name="phone"
          type="tel"
          placeholder="+1234567890"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <Input
          label="Photo URL"
          name="photo"
          type="url"
          placeholder="https://example.com/photo.jpg (optional)"
          value={formData.photo}
          onChange={handleChange}
        />

        <div className="flex space-x-3 pt-4">
          <Button
            type="submit"
            fullWidth
            loading={loading}
            disabled={loading}
          >
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
