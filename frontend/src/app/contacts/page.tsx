'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Button, Modal, Alert } from '@/components/ui';
import { ContactCard } from '@/components/contacts/ContactCard';
import { ContactForm } from '@/components/contacts/ContactForm';
import { contactsApi } from '@/lib/api/contacts';
import { Contact, ContactFormData } from '@/types';

export default function ContactsPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchContacts();
    }
  }, [isAuthenticated]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await contactsApi.getAll();
      setContacts(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContact = async (data: ContactFormData) => {
    await contactsApi.create(data);
    setSuccess('Contact created successfully');
    setIsCreateModalOpen(false);
    fetchContacts();
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleEditContact = async (data: ContactFormData) => {
    if (!selectedContact) return;
    await contactsApi.update(selectedContact.id, data);
    setSuccess('Contact updated successfully');
    setIsEditModalOpen(false);
    setSelectedContact(null);
    fetchContacts();
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeleteContact = async () => {
    if (!selectedContact) return;
    try {
      setDeleteLoading(true);
      await contactsApi.delete(selectedContact.id);
      setSuccess('Contact deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedContact(null);
      fetchContacts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete contact');
    } finally {
      setDeleteLoading(false);
    }
  };

  const openEditModal = (contact: Contact) => {
    setSelectedContact(contact);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDeleteModalOpen(true);
  };

  if (authLoading || !isAuthenticated) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user?.role_id === 1 ? 'All Contacts' : 'My Contacts'}
            </h1>
            <p className="text-gray-600 mt-1">
              {contacts.length} {contacts.length === 1 ? 'contact' : 'contacts'}
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            Add Contact
          </Button>
        </div>

        {user?.role_id === 1 && (
          <Alert variant="info" className="mb-4">
            <strong>Admin View:</strong> You can view all contacts from all users. You can only edit or delete your own contacts.
          </Alert>
        )}

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

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No contacts</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new contact.</p>
            <div className="mt-6">
              <Button onClick={() => setIsCreateModalOpen(true)}>
                Add Contact
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {contacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                currentUserId={user?.id || 0}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
              />
            ))}
          </div>
        )}

        {/* Create Contact Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Add New Contact"
        >
          <ContactForm
            onSubmit={handleCreateContact}
            onCancel={() => setIsCreateModalOpen(false)}
            submitLabel="Create Contact"
          />
        </Modal>

        {/* Edit Contact Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedContact(null);
          }}
          title="Edit Contact"
        >
          {selectedContact && (
            <ContactForm
              contact={selectedContact}
              onSubmit={handleEditContact}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedContact(null);
              }}
              submitLabel="Update Contact"
            />
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedContact(null);
          }}
          title="Delete Contact"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete <strong>{selectedContact?.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="danger"
                fullWidth
                onClick={handleDeleteContact}
                loading={deleteLoading}
                disabled={deleteLoading}
              >
                Delete
              </Button>
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedContact(null);
                }}
                disabled={deleteLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
}
