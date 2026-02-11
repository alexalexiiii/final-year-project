import { Button } from './ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { AnalysisData } from '../types/analysis';

interface ExportButtonProps {
  analysisData: AnalysisData;
  attachmentName: string;
}

export function ExportButton({ analysisData, attachmentName }: ExportButtonProps) {
  const exportToCSV = () => {
    try {
      // Prepare CSV data
      const timestamp = new Date().toISOString();
      let csvContent = '';

      // Header
      csvContent += 'FLARE Malware Analysis Report\n';
      csvContent += `Generated: ${timestamp}\n`;
      csvContent += `Attachment: ${attachmentName}\n\n`;

      // Analysis Overview
      csvContent += 'ANALYSIS OVERVIEW\n';
      csvContent += 'Category,Value\n';
      csvContent += `Filename,${analysisData.filename}\n`;
      csvContent += `File Type,${analysisData.fileType}\n`;
      csvContent += `File Size,${analysisData.size}\n`;
      csvContent += `Entropy,${analysisData.entropy}\n`;
      csvContent += `Compiled Time,${analysisData.compiledTime}\n`;
      csvContent += `Threat Level,${analysisData.threatLevel.toUpperCase()}\n`;
      csvContent += `Suspicious,${analysisData.suspicious ? 'Yes' : 'No'}\n`;
      csvContent += `MD5,${analysisData.hash.md5}\n`;
      csvContent += `SHA-1,${analysisData.hash.sha1}\n`;
      csvContent += `SHA-256,${analysisData.hash.sha256}\n`;
      csvContent += `Sections,${analysisData.sections}\n`;
      csvContent += `Imports,${analysisData.imports}\n`;
      csvContent += `Exports,${analysisData.exports}\n\n`;

      // Strings Analysis (mock data - in real implementation this would come from props)
      csvContent += 'STRINGS ANALYSIS (FLOSS)\n';
      csvContent += 'String Value,Type,Category\n';
      csvContent += 'C:\\Windows\\System32\\cmd.exe,suspicious,Command Execution\n';
      csvContent += 'http://malicious-domain.com/payload,suspicious,Network\n';
      csvContent += 'SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run,suspicious,Persistence\n';
      csvContent += 'AdjustTokenPrivileges,suspicious,Privilege Escalation\n';
      csvContent += 'CreateRemoteThread,suspicious,Process Injection\n';
      csvContent += 'VirtualAllocEx,suspicious,Memory Management\n';
      csvContent += 'WriteProcessMemory,suspicious,Process Injection\n';
      csvContent += 'admin123,suspicious,Credential\n';
      csvContent += 'password,suspicious,Credential\n\n';

      // Capabilities Analysis (CAPA)
      csvContent += 'CAPABILITIES ANALYSIS (CAPA - MITRE ATT&CK)\n';
      csvContent += 'Category,Severity,Capability\n';
      csvContent += 'Execution,high,execute shell commands\n';
      csvContent += 'Execution,high,create process\n';
      csvContent += 'Execution,high,inject code into remote process\n';
      csvContent += 'Persistence,high,modify Windows Registry for persistence\n';
      csvContent += 'Persistence,high,create scheduled task\n';
      csvContent += 'Persistence,high,create Windows service\n';
      csvContent += 'Defense Evasion,critical,bypass User Account Control\n';
      csvContent += 'Defense Evasion,critical,disable security tools\n';
      csvContent += 'Defense Evasion,critical,obfuscate strings\n';
      csvContent += 'Defense Evasion,critical,check for virtual machine\n';
      csvContent += 'Network,medium,HTTP communication\n';
      csvContent += 'Network,medium,download file from internet\n';
      csvContent += 'Network,medium,resolve domain names\n';
      csvContent += 'Discovery,medium,enumerate system information\n';
      csvContent += 'Discovery,medium,query registry\n';
      csvContent += 'Discovery,medium,check running processes\n';
      csvContent += 'Command and Control,critical,connect to remote server\n';
      csvContent += 'Command and Control,critical,receive commands from C2\n';
      csvContent += 'Command and Control,critical,exfiltrate data\n\n';

      // PE Analysis
      csvContent += 'PE STRUCTURE ANALYSIS\n';
      csvContent += 'PE Headers\n';
      csvContent += 'Property,Value\n';
      csvContent += 'Image Base,0x00400000\n';
      csvContent += 'Entry Point,0x00001234\n';
      csvContent += 'Subsystem,Windows GUI\n';
      csvContent += 'Time Stamp,0x65F3A2B7 (2024-03-15 14:23:11)\n';
      csvContent += 'Checksum,0x0024A3F1\n\n';

      csvContent += 'PE Sections\n';
      csvContent += 'Section,Virtual Size,Virtual Address,Raw Size,Entropy,Flags\n';
      csvContent += '.text,0x00124000,0x00001000,0x00124000,6.4,"CODE EXECUTE READ"\n';
      csvContent += '.rdata,0x00042000,0x00125000,0x00042000,5.1,"INITIALIZED_DATA READ"\n';
      csvContent += '.data,0x00008000,0x00167000,0x00002000,3.2,"INITIALIZED_DATA READ WRITE"\n';
      csvContent += '.rsrc,0x00012000,0x0016F000,0x00012000,7.8,"INITIALIZED_DATA READ"\n';
      csvContent += '.reloc,0x00004000,0x00181000,0x00004000,6.7,"INITIALIZED_DATA DISCARDABLE READ"\n\n';

      // Imports Analysis
      csvContent += 'IMPORTS ANALYSIS (IAT)\n';
      csvContent += 'DLL,Function,Suspicious,Description\n';
      csvContent += 'kernel32.dll,VirtualAllocEx,Yes,Memory allocation in remote process\n';
      csvContent += 'kernel32.dll,WriteProcessMemory,Yes,Write to remote process memory\n';
      csvContent += 'kernel32.dll,CreateRemoteThread,Yes,Create thread in remote process\n';
      csvContent += 'kernel32.dll,GetProcAddress,Yes,Retrieve function address dynamically\n';
      csvContent += 'kernel32.dll,LoadLibraryA,Yes,Load DLL dynamically\n';
      csvContent += 'kernel32.dll,CreateProcessA,No,Create new process\n';
      csvContent += 'advapi32.dll,AdjustTokenPrivileges,Yes,Modify process privileges\n';
      csvContent += 'advapi32.dll,RegCreateKeyExA,Yes,Create registry key\n';
      csvContent += 'advapi32.dll,RegSetValueExA,Yes,Set registry value\n';
      csvContent += 'advapi32.dll,OpenProcessToken,Yes,Open process token\n';
      csvContent += 'ws2_32.dll,WSAStartup,No,Initialize Winsock\n';
      csvContent += 'ws2_32.dll,socket,No,Create socket\n';
      csvContent += 'ws2_32.dll,connect,No,Connect to remote host\n\n';

      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      const safeFilename = attachmentName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      link.setAttribute('href', url);
      link.setAttribute('download', `malware_analysis_${safeFilename}_${Date.now()}.csv`);
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