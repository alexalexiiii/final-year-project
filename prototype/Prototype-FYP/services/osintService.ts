import type { FileHash, OSINTData } from '../types/analysis';

interface OSINTRequest {
  hash: FileHash;
  strings: string[];
  sender?: string;
  emailBody?: string;
  emailHeaders?: string;
}

export async function performOSINTAnalysis(
  fileHash: FileHash,
  extractedStrings: string[],
  sender?: string,
  emailBody?: string,
  emailHeaders?: string
): Promise<OSINTData> {

  const payload: OSINTRequest = {
    hash: fileHash,
    strings: extractedStrings,
    sender,
    emailBody,
    emailHeaders
  };

  const res = await fetch('http://127.0.0.1:8000/api/osint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`OSINT backend request failed: ${errorText}`);
  }

  return await res.json();
}