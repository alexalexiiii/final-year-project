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

// API Configuration
// TODO: Store these securely (environment variables or secure vault)
const OSINT_CONFIG = {
  virustotal: {
    apiKey: ' _VIRUSTOTAL_API_KEY',
    baseUrl: 'https://www.virustotal.com/api/v3'
  },
  abuseipdb: {
    apiKey: ' _ABUSEIPDB_API_KEY',
    baseUrl: 'https://api.abuseipdb.com/api/v2'
  },
  urlscan: {
    apiKey: ' _URLSCAN_API_KEY',
    baseUrl: 'https://urlscan.io/api/v1'
  },
  ipinfo: {
    token: ' _IPINFO_TOKEN',
    baseUrl: 'https://ipinfo.io'
  }
};

/**
 * Extract Indicators of Compromise (IOCs) from strings analysis
 * Parses for IPs, URLs, domains, and emails
 */
function extractIOCs(strings: string[]): OSINTData['extractedIOCs'] {
  const ipRegex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
  const urlRegex = /https?:\/\/[^\s]+/g;
  const domainRegex = /\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}\b/gi;
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

  const allText = strings.join(' ');

  return {
    ips: Array.from(new Set(allText.match(ipRegex) || [])),
    urls: Array.from(new Set(allText.match(urlRegex) || [])),
    domains: Array.from(new Set(allText.match(domainRegex) || [])),
    emails: Array.from(new Set(allText.match(emailRegex) || []))
  };
}

/**
 * Query VirusTotal for file hash reputation
 * Checks if the file hash is known malicious
 */
export async function queryVirusTotal(fileHash: FileHash): Promise<VirusTotalResult | null> {
  // In production mode with real API key:
  /*
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
      if (response.status === 404) {
        return null; // File not found in VT database
      }
      throw new Error(`VirusTotal API error: ${response.status}`);
    }

    const data = await response.json();
    const stats = data.data.attributes.last_analysis_stats;
    
    return {
      positives: stats.malicious,
      total: Object.values(stats).reduce((a: any, b: any) => a + b, 0),
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
    console.error('VirusTotal query failed:', error);
    return null;
  }
  */

  // Mock data for development
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    positives: 45,
    total: 73,
    scanDate: new Date().toISOString(),
    permalink: `https://www.virustotal.com/gui/file/${fileHash.sha256}`,
    detections: [
      { vendor: 'Kaspersky', detected: true, result: 'Trojan.Win32.Generic' },
      { vendor: 'Microsoft', detected: true, result: 'Trojan:Win32/Wacatac.B!ml' },
      { vendor: 'BitDefender', detected: true, result: 'Gen:Variant.Razy.915107' },
      { vendor: 'Avast', detected: true, result: 'Win32:Malware-gen' },
      { vendor: 'ESET-NOD32', detected: true, result: 'Win32/GenKryptik.FQGN' },
      { vendor: 'Sophos', detected: false, result: null },
      { vendor: 'McAfee', detected: true, result: 'Artemis!E8D5F2C3A1B4' }
    ]
  };
}

/**
 * Query AbuseIPDB for IP reputation
 * Checks if extracted IPs are reported for malicious activity
 */
export async function queryAbuseIPDB(ipAddresses: string[]): Promise<AbuseIPDBResult[]> {
  // In production mode with real API key:
  /*
  const results: AbuseIPDBResult[] = [];

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

      if (!response.ok) {
        console.error(`AbuseIPDB query failed for ${ip}`);
        continue;
      }

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
      console.error(`AbuseIPDB query error for ${ip}:`, error);
    }
  }

  return results;
  */

  // Mock data for development
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return ipAddresses.slice(0, 3).map((ip, idx) => ({
    ipAddress: ip,
    abuseConfidenceScore: idx === 0 ? 85 : idx === 1 ? 12 : 0,
    usageType: idx === 0 ? 'Data Center/Web Hosting/Transit' : 'Fixed Line ISP',
    isp: idx === 0 ? 'Cloudflarenet' : 'Comcast Cable Communications',
    domain: idx === 0 ? 'cloudflare.com' : 'comcast.net',
    countryCode: 'US',
    isWhitelisted: idx !== 0,
    totalReports: idx === 0 ? 342 : idx === 1 ? 5 : 0,
    lastReportedAt: idx === 0 ? new Date().toISOString() : null
  }));
}

/**
 * Query URLScan.io for URL analysis
 * Submits URLs for scanning and retrieves results
 */
