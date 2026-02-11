/**
 * Utility functions for formatting and data manipulation
 * Used across the AnalysIT Attachment Analyser application
 */

/**
 * Format bytes to human-readable size
 * @param bytes - Number of bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string (e.g., "2.35 MB")
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Format timestamp to readable date string
 * @param timestamp - ISO timestamp or Date object
 * @returns Formatted date string
 */
export function formatDate(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Sanitize filename for safe download
 * Removes special characters and spaces
 * @param filename - Original filename
 * @returns Sanitized filename
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase()
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Truncate string with ellipsis
 * @param str - String to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated string
 */
export function truncate(str: string, maxLength: number = 50): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
}

/**
 * Copy text to clipboard
 * @param text - Text to copy
 * @returns Promise that resolves when copied
 */
export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
}

/**
 * Get file extension from filename
 * @param filename - Filename with extension
 * @returns File extension (lowercase, without dot)
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

/**
 * Check if file extension is executable
 * @param filename - Filename to check
 * @returns True if executable extension
 */
export function isExecutable(filename: string): boolean {
  const executableExtensions = [
    'exe', 'dll', 'scr', 'bat', 'cmd', 'com', 
    'pif', 'vbs', 'js', 'jar', 'msi', 'ps1'
  ];
  
  const ext = getFileExtension(filename);
  return executableExtensions.includes(ext);
}

/**
 * Check if file extension has macro support
 * @param filename - Filename to check
 * @returns True if macro-enabled document
 */
export function isMacroEnabled(filename: string): boolean {
  const macroExtensions = [
    'docm', 'dotm', 'xlsm', 'xltm', 'xlam',
    'pptm', 'potm', 'ppam', 'ppsm'
  ];
  
  const ext = getFileExtension(filename);
  return macroExtensions.includes(ext);
}

/**
 * Calculate entropy of a string (simplified)
 * Used for detecting packed/encrypted content
 * @param str - String to analyze
 * @returns Entropy value (0-8)
 */
export function calculateEntropy(str: string): number {
  const len = str.length;
  const frequencies: { [key: string]: number } = {};
  
  // Count character frequencies
  for (let i = 0; i < len; i++) {
    const char = str[i];
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  
  // Calculate entropy
  let entropy = 0;
  for (const char in frequencies) {
    const freq = frequencies[char] / len;
    entropy -= freq * Math.log2(freq);
  }
  
  return entropy;
}

/**
 * Highlight search term in text
 * @param text - Text to search in
 * @param searchTerm - Term to highlight
 * @returns Text with <mark> tags around matches
 */
export function highlightText(text: string, searchTerm: string): string {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Escape special regex characters in string
 * @param str - String to escape
 * @returns Escaped string safe for regex
 */
export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Debounce function calls
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Group array items by key
 * @param array - Array to group
 * @param key - Key to group by
 * @returns Grouped object
 */
export function groupBy<T>(
  array: T[],
  key: keyof T
): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Sort array by multiple keys
 * @param array - Array to sort
 * @param keys - Keys to sort by (with optional direction)
 * @returns Sorted array
 */
export function sortBy<T>(
  array: T[],
  ...keys: Array<keyof T | { key: keyof T; desc?: boolean }>
): T[] {
  return [...array].sort((a, b) => {
    for (const keyConfig of keys) {
      const key = typeof keyConfig === 'object' ? keyConfig.key : keyConfig;
      const desc = typeof keyConfig === 'object' ? keyConfig.desc : false;
      
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal < bVal) return desc ? 1 : -1;
      if (aVal > bVal) return desc ? -1 : 1;
    }
    return 0;
  });
}
