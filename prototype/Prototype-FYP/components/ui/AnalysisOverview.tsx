import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { ExportButton } from './ExportButton';
import { 
  FileType, 
  Hash, 
  Calendar, 
  HardDrive, 
  Activity,
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
      low: { variant: 'secondary' as const, icon: CheckCircle2, color: 'text-green-600' },
      medium: { variant: 'default' as const, icon: AlertTriangle, color: 'text-yellow-600' },
      high: { variant: 'destructive' as const, icon: AlertTriangle, color: 'text-orange-600' },
      critical: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' }
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
    <div className="space-y-4">
      {data.suspicious && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Suspicious File Detected</AlertTitle>
          <AlertDescription>
            This file exhibits suspicious characteristics. Exercise extreme caution.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Analysis Overview</CardTitle>
              <CardDescription className="mt-1 break-all">{data.filename}</CardDescription>
            </div>
            <div className="flex flex-col gap-2 items-end">
              {getThreatBadge(data.threatLevel)}
              <ExportButton analysisData={data} attachmentName={data.filename} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Type */}
          <div className="flex items-start gap-3">
            <FileType className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">File Type</p>
              <p className="text-sm break-all">{data.fileType}</p>
            </div>
          </div>

          {/* File Hashes */}
          <div className="flex items-start gap-3">
            <Hash className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0 space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">MD5</p>
                <p className="text-xs font-mono break-all">{data.hash.md5}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">SHA-1</p>
                <p className="text-xs font-mono break-all">{data.hash.sha1}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">SHA-256</p>
                <p className="text-xs font-mono break-all">{data.hash.sha256}</p>
              </div>
            </div>
          </div>

          {/* File Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <HardDrive className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Size</p>
                <p className="text-sm">{data.size}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Activity className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Entropy</p>
                <p className="text-sm">{data.entropy}</p>
              </div>
            </div>
          </div>

          {/* Compilation Time */}
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Compiled</p>
              <p className="text-sm">{data.compiledTime}</p>
            </div>
          </div>

          {/* PE Statistics */}
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-2">PE Structure</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-muted rounded">
                <p className="text-lg">{data.sections}</p>
                <p className="text-xs text-muted-foreground">Sections</p>
              </div>
              <div className="p-2 bg-muted rounded">
                <p className="text-lg">{data.imports}</p>
                <p className="text-xs text-muted-foreground">Imports</p>
              </div>
              <div className="p-2 bg-muted rounded">
                <p className="text-lg">{data.exports}</p>
                <p className="text-xs text-muted-foreground">Exports</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}