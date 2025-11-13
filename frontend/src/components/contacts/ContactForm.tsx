'use client';

import React, { useState, FormEvent } from 'react';
import { Contact, ContactFormData } from '@/types';
import { Button, Input, Alert } from '@/components/ui';

interface ContactFormProps {
  contact?: Contact;
  onSubmit: (data: ContactFormData | FormData) => Promise<void>;
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
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>(contact?.photo || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type - only JPG and PNG
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a JPG or PNG image file');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setPhotoFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create FormData to send file upload
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);

      if (photoFile) {
        data.append('photo', photoFile);
      }

      await onSubmit(data);
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photo (optional)
          </label>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="mt-1 text-xs text-gray-500">
            Accepts JPG, PNG. Max size: 5MB
          </p>

          {photoPreview && (
            <div className="mt-3">
              <img
                src={photoPreview}
                alt="Photo preview"
                className="h-20 w-20 rounded-full object-cover border-2 border-gray-200"
              />
            </div>
          )}
        </div>

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
