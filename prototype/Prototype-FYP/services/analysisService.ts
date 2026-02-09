// Service layer for FLARE analysis API calls
// This prepares the structure for backend integration

import type { AnalysisData, FileHash } from '../types/analysis';

/**
 * Generate mock file hashes
 * In production, this would be calculated server-side from actual file data
 */
function generateMockHash(filename: string): FileHash {
  // Simple deterministic hash generation for demo purposes
  const seed = filename.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  return {
    md5: `${seed.toString(16).padStart(32, '0').slice(0, 32)}`,
    sha1: `${seed.toString(16).padStart(40, '0').slice(0, 40)}`,
    sha256: `${seed.toString(16).padStart(64, '0').slice(0, 64)}`
  };
}

/**
 * Determine threat level based on file extension and characteristics
 */
function determineThreatLevel(filename: string): AnalysisData['threatLevel'] {
  const ext = filename.toLowerCase().split('.').pop() || '';
  
  const highRiskExtensions = ['exe', 'dll', 'scr', 'bat', 'cmd', 'vbs', 'js', 'jar'];
  const mediumRiskExtensions = ['docm', 'xlsm', 'pptm', 'dotm', 'xltm'];
  const lowRiskExtensions = ['pdf', 'txt', 'jpg', 'png'];
  
  if (highRiskExtensions.includes(ext)) return 'high';
  if (mediumRiskExtensions.includes(ext)) return 'medium';
  if (lowRiskExtensions.includes(ext)) return 'low';
  
  return 'medium';
}

/**
 * Get file type description based on extension
 */
function getFileTypeDescription(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop() || '';
  
  const typeMap: Record<string, string> = {
    'exe': 'PE32 executable (GUI) Intel 80386, for MS Windows',
    'dll': 'PE32 dynamic link library (DLL) Intel 80386, for MS Windows',
    'docm': 'Microsoft Word Document with Macros',
    'xlsm': 'Microsoft Excel Spreadsheet with Macros',
    'pdf': 'PDF document',
    'zip': 'ZIP archive data',
    'rar': 'RAR archive data',
  };
  
  return typeMap[ext] || `${ext.toUpperCase()} file`;
}

/**
 * Analyze attachment using FLARE tools
 * 
 * In production, this would:
 * 1. Get attachment content using Office.js getAttachmentContentAsync()
 * 2. Send to backend API endpoint (e.g., POST /api/analyze)
 * 3. Backend runs FLARE tools (FLOSS, CAPA, PE analysis)
 * 4. Return comprehensive analysis results
 * 
 * @param attachmentId - Office.js attachment ID
 * @param filename - Name of the attachment
 * @param mailboxItem - Office mailbox item for accessing attachment content
 * @returns Promise with analysis results
 */
export async function analyzeAttachment(
  attachmentId: string,
  filename: string,
  mailboxItem?: any
): Promise<AnalysisData> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
 
  
  // Mock data for demonstration
  const threatLevel = determineThreatLevel(filename);
  const suspicious = threatLevel === 'high' || threatLevel === 'critical';
  
  return {
    filename,
    hash: generateMockHash(filename),
    fileType: getFileTypeDescription(filename),
    size: '2,359,296 bytes',
    entropy: suspicious ? '7.2' : '4.5',
    compiledTime: new Date().toISOString().split('T')[0] + ' 14:23:11 UTC',
    sections: 5,
    imports: suspicious ? 23 : 8,
    exports: 0,
    threatLevel,
    suspicious
  };
}

/**
 * Export analysis results to various formats
 * This could be extended to support JSON, PDF, etc.
 */
export function generateAnalysisReport(
  analysisData: AnalysisData,
  format: 'csv' | 'json' = 'csv'
): string {
  if (format === 'json') {
    return JSON.stringify(analysisData, null, 2);
  }
  
  // CSV format handled by ExportButton component
  return '';
}

/**
 * Check if file is safe to analyze
 * Validates file size and type before analysis
 */
export function validateAttachment(
  filename: string,
  size: number
): { valid: boolean; error?: string } {
  const maxSize = 50 * 1024 * 1024; // 50MB limit
  
  if (size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum limit of ${maxSize / 1024 / 1024}MB`
    };
  }
  
  return { valid: true };
}
