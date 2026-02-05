import { useState } from 'react';
import { AttachmentSelector } from './components/AttachmentSelector';
import { AnalysisOverview } from './components/AnalysisOverview';
import { FlareToolsPanel } from './components/FlareToolsPanel';
import { Shield, AlertCircle } from 'lucide-react';
import { useOfficeContext } from './hooks/useOfficeContext';
import { Toaster } from './components/ui/sonner';
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert';
import type { AnalysisData } from './types/analysis';

export default function App() {
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const { isOfficeInitialized, mailboxItem, isLoading, error } = useOfficeContext();

  // Loading state
  if (isLoading || !isOfficeInitialized) {
    return (
      <div className="h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Initializing Office add-in...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen bg-background flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Initialization Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      <Toaster />
      {/* Header */}
      <div className="border-b px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <Shield className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h1 className="text-white">AnalysIT Attachment Analyser</h1>
            <p className="text-xs text-red-50">Static analysis for email attachments</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-4">
          <AttachmentSelector 
            mailboxItem={mailboxItem}
            onSelectAttachment={setSelectedAttachment}
            onAnalysisComplete={setAnalysisData}
          />

          {selectedAttachment && analysisData && (
            <>
              <AnalysisOverview data={analysisData} />
              <FlareToolsPanel 
                attachmentName={selectedAttachment}
                fileHash={analysisData.hash}
                threatLevel={analysisData.threatLevel}
                suspicious={analysisData.suspicious}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}