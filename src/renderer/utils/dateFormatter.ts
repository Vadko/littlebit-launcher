/**
 * Format date string to Ukrainian locale
 * @param dateString - ISO date string or any valid date format
 * @param format - 'short' (15.01.2024) or 'long' (15 січня 2024)
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string,
  format: 'short' | 'long' = 'long'
): string {
  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString; // Return original if invalid
    }

    if (format === 'short') {
      // Format as "15.01.2024"
      return date.toLocaleDateString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } else {
      // Format as "15 січня 2024"
      return date.toLocaleDateString('uk-UA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
  } catch {
    return dateString; // Return original on error
  }
}

/**
 * Format date to relative time (e.g., "2 дні тому", "1 місяць тому")
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Сьогодні';
    if (diffDays === 1) return 'Вчора';
    if (diffDays < 7) return `${diffDays} дн. тому`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} тиж. тому`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} міс. тому`;

    return `${Math.floor(diffDays / 365)} р. тому`;
  } catch {
    return dateString;
  }
}
