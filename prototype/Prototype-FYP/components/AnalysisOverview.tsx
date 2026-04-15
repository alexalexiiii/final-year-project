import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { ExportButton } from './ExportButton';
import { 
  FileType, 
  Hash, 
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
          <AlertTitle>Suspicious File</AlertTitle>
          <AlertDescription>
            This file may be unsafe. Proceed with caution.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Analysis Overview</CardTitle>
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
          <div className="flex items-start gap-3">
            <FileType className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">File Type</p>
              <p className="text-sm">{data.fileType}</p>
            </div>
          </div>

          {/* File Size */}
          <div className="flex items-start gap-3">
            <HardDrive className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Size</p>
              <p className="text-sm">{data.size}</p>
            </div>
          </div>

          {/* Hashes */}
          <div className="flex items-start gap-3">
            <Hash className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">SHA-256</p>
              <p className="text-xs font-mono break-all">
                {data.hash.sha256}
              </p>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}