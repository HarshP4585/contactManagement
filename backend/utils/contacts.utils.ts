import { AppDataSource } from '../db/data-source';
import { Contact } from '../types/entities';
import { CreateContactDto, UpdateContactDto } from '../types/dtos';

export class ContactsUtils {
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

    return result[0];
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
    return result;
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
    return result;
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
    return result[0] || null;
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
    return result[0] || null;
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

    updatableFields.forEach((field, index) => {
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
    return result[0] || null;
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
