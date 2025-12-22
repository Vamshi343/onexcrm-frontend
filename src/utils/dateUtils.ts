/**
 * Date utility functions for MySQL compatibility
 */

/**
 * Convert ISO timestamp to MySQL DATETIME format "YYYY-MM-DD HH:MM:SS"
 * @param input - ISO string, Date object, or timestamp
 * @returns MySQL DATETIME string (19 characters)
 */
export function toMySQLDateTime(input: string | Date | number | null | undefined): string {
  try {
    if (!input) {
      return new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    let d: Date;
    
    if (input instanceof Date) {
      d = input;
    } else if (typeof input === 'number') {
      // Handle both milliseconds and seconds timestamps
      d = input > 1e12 ? new Date(input) : new Date(input * 1000);
    } else {
      // Parse ISO string
      d = new Date(String(input));
    }

    if (isNaN(d.getTime())) {
      return new Date().toISOString().slice(0, 19).replace('T', ' ');
    }
    
    const pad = (n: number) => String(n).padStart(2, '0');
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    const ss = pad(d.getSeconds());
    
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
  } catch (err) {
    console.error('toMySQLDateTime error:', err);
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
  }
}

/**
 * Convert MySQL DATETIME to ISO string
 * @param mysqlDate - MySQL DATETIME string
 * @returns ISO timestamp string
 */
export function fromMySQLDateTime(mysqlDate: string | null | undefined): string {
  if (!mysqlDate) return new Date().toISOString();
  
  try {
    // MySQL format: "YYYY-MM-DD HH:MM:SS"
    const d = new Date(String(mysqlDate).replace(' ', 'T') + 'Z');
    return d.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

/**
 * Format date for display (human-readable)
 * @param date - Any date input
 * @returns Formatted string like "Dec 1, 2025"
 */
export function formatDateForDisplay(date: string | Date | number | null | undefined): string {
  if (!date) return '';
  
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch {
    return '';
  }
}