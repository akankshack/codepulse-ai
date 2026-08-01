/**
 * @file session.repository.ts
 * @description Encapsulates MongoDB access queries for CodingSessions.
 */

import { CodingSession, ICodingSessionDocument } from '../models/session.model';

export class SessionRepository {
  public async findById(id: string): Promise<ICodingSessionDocument | null> {
    return CodingSession.findById(id).populate('userId', 'fullName email');
  }

  public async findAllForUser(userId: string): Promise<ICodingSessionDocument[]> {
    return CodingSession.find({ userId }).sort({ startTime: -1 });
  }

  public async findRecentForUser(userId: string, limit = 10): Promise<ICodingSessionDocument[]> {
    return CodingSession.find({ userId }).sort({ startTime: -1 }).limit(limit);
  }

  public async create(sessionData: Partial<ICodingSessionDocument>): Promise<ICodingSessionDocument> {
    return CodingSession.create(sessionData);
  }

  public async delete(id: string): Promise<boolean> {
    const result = await CodingSession.findByIdAndDelete(id);
    return !!result;
  }
}

export const sessionRepository = new SessionRepository();
export default sessionRepository;
