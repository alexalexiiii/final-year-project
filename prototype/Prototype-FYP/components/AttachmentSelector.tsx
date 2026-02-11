import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { FileSearch, Play, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { analyzeAttachment, validateAttachment } from '../services/analysisService';
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
      // Filter out inline attachments (embedded images)
      const regularAttachments = mailboxItem.attachments.filter(att => !att.isInline);
      setAttachments(regularAttachments);
    }
  }, [mailboxItem]);

  const handleAttachmentSelect = (attachmentName: string) => {
    setSelectedFile(attachmentName);
    // Find the attachment ID
    const attachment = attachments.find(att => att.name === attachmentName);
    if (attachment) {
      setSelectedAttachmentId(attachment.id);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !selectedAttachmentId) {
      toast.error('Please select an attachment to analyze');
      return;
    }

    // Find the selected attachment
    const attachment = attachments.find(att => att.name === selectedFile);
    if (!attachment) {
      toast.error('Attachment not found');
      return;
    }

    // Validate attachment
    const validation = validateAttachment(selectedFile, attachment.size);
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid attachment');
      return;
    }

    setIsAnalyzing(true);
    onSelectAttachment(selectedFile);

    try {
      // Call analysis service
      const result = await analyzeAttachment(
        selectedAttachmentId,
        selectedFile,
        mailboxItem
      );

      onAnalysisComplete(result);
      toast.success('Analysis complete');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze attachment. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSearch className="w-5 h-5" />
          Select Attachment
        </CardTitle>
        <CardDescription>
          Choose an attachment from the current email to analyze
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {attachments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No attachments found in this email.</p>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-sm">Attachment</label>
              <Select value={selectedFile} onValueChange={handleAttachmentSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select attachment..." />
                </SelectTrigger>
                <SelectContent>
                  {attachments.map((attachment) => (
                    <SelectItem key={attachment.id} value={attachment.name}>
                      <div className="flex items-center justify-between gap-4">
                        <span>{attachment.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatBytes(attachment.size)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              className="w-full gap-2" 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !selectedFile}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start Analysis
                </>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}