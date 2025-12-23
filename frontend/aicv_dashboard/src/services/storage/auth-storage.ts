import storage from 'redux-persist/lib/storage';
import type { Roles } from 'src/models/common/models.enum';
import type { IUser } from 'src/models/user';

// Storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  ROLE: 'role',
  USER: 'user',
} as const;

/**
 * Authentication Storage Service
 * Handles all authentication-related storage operations
 */
class AuthStorage {
  /**
   * Get expiry epoch
   */
  getExpiryEpoch(seconds: number): number {
    const t = new Date();
    t.setSeconds(t.getSeconds() + seconds);
    return t.getSeconds();
  }

  /**
   * Store access token
   */
  async storeToken(token: string): Promise<void> {
    await storage.setItem(STORAGE_KEYS.TOKEN, token);
  }

  /**
   * Store user role
   */
  async storeRole(role: Roles): Promise<void> {
    await storage.setItem(STORAGE_KEYS.ROLE, role);
  }

  /**
   * Get access token
   */
  async getAccessToken(): Promise<string | null> {
    return await storage.getItem(STORAGE_KEYS.TOKEN);
  }

  /**
   * Check if has valid token
   */
  async hasValidToken(): Promise<boolean> {
    const token = await storage.getItem(STORAGE_KEYS.TOKEN);
    return Boolean(token);
  }

  /**
   * Store user data
   */
  async storeUser(user: IUser): Promise<void> {
    await storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  /**
   * Get user data
   */
  async getUser(): Promise<IUser | null> {
    const user = await storage.getItem(STORAGE_KEYS.USER);
    if (!user) {
      return null;
    }
    return JSON.parse(user) as IUser;
  }

  /**
   * Clear all auth data
   */
  async clear(): Promise<void> {
    await storage.removeItem(STORAGE_KEYS.TOKEN);
    await storage.removeItem(STORAGE_KEYS.USER);
    await storage.removeItem(STORAGE_KEYS.ROLE);
  }
}

// Singleton instance
export const authStorage = new AuthStorage();
