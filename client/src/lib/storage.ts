// Local storage management for the coding education platform
export class LocalStorage {
  private static prefix = 'codelearn_';

  static save<T>(key: string, data: T): void {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  static load<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(this.prefix + key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return null;
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }

  static clear(): void {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
}

// Specific storage keys
export const STORAGE_KEYS = {
  USER: 'user',
  COURSES: 'courses',
  ENROLLMENTS: 'enrollments',
  PROGRESS: 'progress',
  REMINDERS: 'reminders',
  SETTINGS: 'settings',
} as const;
