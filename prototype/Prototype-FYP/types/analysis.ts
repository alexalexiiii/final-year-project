// Core analysis data types for AnalysIT Attachment Analyser

export type ThreatLevel = 'low' | 'medium' | 'high' | 'critical';
export type StringType = 'suspicious' | 'normal';
export type CapabilitySeverity = 'low' | 'medium' | 'high' | 'critical';

export interface FileHash {
  md5: string;
  sha1: string;
  sha256: string;
}

export interface AnalysisData {
  filename: string;
  hash: FileHash;
  fileType: string;
  size: string;
  entropy: string;
  compiledTime: string;
  sections: number;
  imports: number;
  exports: number;
  threatLevel: ThreatLevel;
  suspicious: boolean;
}

export interface ExtractedString {
  value: string;
  type: StringType;
  category: string;
}

export interface Capability {
  category: string;
  icon: any; // LucideIcon type
  severity: CapabilitySeverity;
  items: string[];
}

export interface PESection {
  name: string;
  virtualSize: string;
  virtualAddress: string;
  rawSize: string;
  entropy: number;
  characteristics: string[];
}

export interface PEHeader {
  imageBase: string;
  entryPoint: string;
  subsystem: string;
  timestamp: string;
  checksum: string;
}

export interface ImportedFunction {
  dll: string;
  function: string;
  suspicious: boolean;
  description: string;
}

export interface OutlookAttachment {
  id: string;
  name: string;
  size: number;
  contentType: string;
  isInline?: boolean;
}

export interface OfficeMailboxItem {
  attachments: OutlookAttachment[];
  subject?: string;
  from?: {
    displayName: string;
    emailAddress: string;
  };
  internetMessageId?: string;
}

export interface RemediationRecommendation {
  priority: CapabilitySeverity;
  icon: any; // LucideIcon type
  category: string;
  actions: string[];
}

// ============= OSINT Types =============

export interface VirusTotalResult {
  positives: number;
  total: number;
  scanDate: string;
  permalink: string;
  detections: VTDetection[];
}

export interface VTDetection {
  vendor: string;
  detected: boolean;
  result: string | null;
}

export interface AbuseIPDBResult {
  ipAddress: string;
  abuseConfidenceScore: number;
  usageType: string;
  isp: string;
  domain: string;
  countryCode: string;
  isWhitelisted: boolean;
  totalReports: number;
  lastReportedAt: string | null;
}

export interface URLScanResult {
  uuid: string;
  url: string;
  visibility: string;
  verdict: {
    score: number;
    malicious: boolean;
    categories: string[];
  };
  submitter: {
    country: string;
  };
  page: {
    domain: string;
    ip: string;
    asn: string;
    asnname: string;
  };
  stats: {
    maliciousRequests: number;
    totalRequests: number;
  };
}

export interface IPInfoResult {
  ip: string;
  hostname: string;
  city: string;
  region: string;
  country: string;
  loc: string; // latitude,longitude
  org: string;
  postal: string;
  timezone: string;
}

export interface OSINTData {
  virustotal: VirusTotalResult | null;
  abuseipdb: AbuseIPDBResult[];
  urlscan: URLScanResult[];
  ipinfo: IPInfoResult[];
  extractedIOCs: {
    ips: string[];
    urls: string[];
    domains: string[];
    emails: string[];
  };
  lastUpdated: string;
}