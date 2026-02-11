import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Search, AlertTriangle } from 'lucide-react';
import { MOCK_IMPORTS } from '../constants/mockData';

export function ImportsAnalysis() {
  const [searchTerm, setSearchTerm] = useState('');

  // Group imports by DLL
  const groupedImports = MOCK_IMPORTS.reduce((acc, imp) => {
    if (!acc[imp.dll]) {
      acc[imp.dll] = [];
    }
    acc[imp.dll].push(imp);
    return acc;
  }, {} as Record<string, typeof MOCK_IMPORTS>);

  // Filter based on search term
  const filteredGroups = Object.entries(groupedImports).map(([dll, functions]) => ({
    dll,
    functions: functions.filter(fn => 
      fn.function.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fn.description.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    hasSuspicious: functions.some(fn => fn.suspicious)
  })).filter(group => group.functions.length > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Import Address Table (IAT)</CardTitle>
        <CardDescription>
          Imported DLLs and functions used by the executable
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search imports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <ScrollArea className="h-[450px] border rounded">
          <div className="p-3 space-y-4">
            {filteredGroups.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No imports found matching your search
              </p>
            ) : (
              filteredGroups.map((group, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2 sticky top-0 bg-background py-2 border-b">
                    <span className="font-mono">{group.dll}</span>
                    {group.hasSuspicious && (
                      <Badge variant="destructive" className="gap-1 text-xs">
                        <AlertTriangle className="w-3 h-3" />
                        Suspicious
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs ml-auto">
                      {group.functions.length} {group.functions.length === 1 ? 'function' : 'functions'}
                    </Badge>
                  </div>

                  <div className="space-y-1 pl-4">
                    {group.functions.map((fn, fnIndex) => (
                      <div 
                        key={fnIndex}
                        className={`p-2 rounded text-xs ${
                          fn.suspicious 
                            ? 'bg-red-50 border border-red-200' 
                            : 'bg-muted'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <code className="font-mono">{fn.function}</code>
                            <p className="text-muted-foreground mt-1">
                              {fn.description}
                            </p>
                          </div>
                          {fn.suspicious && (
                            <AlertTriangle className="w-3 h-3 text-red-600 flex-shrink-0 mt-0.5" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="p-3 bg-red-50 border border-red-200 rounded text-xs">
          <p className="text-red-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              Multiple suspicious imports detected suggesting process injection, 
              privilege escalation, and persistence mechanisms.
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}