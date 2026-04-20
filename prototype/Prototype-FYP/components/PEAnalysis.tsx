import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';

interface PEHeader {
  imageBase?: string;
  entryPoint?: string;
  subsystem?: string;
  timestamp?: string;
  checksum?: string;
}

interface PESection {
  name: string;
  entropy: number;
  virtualSize: string;
  virtualAddress: string;
  rawSize: string;
  characteristics: string[];
}

interface PEAnalysisProps {
  headers?: PEHeader | null;
  sections?: PESection[];
}

export function PEAnalysis({ headers, sections }: PEAnalysisProps) {

  const getEntropyColor = (entropy: number): string => {
    if (entropy > 7.0) return 'text-red-600';
    if (entropy > 6.5) return 'text-orange-600';
    return 'text-green-600';
  };

  const hasData = headers || (sections && sections.length > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">PE Structure Analysis</CardTitle>
        <CardDescription>
          Portable Executable format analysis
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">

        {!hasData && (
          <p className="text-sm text-muted-foreground text-center py-6">
            No PE data available
          </p>
        )}

        {/* Headers */}
        {headers && (
          <div className="space-y-3">
            <h3 className="text-sm">PE Headers</h3>

            <div className="bg-muted rounded p-3 space-y-2 text-xs font-mono">
              <div className="grid grid-cols-2 gap-2">

                <span className="text-muted-foreground">Image Base:</span>
                <span>{headers.imageBase || '-'}</span>

                <span className="text-muted-foreground">Entry Point:</span>
                <span>{headers.entryPoint || '-'}</span>

                <span className="text-muted-foreground">Subsystem:</span>
                <span>{headers.subsystem || '-'}</span>

                <span className="text-muted-foreground">Time Stamp:</span>
                <span>{headers.timestamp || '-'}</span>

                <span className="text-muted-foreground">Checksum:</span>
                <span>{headers.checksum || '-'}</span>

              </div>
            </div>
          </div>
        )}

        {/* Sections */}
        {sections && sections.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm">PE Sections</h3>

            <ScrollArea className="h-[300px] border rounded">
              <div className="p-3">

                {sections.map((section, index) => (
                  <div
                    key={index}
                    className="mb-3 pb-3 border-b last:border-b-0"
                  >

                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono">{section.name}</span>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          Entropy:
                        </span>

                        <Badge
                          variant="outline"
                          className={getEntropyColor(section.entropy)}
                        >
                          {section.entropy.toFixed(1)}
                        </Badge>
                      </div>
                    </div>

                    <div className="text-xs font-mono space-y-1">
                      <div className="grid grid-cols-2 gap-1 text-muted-foreground">

                        <span>Virtual Size:</span>
                        <span>{section.virtualSize}</span>

                        <span>Virtual Address:</span>
                        <span>{section.virtualAddress}</span>

                        <span>Raw Size:</span>
                        <span>{section.rawSize}</span>

                      </div>

                      <div className="pt-1">
                        <span className="text-muted-foreground">Flags: </span>
                        <span>{section.characteristics?.join(', ') || '-'}</span>
                      </div>
                    </div>

                  </div>
                ))}

              </div>
            </ScrollArea>
          </div>
        )}

        {/* Optional warning */}
        {sections?.some(s => s.entropy > 7.0) && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
            <p className="text-yellow-800">
              ⚠️ High entropy detected — possible packed or encrypted content
            </p>
          </div>
        )}

      </CardContent>
    </Card>
  );
}