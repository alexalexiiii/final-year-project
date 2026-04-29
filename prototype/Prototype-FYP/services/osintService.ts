import type { FileHash } from '../types/analysis';
import type { OSINTData } from '../types/analysis';

export async function performOSINTAnalysis(
  fileHash: FileHash,
  extractedStrings: string[]
): Promise<OSINTData> {

  const res = await fetch('http://127.0.0.1:8000/api/osint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      hash: fileHash,
      strings: extractedStrings,
    }),
  });

  if (!res.ok) {
    throw new Error('OSINT backend request failed');
  }

  return await res.json();
}