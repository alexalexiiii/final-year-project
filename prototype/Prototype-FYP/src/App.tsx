import { useState } from 'react';
import { AttachmentSelector } from '../components/AttachmentSelector';
import { AnalysisOverview } from '../components/AnalysisOverview';
import { FlareToolsPanel } from '../components/FlareToolsPanel';
import { Shield, AlertCircle } from 'lucide-react';
import { useOfficeContext } from '../hooks/useOfficeContext';
import { Toaster } from '../components/ui/sonner';
import type { AnalysisData } from '../types/analysis';

export default function App() {
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const { isOfficeInitialized, mailboxItem, isLoading, error } = useOfficeContext();

  // Loading state
  if (isLoading || !isOfficeInitialized) {
    return (
      <div className="center-screen">
        <div className="text-center">
          <Shield style={{ width: 48, height: 48, opacity: 0.5, marginBottom: 16 }} />
          <p className="text-muted">Initializing Office add-in...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="center-screen">
        <div className="card" style={{ maxWidth: 400 }}>
          <div className="row" style={{ marginBottom: 8 }}>
            <AlertCircle style={{ width: 16, height: 16 }} />
            <h3>Initialization Error</h3>
          </div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Toaster />

      {/* Header */}
      <div className="header">
        <div className="header-row">
          <div className="logo-box">
            <Shield style={{ width: 20, height: 20, color: "#dc2626" }} />
          </div>
          <div>
            <h1>AnalysIT Attachment Analyser</h1>
            <p className="text-small">Static analysis for email attachments</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main">
        <div className="content stack">
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
                extractedStrings={[]}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}