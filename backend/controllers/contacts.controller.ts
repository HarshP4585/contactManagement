import { Request, Response } from 'express';
import { ContactsUtils } from '../utils/contacts.utils';
import { CreateContactDto, UpdateContactDto } from '../types/dtos';

export class ContactsController {
  static async createContact(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const { name, email, phone, photo }: CreateContactDto = req.body;

      // Validation
      if (!name || !email || !phone) {
        res.status(400).json({
          success: false,
          message: 'Please provide name, email, and phone',
        });
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          success: false,
          message: 'Please provide a valid email address',
        });
        return;
      }

      // Phone validation (basic)
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(phone)) {
        res.status(400).json({
          success: false,
          message: 'Please provide a valid phone number',
        });
        return;
      }

      // Create contact
      const contact = await ContactsUtils.createContact(req.user.userId, {
        name,
        email,
        phone,
        photo,
      });

      res.status(201).json({
        success: true,
        message: 'Contact created successfully',
        data: contact,
      });
    } catch (error) {
      console.error('Create contact error:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating contact',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  static async getAllContacts(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      // Check if user is admin (role_id === 1)
      const isAdmin = req.user.role_id === 1;

      const contacts = isAdmin
        ? await ContactsUtils.getAllContactsForAdmin()
        : await ContactsUtils.getAllContacts(req.user.userId);

      res.status(200).json({
        success: true,
        message: 'Contacts retrieved successfully',
        data: contacts,
        count: contacts.length,
      });
    } catch (error) {
      console.error('Get contacts error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching contacts',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  static async getContactById(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const contactId = parseInt(req.params.id);

      if (isNaN(contactId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid contact ID',
        });
        return;
      }

      // Check if user is admin (role_id === 1)
      const isAdmin = req.user.role_id === 1;

      const contact = isAdmin
        ? await ContactsUtils.getContactByIdForAdmin(contactId)
        : await ContactsUtils.getContactById(contactId, req.user.userId);

      if (!contact) {
        res.status(404).json({
          success: false,
          message: 'Contact not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Contact retrieved successfully',
        data: contact,
      });
    } catch (error) {
      console.error('Get contact error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching contact',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  static async updateContact(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const contactId = parseInt(req.params.id);

      if (isNaN(contactId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid contact ID',
        });
        return;
      }

      // Check ownership - even admins cannot modify others' contacts
      const ownsContact = await ContactsUtils.contactExistsForUser(contactId, req.user.userId);
      if (!ownsContact) {
        res.status(403).json({
          success: false,
          message: 'You do not have permission to update this contact',
        });
        return;
      }

      const updateData: UpdateContactDto = {};
      const { name, email, phone, photo } = req.body;

      if (name !== undefined) updateData.name = name;
      if (email !== undefined) {
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          res.status(400).json({
            success: false,
            message: 'Please provide a valid email address',
          });
          return;
        }
        updateData.email = email;
      }
      if (phone !== undefined) {
        // Phone validation
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(phone)) {
          res.status(400).json({
            success: false,
            message: 'Please provide a valid phone number',
          });
          return;
        }
        updateData.phone = phone;
      }
      if (photo !== undefined) updateData.photo = photo;

      if (Object.keys(updateData).length === 0) {
        res.status(400).json({
          success: false,
          message: 'No update data provided',
        });
        return;
      }

      const contact = await ContactsUtils.updateContact(contactId, req.user.userId, updateData);

      if (!contact) {
        res.status(404).json({
          success: false,
          message: 'Contact not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Contact updated successfully',
        data: contact,
      });
    } catch (error) {
      console.error('Update contact error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating contact',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  static async deleteContact(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const contactId = parseInt(req.params.id);

      if (isNaN(contactId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid contact ID',
        });
        return;
      }

      // Check ownership - even admins cannot delete others' contacts
      const ownsContact = await ContactsUtils.contactExistsForUser(contactId, req.user.userId);
      if (!ownsContact) {
        res.status(403).json({
          success: false,
          message: 'You do not have permission to delete this contact',
        });
        return;
      }

      const deleted = await ContactsUtils.deleteContact(contactId, req.user.userId);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Contact not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Contact deleted successfully',
      });
    } catch (error) {
      console.error('Delete contact error:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting contact',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
