import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';

import {
  Globe,
  Shield,
  Server,
  Link,
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

  const getThreatLevel = (score: number) => {
    if (score >= 75)
      return { label: 'CRITICAL', icon: XCircle, variant: 'destructive' as const };
    if (score >= 50)
      return { label: 'HIGH', icon: AlertTriangle, variant: 'destructive' as const };
    if (score >= 25)
      return { label: 'MEDIUM', icon: AlertTriangle, variant: 'default' as const };

    return { label: 'LOW', icon: CheckCircle2, variant: 'secondary' as const };
  };

  const calculateScore = () => {
    if (!data) return 0;

    let score = 0;

    const vt = data.virustotal;

    if (vt?.total && vt.total > 0) {
      score += (vt.positives / vt.total) * 40;
    }

    const abuseHits =
      data.abuseipdb?.filter(i => i.abuseConfidenceScore > 50)?.length || 0;

    score += abuseHits * 15;

    const maliciousUrls =
      data.urlscan?.filter(u => u?.verdict?.malicious)?.length || 0;

    score += maliciousUrls * 20;

    return Math.min(100, Math.round(score));
  };

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

  const score = calculateScore();
  const threat = getThreatLevel(score);
  const ThreatIcon = threat.icon;

  const vt = data.virustotal;
  const abuse = data.abuseipdb ?? [];
  const urls = data.urlscan ?? [];
  const iocs = data.extractedIOCs ?? {
    ips: [],
    urls: [],
    domains: [],
    emails: []
  };

  return (
    <div className="space-y-4">

      {/* Threat Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                OSINT Intelligence
              </CardTitle>
              <CardDescription>
                External threat intelligence correlation
              </CardDescription>
            </div>

            <Badge variant={threat.variant} className="gap-1">
              <ThreatIcon className="w-3 h-3" />
              {threat.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-medium">Threat Score</p>
            </div>

            <p className="text-xl font-bold">{score}/100</p>
          </div>
        </CardContent>
      </Card>

      {/* VirusTotal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            VirusTotal
          </CardTitle>
          <CardDescription>File reputation analysis</CardDescription>
        </CardHeader>

        <CardContent>
          {vt?.total ? (
            <div className="text-sm flex justify-between">
              <span>Detections</span>
              <span className="font-mono">
                {vt.positives ?? 0}/{vt.total ?? 0}
              </span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No data available</p>
          )}
        </CardContent>
      </Card>

      {/* IP Intelligence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-4 h-4" />
            IP Intelligence
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          {abuse.length ? (
            abuse.map((ip, i) => (
              <div key={i} className="flex justify-between text-sm border-b py-2">
                <span className="font-mono">{ip.ipAddress}</span>

                <Badge variant={ip.abuseConfidenceScore > 50 ? 'destructive' : 'secondary'}>
                  {ip.abuseConfidenceScore}%
                </Badge>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No IP data</p>
          )}
        </CardContent>
      </Card>

      {/* URL Intelligence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="w-4 h-4" />
            URL Intelligence
          </CardTitle>
        </CardHeader>

        <CardContent>
          {urls.length ? (
            urls.map((u, i) => (
              <div key={i} className="flex justify-between text-sm border-b py-2">
                <span className="break-all">{u.url}</span>

                {u?.verdict?.malicious && (
                  <Badge variant="destructive">Malicious</Badge>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No URL data</p>
          )}
        </CardContent>
      </Card>

      {/* IOCs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="w-4 h-4" />
            Indicators of Compromise
          </CardTitle>
          <CardDescription>Extracted artifacts</CardDescription>
        </CardHeader>

        <CardContent className="space-y-2 text-sm">
          <p><strong>IPs:</strong> {iocs.ips.length ? iocs.ips.join(', ') : 'None'}</p>
          <p><strong>URLs:</strong> {iocs.urls.length ? iocs.urls.join(', ') : 'None'}</p>
          <p><strong>Domains:</strong> {iocs.domains.length ? iocs.domains.join(', ') : 'None'}</p>
          <p><strong>Emails:</strong> {iocs.emails.length ? iocs.emails.join(', ') : 'None'}</p>
        </CardContent>
      </Card>

    </div>
  );
}