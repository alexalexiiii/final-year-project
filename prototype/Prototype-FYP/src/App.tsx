import { useState } from 'react';
import { AttachmentSelector } from '../components/AttachmentSelector';
import { AnalysisOverview } from '../components/AnalysisOverview';
import { FlareToolsPanel } from '../components/FlareToolsPanel';
import { PEAnalysis } from '../components/PEAnalysis';
import { CapabilitiesAnalysis } from '../components/CapabilitiesAnalysis';
import { StringsAnalysis } from '../components/StringsAnalysis';
import { SenderInfoPanel } from '../components/SenderInfoPanel';
import { PDFAnalysis } from '../components/PDFInformationPanel';
import { Shield, AlertCircle } from 'lucide-react';
import { useOfficeContext } from '../hooks/useOfficeContext';
import { Toaster } from '../components/ui/sonner';

import type { AnalysisData } from '../types/analysis';

export default function App() {
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  // NEW: consent state
  const [acceptedWarning, setAcceptedWarning] = useState(false);

  const {
    isOfficeInitialized,
    mailboxItem,
    isLoading,
    error
  } = useOfficeContext();

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

      {/* ================= WARNING MODAL ================= */}
      {!acceptedWarning && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <AlertCircle className="w-6 h-6 text-yellow-500" />
              <h2>Important Notice</h2>
            </div>

            <p className="modal-text">
              This tool performs <b>OSINT enrichment</b> and external analysis.
              <br /><br />
              Do <b>NOT upload sensitive, personal, or corporate data</b>.
              Uploaded files may be processed for enrichment and analysis purposes.
            </p>

            <button
              className="modal-button"
              onClick={() => setAcceptedWarning(true)}
            >
              I Understand & Continue
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="header">
        <div className="header-row">
          <div className="logo-box">
            <Shield style={{ width: 60, height: 60, color: "#b580ff" }} />
          </div>
          <div>
            <h1>AnalysIT Attachment Analyser</h1>
            <p className="text-small">Static analysis for email attachments</p>
          </div>
        </div>
      </div>

      {/* Main Content (disabled behind modal) */}
      <div className={`main ${!acceptedWarning ? 'disabled' : ''}`}>
        <div className="content stack">

          <AttachmentSelector
            mailboxItem={mailboxItem as Office.MessageRead | null}
            onSelectAttachment={setSelectedAttachment}
            onAnalysisComplete={setAnalysisData}
          />

          {selectedAttachment && analysisData && (
            <>
              <AnalysisOverview data={analysisData} />

              <PEAnalysis
                headers={(analysisData as any).pe?.headers}
                sections={(analysisData as any).pe?.sections}
              />

              <CapabilitiesAnalysis
                capabilities={analysisData.capa?.capabilities || []}
              />

              <StringsAnalysis
                strings={analysisData.floss || []}
              />

              <SenderInfoPanel
                mailboxItem={mailboxItem as Office.MessageRead | null}
              />

              <PDFAnalysis
               metadata={(analysisData as any).suspicious?.pdf_features}
               objects={(analysisData as any).suspicious?.pdfid_flags}
               suspicious={analysisData.suspicious}
              />

              <FlareToolsPanel
                attachmentName={selectedAttachment}
                fileHash={analysisData.hash}
                threatLevel={analysisData.threatLevel}
                suspicious={analysisData.suspicious}
                extractedStrings={analysisData.floss || []}
                capabilities={analysisData.capa?.capabilities || []}
                peHeaders={(analysisData as any).pe?.headers || null}
                peSections={(analysisData as any).pe?.sections || []}
                mailboxItem={mailboxItem as Office.MessageRead | null}
              />
            </>
          )}

        </div>
      </div>

      {/* ================= MODAL STYLES ================= */}
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .modal-card {
          background: #111827;
          color: #ffffff;
          padding: 24px;
          border-radius: 12px;
          width: 420px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }

        .modal-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .modal-text {
          font-size: 14px;
          color: #d1d5db;
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .modal-button {
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 8px;
          background: #7c3aed;
          color: white;
          cursor: pointer;
          font-weight: 600;
        }

        .modal-button:hover {
          background: #6d28d9;
        }

        .disabled {
          pointer-events: none;
          opacity: 0.4;
        }
      `}</style>
    </div>
  );
}