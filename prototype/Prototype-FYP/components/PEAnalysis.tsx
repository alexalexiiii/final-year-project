import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { MOCK_PE_HEADERS, MOCK_PE_SECTIONS } from '../constants/mockData';

export function PEAnalysis() {
  const getEntropyColor = (entropy: number): string => {
    if (entropy > 7.0) return 'text-red-600';
    if (entropy > 6.5) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">PE Structure Analysis</CardTitle>
        <CardDescription>
          Portable Executable format analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Headers */}
        <div className="space-y-3">
          <h3 className="text-sm">PE Headers</h3>
          <div className="bg-muted rounded p-3 space-y-2 text-xs font-mono">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-muted-foreground">Image Base:</span>
              <span>{MOCK_PE_HEADERS.imageBase}</span>
              
              <span className="text-muted-foreground">Entry Point:</span>
              <span>{MOCK_PE_HEADERS.entryPoint}</span>
              
              <span className="text-muted-foreground">Subsystem:</span>
              <span>{MOCK_PE_HEADERS.subsystem}</span>
              
              <span className="text-muted-foreground">Time Stamp:</span>
              <span className="col-span-1">{MOCK_PE_HEADERS.timestamp}</span>
              
              <span className="text-muted-foreground">Checksum:</span>
              <span>{MOCK_PE_HEADERS.checksum}</span>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-3">
          <h3 className="text-sm">PE Sections</h3>
          <ScrollArea className="h-[300px] border rounded">
            <div className="p-3">
              {MOCK_PE_SECTIONS.map((section, index) => (
                <div 
                  key={index}
                  className="mb-3 pb-3 border-b last:border-b-0 last:mb-0 last:pb-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono">{section.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Entropy:</span>
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
                      <span>{section.characteristics.join(', ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <p className="text-yellow-800">
            ⚠️ High entropy detected in .rsrc section (7.8) - possible packed or encrypted content
          </p>
        </div>
      </CardContent>
    </Card>
  );
}