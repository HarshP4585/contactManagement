'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Modal, Alert } from '@/components/ui';
import { ContactsTable } from '@/components/contacts/ContactsTable';
import { ContactForm } from '@/components/contacts/ContactForm';
import { contactsApi } from '@/lib/api/contacts';
import { Contact, ContactFormData, PaginationMeta } from '@/types';

export default function ContactsPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState<'created_at' | 'name'>('created_at');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
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

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      // Reset to page 1 when search changes
      if (searchTerm !== debouncedSearch) {
        setPagination({ ...pagination, page: 1 });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchContacts();
    }
  }, [isAuthenticated, pagination.page, sortBy, sortOrder, debouncedSearch]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const result = await contactsApi.getAll({
        page: pagination.page,
        limit: pagination.limit,
        sortBy,
        order: sortOrder,
        search: debouncedSearch,
      });
      setContacts(result.data);
      setPagination(result.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  // No client-side filtering needed - search is now server-side
  const filteredContacts = contacts;

  const handleSortByName = () => {
    if (sortBy === 'name') {
      // If already sorting by name, toggle the order
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      // If switching to name sort, default to ascending
      setSortBy('name');
      setSortOrder('ASC');
      setPagination({ ...pagination, page: 1 }); // Reset to first page on sort change
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateContact = async (data: ContactFormData | FormData) => {
    await contactsApi.create(data);
    setSuccess('Contact created successfully');
    setIsCreateModalOpen(false);
    fetchContacts();
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleEditContact = async (data: ContactFormData | FormData) => {
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

  const exportToCSV = () => {
    // Define CSV headers
    const headers = ['Name', 'Email', 'Phone', 'Owner', 'Created At'];

    // Convert contacts to CSV rows
    const rows = filteredContacts.map((contact) => {
      const owner = (contact as any).first_name
        ? `${(contact as any).first_name} ${(contact as any).last_name}`
        : 'You';

      const createdAt = new Date(contact.created_at).toLocaleString();

      return [
        contact.name,
        contact.email,
        contact.phone,
        owner,
        createdAt,
      ];
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `contacts_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (authLoading || !isAuthenticated) {
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
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {user?.role_id === 1 ? 'All Contacts' : 'My Contacts'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {debouncedSearch
                ? `${pagination.total} ${pagination.total === 1 ? 'result' : 'results'} for "${debouncedSearch}"`
                : `${pagination.total} ${pagination.total === 1 ? 'contact' : 'contacts'} total`}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Add Contact
            </Button>
            <Button
              variant="outline"
              onClick={exportToCSV}
              disabled={filteredContacts.length === 0}
            >
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Export CSV</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search contacts by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-11 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            {searchTerm && searchTerm !== debouncedSearch && (
              <div className="absolute right-12 top-3.5">
                <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
          {searchTerm && searchTerm !== debouncedSearch && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Searching...</p>
          )}
        </div>

        {user?.role_id === 1 && (
          <Alert variant="info">
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
        ) : filteredContacts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {debouncedSearch ? (
              <>
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No contacts found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  No contacts match your search for &quot;{debouncedSearch}&quot;. Try a different search term.
                </p>
                <div className="mt-6">
                  <Button variant="outline" onClick={() => setSearchTerm('')}>
                    Clear Search
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No contacts</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new contact.</p>
                <div className="mt-6">
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    Add Contact
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          <ContactsTable
            contacts={filteredContacts}
            currentUserId={user?.id || 0}
            isAdmin={user?.role_id === 1}
            sortBy={sortBy}
            sortOrder={sortOrder}
            pagination={pagination}
            onSort={handleSortByName}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
            onPageChange={handlePageChange}
          />
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
            <p className="text-gray-600 dark:text-gray-400">
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
  );
}