export async function queryURLScan(urls: string[]): Promise<URLScanResult[]> {
  // In production mode with real API key:
  /*
  const results: URLScanResult[] = [];

  for (const url of urls) {
    try {
      // Submit URL for scanning
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

      if (!submitResponse.ok) {
        console.error(`URLScan submission failed for ${url}`);
        continue;
      }

      const submitData = await submitResponse.json();
      const uuid = submitData.uuid;

      // Wait for scan to complete (typically 10-30 seconds)
      await new Promise(resolve => setTimeout(resolve, 15000));

      // Retrieve results
      const resultResponse = await fetch(
        `${OSINT_CONFIG.urlscan.baseUrl}/result/${uuid}/`
      );

      if (!resultResponse.ok) {
        console.error(`URLScan result retrieval failed for ${url}`);
        continue;
      }

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
      console.error(`URLScan error for ${url}:`, error);
    }
  }

  return results;
  */

  // Mock data for development
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  return urls.slice(0, 2).map((url, idx) => ({
    uuid: `${Math.random().toString(36).substring(7)}-${Date.now()}`,
    url,
    visibility: 'public',
    verdict: {
      score: idx === 0 ? 85 : 10,
      malicious: idx === 0,
      categories: idx === 0 ? ['phishing', 'malware'] : []
    },
    submitter: {
      country: 'US'
    },
    page: {
      domain: new URL(url).hostname,
      ip: idx === 0 ? '185.220.101.34' : '8.8.8.8',
      asn: 'AS13335',
      asnname: 'CLOUDFLARENET'
    },
    stats: {
      maliciousRequests: idx === 0 ? 12 : 0,
      totalRequests: 45
    }
  }));
}

/**
 * Query IPInfo for IP geolocation and details
 * Provides geographic and organizational information about IPs
 */
export async function queryIPInfo(ipAddresses: string[]): Promise<IPInfoResult[]> {
  // In production mode with real API key:
  /*
  const results: IPInfoResult[] = [];

  for (const ip of ipAddresses) {
    try {
      const response = await fetch(
        `${OSINT_CONFIG.ipinfo.baseUrl}/${ip}?token=${OSINT_CONFIG.ipinfo.token}`
      );

      if (!response.ok) {
        console.error(`IPInfo query failed for ${ip}`);
        continue;
      }

      const data = await response.json();
      results.push(data);
    } catch (error) {
      console.error(`IPInfo error for ${ip}:`, error);
    }
  }

  return results;
  */

  // Mock data for development
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return ipAddresses.slice(0, 3).map((ip, idx) => ({
    ip,
    hostname: idx === 0 ? 'malicious-server.example.com' : 'legitimate-cdn.example.net',
    city: idx === 0 ? 'Moscow' : idx === 1 ? 'San Francisco' : 'London',
    region: idx === 0 ? 'Moscow' : idx === 1 ? 'California' : 'England',
    country: idx === 0 ? 'RU' : idx === 1 ? 'US' : 'GB',
    loc: idx === 0 ? '55.7558,37.6173' : idx === 1 ? '37.7749,-122.4194' : '51.5074,-0.1278',
    org: idx === 0 ? 'AS12389 Rostelecom' : idx === 1 ? 'AS15169 Google LLC' : 'AS2856 British Telecommunications PLC',
    postal: idx === 0 ? '101000' : idx === 1 ? '94102' : 'EC1A',
    timezone: idx === 0 ? 'Europe/Moscow' : idx === 1 ? 'America/Los_Angeles' : 'Europe/London'
  }));
}

/**
 * Comprehensive OSINT analysis
 * Orchestrates all OSINT queries and returns aggregated results
 */
export async function performOSINTAnalysis(
  fileHash: FileHash,
  extractedStrings: string[]
): Promise<OSINTData> {
  // Extract IOCs from strings
  const iocs = extractIOCs(extractedStrings);

  // Query all OSINT sources in parallel
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

/**
 * Get OSINT configuration status
 * Checks which API keys are configured
 */
export function getOSINTStatus() {
  return {
    virustotal: OSINT_CONFIG.virustotal.apiKey !== ' _VIRUSTOTAL_API_KEY',
    abuseipdb: OSINT_CONFIG.abuseipdb.apiKey !== ' _ABUSEIPDB_API_KEY',
    urlscan: OSINT_CONFIG.urlscan.apiKey !== ' _URLSCAN_API_KEY',
    ipinfo: OSINT_CONFIG.ipinfo.token !== 'YOUR_IPINFO_TOKEN'
  };
}
