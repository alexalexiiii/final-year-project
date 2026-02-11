import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { AlertTriangle } from 'lucide-react';
import { MOCK_CAPABILITIES } from '../constants/mockData';
import type { CapabilitySeverity } from '../types/analysis';

export function CapabilitiesAnalysis() {
  const getSeverityColor = (severity: CapabilitySeverity): string => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  const getSeverityBadge = (severity: CapabilitySeverity) => {
    switch (severity) {
      case 'critical': return <Badge variant="destructive">CRITICAL</Badge>;
      case 'high': return <Badge variant="destructive" className="bg-orange-600">HIGH</Badge>;
      case 'medium': return <Badge variant="default">MEDIUM</Badge>;
      default: return <Badge variant="secondary">LOW</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">CAPA - Capability Analysis</CardTitle>
        <CardDescription>
          Detected capabilities based on MITRE ATT&CK framework
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[450px] pr-4">
          <div className="space-y-3">
            {MOCK_CAPABILITIES.map((capability, index) => {
              const Icon = capability.icon;
              return (
                <div 
                  key={index}
                  className={`border-l-4 rounded p-3 ${getSeverityColor(capability.severity)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <h3 className="text-sm">{capability.category}</h3>
                    </div>
                    {getSeverityBadge(capability.severity)}
                  </div>
                  <ul className="space-y-1 ml-6">
                    {capability.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-xs text-muted-foreground list-disc">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="mt-4 p-3 bg-muted rounded flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            This file exhibits capabilities commonly associated with malware. 
            Further dynamic analysis recommended.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}