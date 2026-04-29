/// <reference types="office-js" />
import type { AnalysisData } from '../types/analysis';

const BACKEND_URL = 'http://127.0.0.1:8000/api/analyze';

/**
 * Convert Office.js attachment → File
 */
async function getFileFromOfficeJS(
  attachmentId: string
): Promise<File> {

  const item = Office?.context?.mailbox?.item;

  if (!item?.getAttachmentContentAsync) {
    console.error("OFFICE CONTEXT:", {
      office: !!Office,
      mailbox: !!Office?.context?.mailbox,
      item: !!Office?.context?.mailbox?.item
    });

    throw new Error(
      "Not running inside a valid Outlook add-in context (Office.context.mailbox.item is missing)"
    );
  }

  return new Promise((resolve, reject) => {
    item.getAttachmentContentAsync(
      attachmentId,
      { asyncContext: null },
      (result: any) => {

        if (result.status !== Office.AsyncResultStatus.Succeeded) {
          console.error("Attachment fetch failed:", result.error);
          return reject(new Error("Attachment extraction failed"));
        }

        const content = result.value;

        console.log("ATTACHMENT RAW:", content);

        try {
          if (
            content.format ===
            Office.MailboxEnums.AttachmentContentFormat.Base64
          ) {
            const base64 = content.content;

            const byteString = atob(base64);
            const bytes = new Uint8Array(byteString.length);

            for (let i = 0; i < byteString.length; i++) {
              bytes[i] = byteString.charCodeAt(i);
            }

            const blob = new Blob([bytes], {
              type: content.contentType || "application/octet-stream"
            });

            const filename = content.name || "attachment.bin";
            const file = new File([blob], filename);

            return resolve(file);
          }

          reject(
            new Error(`Unsupported attachment format: ${content.format}`)
          );

        } catch (err) {
          reject(new Error("Failed to decode attachment content"));
        }
      }
    );
  });
}

/**
 * Send file to backend
 */
async function fetchAnalysisFromBackend(file: File) {
  console.log("Sending file:", file.name);

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(BACKEND_URL, {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ Backend error:", text);
    throw new Error(`Backend failed: ${res.status}`);
  }

  const data = await res.json();

  console.log("Backend response:", data);

  return data;
}

/**
 * MAIN ANALYSIS FUNCTION (STRICT)
 */
export async function analyzeAttachment(
  attachmentId: string,
  filename: string
): Promise<AnalysisData> {

  try {
    // 1. Extract file
    const file = await getFileFromOfficeJS(attachmentId);

    console.log("File extracted:", file);

    if (!file) {
      throw new Error("File extraction returned null");
    }

    // 2. Send to backend
    const backendResult = await fetchAnalysisFromBackend(file);

    if (!backendResult) {
      throw new Error("Invalid backend response");
    }

    // 3. Map result
    return {
      filename: backendResult.filename || file.name,
      hash: backendResult.hash,
      fileType: backendResult.fileType,
      size: backendResult.size,
      entropy: backendResult.entropy,
      compiledTime: backendResult.compiledTime,
      sections: backendResult.sections,
      imports: backendResult.imports,
      exports: backendResult.exports,
      threatLevel: backendResult.threatLevel,
      suspicious: backendResult.suspicious
    };

  } catch (err) {
    console.error("🔥 ANALYSIS FAILED:", err);
    throw err;
  }
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
 * Validate attachment
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