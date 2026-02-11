import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Search, Copy, Check } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { MOCK_STRINGS } from '../constants/mockData';
import type { ExtractedString } from '../types/analysis';

export function StringsAnalysis() {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const filteredStrings = MOCK_STRINGS.filter(s => 
    s.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (value: string, index: number) => {
    navigator.clipboard.writeText(value);
    setCopiedIndex(index);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">FLOSS - String Analysis</CardTitle>
        <CardDescription>
          Extracted strings including obfuscated and encoded strings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search strings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="flex gap-2 text-xs">
          <Badge variant="destructive">
            {filteredStrings.filter(s => s.type === 'suspicious').length} Suspicious
          </Badge>
          <Badge variant="secondary">
            {filteredStrings.filter(s => s.type === 'normal').length} Normal
          </Badge>
        </div>

        <ScrollArea className="h-[400px] border rounded p-3">
          <div className="space-y-2">
            {filteredStrings.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No strings found matching your search
              </p>
            ) : (
              filteredStrings.map((string, index) => (
                <div 
                  key={index}
                  className={`p-2 rounded text-xs border ${
                    string.type === 'suspicious' 
                      ? 'bg-red-50 border-red-200' 
                      : 'bg-muted border-border'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {string.category}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-5 w-5 p-0"
                      onClick={() => handleCopy(string.value, index)}
                    >
                      {copiedIndex === index ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                  <code className="break-all">{string.value}</code>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}