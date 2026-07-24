/**
 * @file user.repository.ts
 * @description Encapsulates all direct database access queries for the User model.
 * 
 * PURPOSE:
 * Implements the Repository pattern. By abstracting raw Mongoose queries (`findOne`, `create`, `findById`)
 * away from the Service layer, we make the business logic easier to unit test.
 * 
 * ROLE IN REQUEST FLOW:
 * Invoked by `AuthService` to fetch or create user records in MongoDB.
 */

import { User, IUserDocument } from '../models/user.model';

export class UserRepository {
  /**
   * Finds a user record in the database by email address.
   * @param email Email to search for (case-insensitive search)
   */
  public async findByEmail(email: string): Promise<IUserDocument | null> {
    return User.findOne({ email: email.toLowerCase().trim() });
  }

  /**
   * Finds a user record in the database by their unique ID.
   * @param id MongoDB ObjectId string
   */
  public async findById(id: string): Promise<IUserDocument | null> {
    return User.findById(id);
  }

  /**
   * Creates and saves a new user record in the database.
   * @param userData Core user fields containing name, email, role, and hashed password
   */
  public async create(userData: {
    fullName: string;
    email: string;
    passwordHash: string;
    role: 'DEVELOPER' | 'LEAD' | 'ADMIN';
    avatar?: string;
  }): Promise<IUserDocument> {
    return User.create({
      fullName: userData.fullName,
      email: userData.email.toLowerCase().trim(),
      passwordHash: userData.passwordHash,
      role: userData.role,
      avatar: userData.avatar || '',
    });
  }
}

export const userRepository = new UserRepository();
export default userRepository;
