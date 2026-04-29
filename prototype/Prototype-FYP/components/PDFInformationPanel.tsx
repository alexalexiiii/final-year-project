import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';

interface PDFMetadata {
  title?: string;
  author?: string;
  creator?: string;
  producer?: string;
  creationDate?: string;
  modDate?: string;
  trapped?: string;
}

interface PDFObject {
  id: number;
  type: string;
  size: string;
  isEncrypted?: boolean;
  isStream?: boolean;
}

interface PDFAnalysisProps {
  metadata?: PDFMetadata | null;
  objects?: PDFObject[];
  suspicious?: boolean;
}

export function PDFAnalysis({ metadata, objects, suspicious }: PDFAnalysisProps) {

  const hasData = metadata || (objects && objects.length > 0);

  const getRiskBadge = () => {
    if (suspicious) {
      return <Badge variant="destructive">SUSPICIOUS</Badge>;
    }
    return <Badge variant="secondary">CLEAN</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm">PDF Analysis</CardTitle>
            <CardDescription>
              Document metadata and structure inspection
            </CardDescription>
          </div>

          {getRiskBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">

        {!hasData && (
          <p className="text-sm text-muted-foreground text-center py-6">
            No PDF data available
          </p>
        )}

        {/* Metadata */}
        {metadata && (
          <div className="space-y-3">
            <h3 className="text-sm">PDF Metadata</h3>

            <div className="bg-muted rounded p-3 space-y-2 text-xs font-mono">
              <div className="grid grid-cols-2 gap-2">

                <span className="text-muted-foreground">Title:</span>
                <span>{metadata.title || '-'}</span>

                <span className="text-muted-foreground">Author:</span>
                <span>{metadata.author || '-'}</span>

                <span className="text-muted-foreground">Creator:</span>
                <span>{metadata.creator || '-'}</span>

                <span className="text-muted-foreground">Producer:</span>
                <span>{metadata.producer || '-'}</span>

                <span className="text-muted-foreground">Created:</span>
                <span>{metadata.creationDate || '-'}</span>

                <span className="text-muted-foreground">Modified:</span>
                <span>{metadata.modDate || '-'}</span>

                <span className="text-muted-foreground">Trapped:</span>
                <span>{metadata.trapped || '-'}</span>

              </div>
            </div>
          </div>
        )}

        {/* PDF Objects */}
        {objects && objects.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm">PDF Objects</h3>

            <ScrollArea className="h-[300px] border rounded">
              <div className="p-3">

                {objects.map((obj, index) => (
                  <div
                    key={index}
                    className="mb-3 pb-3 border-b last:border-b-0"
                  >

                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono">Object {obj.id}</span>

                      <div className="flex items-center gap-2">

                        {obj.isEncrypted && (
                          <Badge variant="destructive">Encrypted</Badge>
                        )}

                        {obj.isStream && (
                          <Badge variant="outline">Stream</Badge>
                        )}

                      </div>
                    </div>

                    <div className="text-xs font-mono space-y-1 text-muted-foreground">
                      <div className="grid grid-cols-2 gap-1">

                        <span>Type:</span>
                        <span>{obj.type}</span>

                        <span>Size:</span>
                        <span>{obj.size}</span>

                      </div>
                    </div>

                  </div>
                ))}

              </div>
            </ScrollArea>
          </div>
        )}

      </CardContent>
    </Card>
  );
}