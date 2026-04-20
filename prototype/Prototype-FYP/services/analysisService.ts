import type { AnalysisData } from '../types/analysis';

/**
 * BACKEND URL (IMPORTANT: change for production)
 */
const BACKEND_URL = 'http://127.0.0.1:8000/api/analyze';

/**
 * Determine threat level based on file extension
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
 * File type label
 */
function getFileTypeDescription(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop() || '';

  const typeMap: Record<string, string> = {
    exe: 'PE32 executable (Windows)',
    dll: 'PE32 dynamic link library (DLL)',
    docm: 'Microsoft Word Document with Macros',
    xlsm: 'Microsoft Excel Spreadsheet with Macros',
    pdf: 'PDF document',
    zip: 'ZIP archive',
    rar: 'RAR archive'
  };

  return typeMap[ext] || `${ext.toUpperCase()} file`;
}

/**
 * Format bytes safely
 */
function formatBytes(bytes?: number | null): string {
  if (!bytes || bytes <= 0) return 'Unknown';

  const k = 1024;
  const sizes = ['bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Convert Office.js attachment → File
 */
async function getFileFromOfficeJS(
  attachmentId: string,
  mailboxItem?: any
): Promise<File | null> {
  try {
    if (!mailboxItem?.getAttachmentContentAsync) return null;

    return new Promise((resolve) => {
      mailboxItem.getAttachmentContentAsync(attachmentId, (result: any) => {
        try {
          if (result.status !== 'succeeded') return resolve(null);

          const content = result.value;

          const base64 = content.content || '';
          const byteString = atob(base64);

          const bytes = new Uint8Array(byteString.length);
          for (let i = 0; i < byteString.length; i++) {
            bytes[i] = byteString.charCodeAt(i);
          }

          const blob = new Blob([bytes], {
            type: content.contentType || 'application/octet-stream'
          });

          const file = new File([blob], content.name || 'file.bin');

          resolve(file);
        } catch {
          resolve(null);
        }
      });
    });
  } catch {
    return null;
  }
}

/**
 * BACKEND CALL (FIXED)
 */
async function fetchAnalysisFromBackend(file: File) {
  console.log("FILE SENT:", file.name);

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch('http://127.0.0.1:8000/api/analyze', {
    method: 'POST',
    body: formData
  });

  console.log("STATUS:", res.status);

  const data = await res.json();
  console.log("RESPONSE:", data);

  return data;
}

/**
 * MAIN ANALYSIS FUNCTION
 */
export async function analyzeAttachment(
  attachmentId: string,
  filename: string,
  mailboxItem?: any
): Promise<AnalysisData> {

  // 1. Extract file from Outlook
  const file = await getFileFromOfficeJS(attachmentId, mailboxItem);

  // 2. Try backend analysis
  if (file) {
    const backendResult = await fetchAnalysisFromBackend(file);

    if (backendResult) {
      return {
        filename,
        hash: backendResult.hash ?? {
          md5: 'Not available',
          sha1: 'Not available',
          sha256: 'Not available'
        },
        fileType: backendResult.fileType ?? getFileTypeDescription(filename),
        size: backendResult.size ?? formatBytes(file.size),
        entropy: backendResult.entropy ?? 'N/A',
        compiledTime: backendResult.compiledTime ?? 'N/A',
        sections: backendResult.sections ?? 0,
        imports: backendResult.imports ?? 0,
        exports: backendResult.exports ?? 0,
        threatLevel: backendResult.threatLevel ?? determineThreatLevel(filename),
        suspicious: backendResult.suspicious ?? false
      };
    }
  }

  // 3. Fallback (safe mode)
  const threatLevel = determineThreatLevel(filename);

  return {
    filename,

    hash: {
      md5: 'Not available',
      sha1: 'Not available',
      sha256: 'Not available'
    },

    fileType: getFileTypeDescription(filename),

    size: 'Unknown',

    entropy: 'Not available',
    compiledTime: 'Not available',
    sections: 0,
    imports: 0,
    exports: 0,

    threatLevel,
    suspicious: threatLevel === 'high'
  };
}

/**
 * Export report
 */
export function generateAnalysisReport(
  analysisData: AnalysisData,
  format: 'csv' | 'json' = 'csv'
): string {
  if (format === 'json') {
    return JSON.stringify(analysisData, null, 2);
  }
  return '';
}

/**
 * Validate attachment safely
 */
export function validateAttachment(filename: string, size: number) {
  const maxSize = 50 * 1024 * 1024;

  if (size > maxSize) {
    return {
      valid: false,
      error: 'File too large (max 50MB)'
    };
  }

  return { valid: true };
}