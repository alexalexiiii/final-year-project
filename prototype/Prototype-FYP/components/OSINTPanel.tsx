import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';

import {
  Globe,
  Shield,
  Server,
  Link as LinkIcon,
  Hash,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw
} from 'lucide-react';

import type { OSINTData, FileHash } from '../types/analysis';
import { performOSINTAnalysis } from '../services/osintService';

interface OSINTPanelProps {
  fileHash: FileHash;
  extractedStrings: string[];
}

export function OSINTPanel({ fileHash, extractedStrings }: OSINTPanelProps) {
  const [data, setData] = useState<OSINTData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await performOSINTAnalysis(fileHash, extractedStrings);
      setData(result);
    } catch (e) {
      console.error(e);
      setError('Failed to retrieve OSINT data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [fileHash, extractedStrings]);

  const vtHash = fileHash.sha256 || fileHash.sha1 || fileHash.md5;

  /* =========================
     🔗 HARD CODED LINKS
     ========================= */

  const virusTotalFileLink = vtHash
    ? `https://www.virustotal.com/gui/file/${vtHash}`
    : 'https://www.virustotal.com/';

  const abuseIpDbLink = 'https://www.abuseipdb.com/';
  const urlScanLink = 'https://urlscan.io/';

  const vt = data?.virustotal;
  const abuse = data?.abuseipdb ?? [];
  const urls = data?.urlscan ?? [];

  const iocs = data?.extractedIOCs ?? {
    ips: [],
    urls: [],
    domains: [],
    emails: []
  };

  const calculateScore = () => {
    if (!data) return 0;

    let score = 0;

    if (vt?.total) {
      score += (vt.positives / vt.total) * 40;
    }

    const abuseHits =
      abuse.filter((a) => a.abuseConfidenceScore > 50).length;

    score += abuseHits * 15;

    const maliciousUrls =
      urls.filter((u) => u?.verdict?.malicious).length;

    score += maliciousUrls * 20;

    return Math.min(100, Math.round(score));
  };

  const score = calculateScore();

  const threat =
    score >= 75
      ? { label: 'CRITICAL', icon: XCircle, variant: 'destructive' as const }
      : score >= 50
      ? { label: 'HIGH', icon: AlertTriangle, variant: 'destructive' as const }
      : score >= 25
      ? { label: 'MEDIUM', icon: AlertTriangle, variant: 'default' as const }
      : { label: 'LOW', icon: CheckCircle2, variant: 'secondary' as const };

  const ThreatIcon = threat.icon;

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
          Querying OSINT feeds...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>OSINT Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button onClick={load} variant="outline" size="sm" className="mt-3">
          Retry
        </Button>
      </Alert>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-4">

      {/* HEADER */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              OSINT Intelligence
            </span>

            <Badge variant={threat.variant}>
              <ThreatIcon className="w-3 h-3 mr-1" />
              {threat.label} • {score}/100
            </Badge>
          </CardTitle>

          <CardDescription>
            Based on VirusTotal, AbuseIPDB, URLScan, and extracted IOCs.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* HARD CODED INVESTIGATION LINKS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            Investigation Links
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2 text-sm">
          <a href={virusTotalFileLink} target="_blank" rel="noopener noreferrer" className="block underline text-blue-500">
            VirusTotal File Lookup 
          </a>

          <a href={abuseIpDbLink} target="_blank" rel="noopener noreferrer" className="block underline text-blue-500">
            AbuseIPDB 
          </a>

          <a href={urlScanLink} target="_blank" rel="noopener noreferrer" className="block underline text-blue-500">
            URLScan 
          </a>
        </CardContent>
      </Card>

      {/* VIRUSTOTAL */}
      <Card>
        <CardHeader>
          <CardTitle>VirusTotal</CardTitle>
        </CardHeader>

        <CardContent>
          {vt?.total ? (
            <p>{vt.positives}/{vt.total} detections</p>
          ) : (
            <p className="text-muted-foreground">No data available</p>
          )}
        </CardContent>
      </Card>

      {/* IPs */}
      <Card>
        <CardHeader>
          <CardTitle>IP Intelligence</CardTitle>
        </CardHeader>

        <CardContent>
          {iocs.ips.length ? (
            iocs.ips.map((ip: string, i: number) => (
              <a
                key={i}
                href={`https://www.abuseipdb.com/check/${ip}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block underline"
              >
                {ip}
              </a>
            ))
          ) : (
            <p className="text-muted-foreground">None</p>
          )}
        </CardContent>
      </Card>

      {/* URLs */}
      <Card>
        <CardHeader>
          <CardTitle>URL Intelligence</CardTitle>
        </CardHeader>

        <CardContent>
          {urls.length ? (
            urls.map((u: any, i: number) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="break-all">{u.url}</span>
                {u?.verdict?.malicious && (
                  <Badge variant="destructive">Malicious</Badge>
                )}
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">None</p>
          )}
        </CardContent>
      </Card>

    </div>
  );
}