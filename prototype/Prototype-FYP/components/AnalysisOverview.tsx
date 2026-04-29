import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { ExportButton } from './ExportButton';
import { 
  FileType, 
  HardDrive,
  AlertTriangle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import type { AnalysisData, ThreatLevel } from '../types/analysis';

interface AnalysisOverviewProps {
  data: AnalysisData;
}

export function AnalysisOverview({ data }: AnalysisOverviewProps) {

  const getThreatBadge = (level: ThreatLevel) => {
    const variants = {
      low: { variant: 'secondary' as const, icon: CheckCircle2 },
      medium: { variant: 'default' as const, icon: AlertTriangle },
      high: { variant: 'destructive' as const, icon: AlertTriangle },
      critical: { variant: 'destructive' as const, icon: XCircle }
    };

    const config = variants[level];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {level.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div>

      {data.suspicious && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Suspicious File Detected</AlertTitle>
          <AlertDescription>
            This file contains indicators of malicious or unusual behavior.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>File Overview</CardTitle>
              <CardDescription className="mt-1 break-all">
                {data.filename}
              </CardDescription>
            </div>

            <div className="flex flex-col items-end gap-2">
              {getThreatBadge(data.threatLevel)}

              <ExportButton 
                analysisData={data} 
                attachmentName={data.filename} 
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* File Type */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileType className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Type</span>
            </div>
            <span className="text-sm">{data.fileType}</span>
          </div>

          {/* File Size */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Size</span>
            </div>
            <span className="text-sm">{data.size}</span>
          </div>

          {/* SHA-256 ONLY (cleaned) */}
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">SHA-256</span>
            <p className="text-xs font-mono break-all">
              {data.hash.sha256}
            </p>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}