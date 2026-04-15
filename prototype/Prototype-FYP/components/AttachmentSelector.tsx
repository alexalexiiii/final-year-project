import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { analyzeAttachment } from '../services/analysisService';
import type { OfficeMailboxItem, OutlookAttachment, AnalysisData } from '../types/analysis';

interface AttachmentSelectorProps {
  mailboxItem: OfficeMailboxItem | null;
  onSelectAttachment: (name: string) => void;
  onAnalysisComplete: (data: AnalysisData) => void;
}

export function AttachmentSelector({ mailboxItem, onSelectAttachment, onAnalysisComplete }: AttachmentSelectorProps) {
  const [attachments, setAttachments] = useState<OutlookAttachment[]>([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [selectedAttachmentId, setSelectedAttachmentId] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (mailboxItem?.attachments) {
      const regularAttachments = mailboxItem.attachments.filter(att => !att.isInline);
      setAttachments(regularAttachments);
    }
  }, [mailboxItem]);

  const handleAnalyze = async () => {
    if (!selectedFile || !selectedAttachmentId) {
      toast.error('Please select an attachment');
      return;
    }

    setIsAnalyzing(true);
    onSelectAttachment(selectedFile);

    try {
      const result = await analyzeAttachment(
        selectedAttachmentId,
        selectedFile,
        mailboxItem
      );

      onAnalysisComplete(result);
      toast.success('Analysis complete');
    } catch {
      toast.error('Failed to analyze attachment');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="card">
      <h2>Select Attachment</h2>
      <p className="text-muted">Choose an attachment to analyze</p>

      {attachments.length === 0 ? (
        <p className="text-muted">No attachments found.</p>
      ) : (
        <>
          <div className="section">
            <label>Attachment</label>
            <select
              value={selectedFile}
              onChange={(e) => {
                const name = e.target.value;
                setSelectedFile(name);

                const att = attachments.find(a => a.name === name);
                if (att) setSelectedAttachmentId(att.id);
              }}
            >
              <option value="">Select attachment...</option>

              {attachments.map(att => (
                <option key={att.id} value={att.name}>
                  {att.name} ({Math.round(att.size / 1024)} KB)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!selectedFile || isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
          </button>
        </>
      )}
    </div>
  );
}