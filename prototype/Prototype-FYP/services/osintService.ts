// OSINT Service for threat intelligence gathering
// Integrates with VirusTotal, AbuseIPDB, URLScan, and IPInfo APIs

import type {
  OSINTData,
  VirusTotalResult,
  AbuseIPDBResult,
  URLScanResult,
  IPInfoResult,
  FileHash
} from '../types/analysis';

const OSINT_CONFIG = {
  virustotal: {
    apiKey: '2e5068417b79587ef467cc3748e1f9bdfa806c2e64519b023449aa61e46bc831',
    baseUrl: 'https://www.virustotal.com/api/v3'
  },
  abuseipdb: {
    apiKey: '58662332452ca0fe493a07aba7edc6aefc1c23d4421dfc0f69104cf7338bfcbb11ad256af5df9c6a',
    baseUrl: 'https://api.abuseipdb.com/api/v2'
  },
  urlscan: {
    apiKey: '019c6883-d9c8-718a-b158-0624c8a5233a',
    baseUrl: 'https://urlscan.io/api/v1'
  },
  ipinfo: {
    token: '3ca377f3222d1e',
    baseUrl: 'https://ipinfo.io'
  }
};

function extractIOCs(strings: string[]): OSINTData['extractedIOCs'] {

  const ipRegex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
  const urlRegex = /https?:\/\/[^\s]+/g;
  const domainRegex = /\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}\b/gi;
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

  const allText = strings.join(' ');

  return {
    ips: Array.from(new Set(allText.match(ipRegex) || [])),
    urls: Array.from(new Set(allText.match(urlRegex) || [])),
    domains: Array.from(new Set(allText.match(domainRegex) || [])),
    emails: Array.from(new Set(allText.match(emailRegex) || []))
  };
}

export async function queryVirusTotal(fileHash: FileHash): Promise<VirusTotalResult | null> {

  if (!OSINT_CONFIG.virustotal.apiKey) return null;

  try {

    const response = await fetch(
      `${OSINT_CONFIG.virustotal.baseUrl}/files/${fileHash.sha256}`,
      {
        headers: {
          'x-apikey': OSINT_CONFIG.virustotal.apiKey
        }
      }
    );

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`VirusTotal API error ${response.status}`);
    }

    const data = await response.json();
    const stats = data.data.attributes.last_analysis_stats;

    return {
      positives: stats.malicious,
      total: Object.values(stats).reduce((a: number, b: any) => a + b, 0),
      scanDate: data.data.attributes.last_analysis_date,
      permalink: `https://www.virustotal.com/gui/file/${fileHash.sha256}`,
      detections: Object.entries(data.data.attributes.last_analysis_results).map(
        ([vendor, result]: [string, any]) => ({
          vendor,
          detected: result.category === 'malicious',
          result: result.result
        })
      )
    };

  } catch (error) {
    console.error("VirusTotal error:", error);
    return null;
  }
}

export async function queryAbuseIPDB(ipAddresses: string[]): Promise<AbuseIPDBResult[]> {

  const results: AbuseIPDBResult[] = [];

  if (!ipAddresses.length) return results;

  for (const ip of ipAddresses) {

    try {

      const response = await fetch(
        `${OSINT_CONFIG.abuseipdb.baseUrl}/check?ipAddress=${ip}&maxAgeInDays=90`,
        {
          headers: {
            'Key': OSINT_CONFIG.abuseipdb.apiKey,
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) continue;

      const data = await response.json();

      results.push({
        ipAddress: ip,
        abuseConfidenceScore: data.data.abuseConfidenceScore,
        usageType: data.data.usageType,
        isp: data.data.isp,
        domain: data.data.domain,
        countryCode: data.data.countryCode,
        isWhitelisted: data.data.isWhitelisted,
        totalReports: data.data.totalReports,
        lastReportedAt: data.data.lastReportedAt
      });

    } catch (error) {
      console.error(`AbuseIPDB error for ${ip}`, error);
    }
  }

  return results;
}

export async function queryURLScan(urls: string[]): Promise<URLScanResult[]> {

  const results: URLScanResult[] = [];

  if (!urls.length) return results;

  for (const url of urls) {

    try {

      const submitResponse = await fetch(
        `${OSINT_CONFIG.urlscan.baseUrl}/scan/`,
        {
          method: 'POST',
          headers: {
            'API-Key': OSINT_CONFIG.urlscan.apiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ url, visibility: 'public' })
        }
      );

      if (!submitResponse.ok) continue;

      const submitData = await submitResponse.json();
      const uuid = submitData.uuid;

      await new Promise(resolve => setTimeout(resolve, 15000));

      const resultResponse = await fetch(
        `${OSINT_CONFIG.urlscan.baseUrl}/result/${uuid}/`
      );

      if (!resultResponse.ok) continue;

      const resultData = await resultResponse.json();

      results.push({
        uuid,
        url,
        visibility: resultData.visibility,
        verdict: {
          score: resultData.verdicts.overall.score,
          malicious: resultData.verdicts.overall.malicious,
          categories: resultData.verdicts.overall.categories
        },
        submitter: {
          country: resultData.submitter.country
        },
        page: {
          domain: resultData.page.domain,
          ip: resultData.page.ip,
          asn: resultData.page.asn,
          asnname: resultData.page.asnname
        },
        stats: {
          maliciousRequests: resultData.stats.malicious,
          totalRequests: resultData.stats.totalRequests
        }
      });

    } catch (error) {
      console.error(`URLScan error for ${url}`, error);
    }
  }

  return results;
}

export async function queryIPInfo(ipAddresses: string[]): Promise<IPInfoResult[]> {

  const results: IPInfoResult[] = [];

  if (!ipAddresses.length) return results;

  for (const ip of ipAddresses) {

    try {

      const response = await fetch(
        `${OSINT_CONFIG.ipinfo.baseUrl}/${ip}?token=${OSINT_CONFIG.ipinfo.token}`
      );

      if (!response.ok) continue;

      const data = await response.json();

      results.push(data);

    } catch (error) {
      console.error(`IPInfo error for ${ip}`, error);
    }
  }

  return results;
}

export async function performOSINTAnalysis(
  fileHash: FileHash,
  extractedStrings: string[]
): Promise<OSINTData> {

  const iocs = extractIOCs(extractedStrings);

  const [virustotal, abuseipdb, urlscan, ipinfo] = await Promise.all([
    queryVirusTotal(fileHash),
    queryAbuseIPDB(iocs.ips),
    queryURLScan(iocs.urls),
    queryIPInfo(iocs.ips)
  ]);

  return {
    virustotal,
    abuseipdb,
    urlscan,
    ipinfo,
    extractedIOCs: iocs,
    lastUpdated: new Date().toISOString()
  };
}

export function getOSINTStatus() {

  return {
    virustotal: !!OSINT_CONFIG.virustotal.apiKey,
    abuseipdb: !!OSINT_CONFIG.abuseipdb.apiKey,
    urlscan: !!OSINT_CONFIG.urlscan.apiKey,
    ipinfo: !!OSINT_CONFIG.ipinfo.token
  };
}