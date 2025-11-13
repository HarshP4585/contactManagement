import { AppDataSource } from '../db/data-source';
import { Contact } from '../types/entities';
import { CreateContactDto, UpdateContactDto } from '../types/dtos';
import * as fs from 'fs';
import * as path from 'path';

export class ContactsUtils {
  /**
   * Convert photo path to base64 data URL
   */
  private static async photoToBase64(photoPath: string | null): Promise<string | null> {
    if (!photoPath) return null;

    try {
      // Remove leading slash if present to get relative path
      const relativePath = photoPath.startsWith('/') ? photoPath.slice(1) : photoPath;
      const fullPath = path.join(process.cwd(), relativePath);

      // Check if file exists
      if (!fs.existsSync(fullPath)) {
        return null;
      }

      // Read file and convert to base64
      const imageBuffer = fs.readFileSync(fullPath);
      const base64Image = imageBuffer.toString('base64');

      // Determine mime type from file extension
      const ext = path.extname(fullPath).toLowerCase();
      let mimeType = 'image/jpeg';
      if (ext === '.png') mimeType = 'image/png';
      else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';

      return `data:${mimeType};base64,${base64Image}`;
    } catch (error) {
      console.error('Error converting photo to base64:', error);
      return null;
    }
  }

  /**
   * Process contacts array to convert photo paths to base64
   */
  private static async processContactsPhotos(contacts: Contact[]): Promise<Contact[]> {
    return Promise.all(
      contacts.map(async (contact) => ({
        ...contact,
        photo: await this.photoToBase64(contact.photo),
      }))
    );
  }

  /**
   * Create a new contact
   */
  static async createContact(userId: number, contactData: CreateContactDto): Promise<Contact> {
    const query = `
      INSERT INTO "contacts" (name, email, phone, photo, user_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, phone, photo, user_id, created_at, updated_at
    `;

    const result = await AppDataSource.query(query, [
      contactData.name,
      contactData.email,
      contactData.phone,
      contactData.photo || null,
      userId,
    ]);

    const processed = await this.processContactsPhotos([result[0]]);
    return processed[0];
  }

  /**
   * Get all contacts for a user
   */
  static async getAllContacts(userId: number): Promise<Contact[]> {
    const query = `
      SELECT id, name, email, phone, photo, user_id, created_at, updated_at
      FROM "contacts"
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;

    const result = await AppDataSource.query(query, [userId]);
    return this.processContactsPhotos(result);
  }

  /**
   * Get all contacts in the system (admin only)
   */
  static async getAllContactsForAdmin(): Promise<Contact[]> {
    const query = `
      SELECT c.id, c.name, c.email, c.phone, c.photo, c.user_id, c.created_at, c.updated_at,
             u.first_name, u.last_name, u.email as owner_email
      FROM "contacts" c
      INNER JOIN "user" u ON c.user_id = u.id
      ORDER BY c.created_at DESC
    `;

    const result = await AppDataSource.query(query);
    return this.processContactsPhotos(result);
  }

  /**
   * Get a single contact by ID
   */
  static async getContactById(contactId: number, userId: number): Promise<Contact | null> {
    const query = `
      SELECT id, name, email, phone, photo, user_id, created_at, updated_at
      FROM "contacts"
      WHERE id = $1 AND user_id = $2
    `;

    const result = await AppDataSource.query(query, [contactId, userId]);
    if (!result[0]) return null;

    const processed = await this.processContactsPhotos([result[0]]);
    return processed[0];
  }

  /**
   * Get a single contact by ID without user restriction (admin view)
   */
  static async getContactByIdForAdmin(contactId: number): Promise<Contact | null> {
    const query = `
      SELECT c.id, c.name, c.email, c.phone, c.photo, c.user_id, c.created_at, c.updated_at,
             u.first_name, u.last_name, u.email as owner_email
      FROM "contacts" c
      INNER JOIN "user" u ON c.user_id = u.id
      WHERE c.id = $1
    `;

    const result = await AppDataSource.query(query, [contactId]);
    if (!result[0]) return null;

    const processed = await this.processContactsPhotos([result[0]]);
    return processed[0];
  }

  /**
   * Update a contact
   */
  static async updateContact(
    contactId: number,
    userId: number,
    updateData: UpdateContactDto
  ): Promise<Contact | null> {
    // Define updatable fields
    const updatableFields = ['name', 'phone', 'photo'] as const;

    // Build dynamic update query using map
    const updates: string[] = [];
    const values: any[] = [];

    updatableFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        updates.push(`${field} = $${values.length + 1}`);
        values.push(updateData[field]);
      }
    });

    if (updates.length === 0) {
      // No updates provided, return existing contact
      return this.getContactById(contactId, userId);
    }

    // Add updated_at timestamp
    updates.push(`updated_at = NOW()`);

    // Add WHERE clause parameters
    const contactIdParam = values.length + 1;
    const userIdParam = values.length + 2;
    values.push(contactId, userId);

    const query = `
      UPDATE "contacts"
      SET ${updates.join(', ')}
      WHERE id = $${contactIdParam} AND user_id = $${userIdParam}
      RETURNING id, name, email, phone, photo, user_id, created_at, updated_at
    `;

    const result = await AppDataSource.query(query, values);
    if (!result[0]) return null;

    const processed = await this.processContactsPhotos([result[0]]);
    return processed[0];
  }

  /**
   * Delete a contact
   */
  static async deleteContact(contactId: number, userId: number): Promise<boolean> {
    const query = `
      DELETE FROM "contacts"
      WHERE id = $1 AND user_id = $2
      RETURNING id
    `;

    const result = await AppDataSource.query(query, [contactId, userId]);
    return result.length > 0;
  }

  /**
   * Check if contact exists and belongs to user
   */
  static async contactExistsForUser(contactId: number, userId: number): Promise<boolean> {
    const query = `
      SELECT COUNT(*) as count
      FROM "contacts"
      WHERE id = $1 AND user_id = $2
    `;

    const result = await AppDataSource.query(query, [contactId, userId]);
    return parseInt(result[0].count) > 0;
  }

  /**
   * Get contacts count for a user
   */
  static async getContactsCount(userId: number): Promise<number> {
    const query = `
      SELECT COUNT(*) as count
      FROM "contacts"
      WHERE user_id = $1
    `;

    const result = await AppDataSource.query(query, [userId]);
    return parseInt(result[0].count);
  }
}
