/// <reference types="office-js" />
import type { AnalysisData } from '../types/analysis';

const BACKEND_URL = 'http://127.0.0.1:8000/api/analyze';

async function getFileFromOfficeJS(attachmentId: string): Promise<File> {
  const item = Office?.context?.mailbox?.item;

  if (!item?.getAttachmentContentAsync) {
    throw new Error("Invalid Outlook add-in context");
  }

  return new Promise((resolve, reject) => {
    item.getAttachmentContentAsync(
      attachmentId,
      {},
      (result: any) => {
        if (result.status !== Office.AsyncResultStatus.Succeeded) {
          return reject(new Error("Attachment extraction failed"));
        }

        const content = result.value;

        try {
          if (
            content.format === Office.MailboxEnums.AttachmentContentFormat.Base64
          ) {
            const byteString = atob(content.content);
            const bytes = new Uint8Array(byteString.length);

            for (let i = 0; i < byteString.length; i++) {
              bytes[i] = byteString.charCodeAt(i);
            }

            const blob = new Blob([bytes], {
              type: content.contentType || "application/octet-stream"
            });

            return resolve(new File([blob], content.name || "attachment.bin"));
          }

          reject(new Error(`Unsupported format: ${content.format}`));
        } catch {
          reject(new Error("Failed decoding attachment"));
        }
      }
    );
  });
}

async function fetchAnalysisFromBackend(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(BACKEND_URL, {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
}

export async function analyzeAttachment(
  attachmentId: string
): Promise<AnalysisData> {
  try {
    const file = await getFileFromOfficeJS(attachmentId);
    const backendResult = await fetchAnalysisFromBackend(file);

    // 🔥 DEBUG — YOU NEED THIS RIGHT NOW
    console.log("BACKEND RESULT:", backendResult);

    // -----------------------------
    // PDF DATA (robust mapping)
    // -----------------------------
    const pdfFeatures =
      backendResult?.pdf_features ??
      backendResult?.pdfFeatures ??
      {};

    const pdfFlags =
      backendResult?.pdfid_flags ??
      backendResult?.pdfid?.flags ??
      backendResult?.pdfid?.data ??
      {};

    // -----------------------------
    // IOC DATA (robust mapping)
    // -----------------------------
    const iocsRaw =
  backendResult?.iocs ??
  backendResult?.extractedIOCs ??
  {};

const iocs = {
  ips: iocsRaw.ips ?? [],
  urls: iocsRaw.urls ?? [],
  domains: iocsRaw.domains ?? [],
  emails: iocsRaw.emails ?? []
};

    // -----------------------------
    // SUSPICIOUS DATA (FIXED TYPE)
    // -----------------------------
    const suspicious = {
      pdf_features: pdfFeatures ?? {},
      pdfid_flags: pdfFlags ?? {}
    };

    return {
      filename: backendResult?.filename ?? file.name,

      hash: backendResult?.hash ?? {
        md5: "",
        sha1: "",
        sha256: ""
      },

      fileType: backendResult?.fileType ?? file.type,
      size: backendResult?.size ?? file.size,

      entropy: backendResult?.entropy ?? 0,
      compiledTime: backendResult?.compiledTime ?? undefined,

      sections: backendResult?.sections ?? 0,
      imports: backendResult?.imports ?? 0,
      exports: backendResult?.exports ?? 0,

      threatLevel: backendResult?.threatLevel ?? "low",

      // ✅ FIXED (no longer boolean)
      suspicious,

      // ✅ PASS RAW PDFID FOR UI IF NEEDED
      pdfid: {
        headers: undefined,
        sections: undefined
      },

      iocs: {
        ips: iocs.ips ?? [],
        urls: iocs.urls ?? [],
        domains: iocs.domains ?? [],
        emails: iocs.emails ?? []
      }
    };

  } catch (err) {
    console.error("Analysis failed:", err);
    throw err;
  }
}

export function generateAnalysisReport(
  analysisData: AnalysisData,
  format: 'csv' | 'json' = 'json'
): string {
  if (format === 'json') {
    return JSON.stringify(analysisData, null, 2);
  }

  return [
    `filename,${analysisData.filename}`,
    `threatLevel,${analysisData.threatLevel}`
  ].join("\n");
}

export function validateAttachment(filename: string, size: number) {
  const maxSize = 50 * 1024 * 1024;

  if (size > maxSize) {
    return { valid: false, error: 'File too large (max 50MB)' };
  }

  return { valid: true };
}