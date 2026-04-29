import { Button } from './ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import type { AnalysisData } from '../types/analysis';

interface ExportButtonProps {
  analysisData: AnalysisData;
  attachmentName: string;
}

export function ExportButton({ analysisData, attachmentName }: ExportButtonProps) {

  const calculateThreatScore = (data: AnalysisData): number => {
    let score = 0;

    if (data.entropy > 7) score += 30;
    else if (data.entropy > 6) score += 15;

    if (data.suspicious) score += 40;

    if ((data.imports || 0) > 20) score += 10;
    if ((data.exports || 0) > 10) score += 10;

    if ((data.sections || 0) > 5) score += 5;

    return Math.min(100, score);
  };

  const exportToCSV = () => {
    try {
      const timestamp = new Date().toISOString();
      const threatScore = calculateThreatScore(analysisData);

      let csvContent = '';

      // Header
      csvContent += 'FLARE Malware Analysis Report\n';
      csvContent += `Generated,${timestamp}\n`;
      csvContent += `Attachment,${attachmentName}\n\n`;

      // Overview (REAL DATA ONLY)
      csvContent += 'ANALYSIS OVERVIEW\n';
      csvContent += 'Category,Value\n';
      csvContent += `Filename,${analysisData.filename}\n`;
      csvContent += `File Type,${analysisData.fileType}\n`;
      csvContent += `File Size,${analysisData.size}\n`;
      csvContent += `Entropy,${analysisData.entropy}\n`;
      csvContent += `Threat Score,${threatScore}/100\n`;
      csvContent += `Compiled Time,${analysisData.compiledTime || 'N/A'}\n`;
      csvContent += `Threat Level,${analysisData.threatLevel.toUpperCase()}\n`;
      csvContent += `Suspicious,${analysisData.suspicious ? 'Yes' : 'No'}\n`;
      csvContent += `MD5,${analysisData.hash.md5}\n`;
      csvContent += `SHA-1,${analysisData.hash.sha1}\n`;
      csvContent += `SHA-256,${analysisData.hash.sha256}\n`;
      csvContent += `Sections,${analysisData.sections}\n`;
      csvContent += `Imports,${analysisData.imports}\n`;
      csvContent += `Exports,${analysisData.exports}\n\n`;

      // FLOSS (REAL ONLY)
      csvContent += 'STRINGS ANALYSIS (FLOSS)\n';
      csvContent += 'String Value,Type,Category\n';

      if (analysisData.floss && analysisData.floss.length > 0) {
        analysisData.floss.forEach(s => {
          csvContent += `${s.value},${s.type},${s.category}\n`;
        });
      } else {
        csvContent += 'No extracted strings available\n';
      }

      csvContent += '\n';

      // CAPA (REAL ONLY)
      csvContent += 'CAPABILITIES ANALYSIS (CAPA)\n';
      csvContent += 'No capability data provided by backend\n\n';

      // PE (REAL ONLY)
      csvContent += 'PE STRUCTURE ANALYSIS\n';
      csvContent += 'No PE data provided by backend\n\n';

      // EXPORT
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      const safeFilename = attachmentName
        .replace(/[^a-z0-9]/gi, '_')
        .toLowerCase();

      link.href = url;
      link.download = `malware_analysis_${safeFilename}_${Date.now()}.csv`;
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Analysis report exported successfully');

    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export analysis report');
    }
  };

  return (
    <Button
      onClick={exportToCSV}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <Download className="w-4 h-4" />
      Export to CSV
    </Button>
  );
}