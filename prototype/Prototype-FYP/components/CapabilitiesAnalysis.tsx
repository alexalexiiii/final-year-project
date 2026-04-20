import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { AlertTriangle } from 'lucide-react';
import type { CapabilitySeverity } from '../types/analysis';

interface Capability {
  category: string;
  severity: CapabilitySeverity;
  items: string[];
}

interface Props {
  capabilities?: Capability[];
}

export function CapabilitiesAnalysis({ capabilities = [] }: Props) {

  const getBadge = (severity: CapabilitySeverity) => {
    if (severity === 'critical') return <Badge variant="destructive">CRITICAL</Badge>;
    if (severity === 'high') return <Badge variant="destructive">HIGH</Badge>;
    if (severity === 'medium') return <Badge>MEDIUM</Badge>;
    return <Badge variant="secondary">LOW</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">CAPA Analysis</CardTitle>
        <CardDescription>Detected capabilities</CardDescription>
      </CardHeader>

      <CardContent>

        <ScrollArea className="h-[450px]">

          {capabilities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No capabilities detected
            </p>
          ) : (
            capabilities.map((c, i) => (
              <div key={i} className="mb-3 border rounded p-3">

                <div className="flex justify-between mb-2">
                  <span>{c.category}</span>
                  {getBadge(c.severity)}
                </div>

                <ul className="text-xs list-disc ml-4">
                  {c.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>

              </div>
            ))
          )}

        </ScrollArea>

        <div className="mt-4 p-3 bg-muted rounded flex gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
          <p className="text-xs text-muted-foreground">
            Capability detection is heuristic-based.
          </p>
        </div>

      </CardContent>
    </Card>
  );
}