import { LucideIcon } from "lucide-react";

/* =========================
   CORE TYPES
========================= */

export type ThreatLevel = 'low' | 'medium' | 'high' | 'critical';
export type StringType = 'suspicious' | 'normal';
export type CapabilitySeverity = 'low' | 'medium' | 'high' | 'critical';

export interface FileHash {
  md5: string;
  sha1: string;
  sha256: string;
}

/* =========================
   IOC
========================= */

export interface IOCData {
  ips: string[];
  urls: string[];
  domains: string[];
  emails: string[];
}

/* =========================
   SUSPICIOUS (PDF + FLAGS)
========================= */

export interface SuspiciousData {
  pdf_features: Record<string, number | boolean>;
  pdfid_flags: Record<string, number>;
}

/* =========================
   ANALYSIS DATA (MAIN EXPORT)
========================= */

export interface AnalysisData {
  filename: string;

  hash: FileHash;
  fileType: string;
  size: number;

  entropy: number;
  compiledTime?: string;

  sections: number;
  imports: number;
  exports: number;

  threatLevel: ThreatLevel;

  suspicious: SuspiciousData;
  iocs: IOCData;

  pdfid?: PEAnalysisData;
  capa?: CapaAnalysisData;
  floss?: ExtractedString[];
  email?: EmailContext;
}

/* =========================
   PE DATA
========================= */

export interface PEAnalysisData {
  headers?: PEHeader;
  sections?: PESection[];
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

/* =========================
   CAPA
========================= */

export interface Capability {
  category: string;
  severity: CapabilitySeverity;
  items: string[];
}

export interface CapaAnalysisData {
  capabilities: Capability[];
}

/* =========================
   STRINGS
========================= */

export interface ExtractedString {
  value: string;
  type: StringType;
  category: string;
}

/* =========================
   EMAIL
========================= */

export interface EmailContext {
  from?: string;
  fromEmail?: string;
  subject?: string;
  date?: string;
  messageId?: string;

  to?: string[];
  cc?: string[];
  bcc?: string[];

  senderDomain?: string;
  isExternal?: boolean;

  spf?: 'pass' | 'fail' | 'none' | 'softfail';
  dkim?: 'pass' | 'fail' | 'none';
  dmarc?: 'pass' | 'fail' | 'none';

  returnPath?: string;
  replyTo?: string;
  receivedHeaders?: string[];
  authenticationResults?: string;

  riskLevel?: 'low' | 'medium' | 'high';
  riskScore?: number;
  indicators?: string[];
}

/* =========================
   OSINT
========================= */

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
  loc: string;
  org: string;
  postal: string;
  timezone: string;
}

export interface OSINTData {
  virustotal: VirusTotalResult | null;
  abuseipdb: AbuseIPDBResult[];
  urlscan: URLScanResult[];
  ipinfo: IPInfoResult[];

  extractedIOCs: IOCData;

  lastUpdated: string;
}