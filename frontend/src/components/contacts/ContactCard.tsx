'use client';

import React from 'react';
import { Contact } from '@/types';
import { Card, CardContent, Button } from '@/components/ui';

interface ContactCardProps {
  contact: Contact;
  currentUserId: number;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({ contact, currentUserId, onEdit, onDelete }) => {
  const initials = contact.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Check if current user owns this contact
  const isOwner = contact.user_id === currentUserId;

  return (
    <Card hover>
      <CardContent className="flex items-start justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex-shrink-0">
            {contact.photo ? (
              <img
                src={contact.photo}
                alt={contact.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">{initials}</span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {contact.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {contact.email}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {contact.phone}
            </p>
            {/* Show owner info for admin viewing others' contacts */}
            {!isOwner && contact.first_name && (
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Owner: {contact.first_name} {contact.last_name}
              </p>
            )}
          </div>
        </div>

        {/* Only show edit/delete buttons if user owns the contact */}
        {isOwner && (
          <div className="flex flex-col space-y-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(contact)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(contact)}
            >
              Delete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
