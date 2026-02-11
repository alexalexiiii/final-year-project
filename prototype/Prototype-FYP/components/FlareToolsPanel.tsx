import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { StringsAnalysis } from './StringsAnalysis';
import { CapabilitiesAnalysis } from './CapabilitiesAnalysis';
import { PEAnalysis } from './PEAnalysis';
import { ImportsAnalysis } from './ImportsAnalysis';
import { RemediationPanel } from './RemediationPanel';
import { Code2, Layers, FileCode, Download, ShieldAlert } from 'lucide-react';
import type { FileHash, ThreatLevel } from '../types/analysis';

interface FlareToolsPanelProps {
  attachmentName: string;
  fileHash: FileHash;
  threatLevel: ThreatLevel;
  suspicious: boolean;
}

export function FlareToolsPanel({ attachmentName, fileHash, threatLevel, suspicious }: FlareToolsPanelProps) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-foreground">FLARE Tools Analysis</h2>
        <p className="text-sm text-muted-foreground">Static analysis results from FLARE toolset</p>
      </div>

      <Tabs defaultValue="strings" className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="strings" className="gap-1 text-xs">
            <Code2 className="w-3 h-3" />
            Strings
          </TabsTrigger>
          <TabsTrigger value="capabilities" className="gap-1 text-xs">
            <Layers className="w-3 h-3" />
            Capa
          </TabsTrigger>
          <TabsTrigger value="pe" className="gap-1 text-xs">
            <FileCode className="w-3 h-3" />
            PE Info
          </TabsTrigger>
          <TabsTrigger value="imports" className="gap-1 text-xs">
            <Download className="w-3 h-3" />
            Imports
          </TabsTrigger>
          <TabsTrigger value="remediation" className="gap-1 text-xs">
            <ShieldAlert className="w-3 h-3" />
            Remediation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="strings" className="mt-4">
          <StringsAnalysis />
        </TabsContent>

        <TabsContent value="capabilities" className="mt-4">
          <CapabilitiesAnalysis />
        </TabsContent>

        <TabsContent value="pe" className="mt-4">
          <PEAnalysis />
        </TabsContent>

        <TabsContent value="imports" className="mt-4">
          <ImportsAnalysis />
        </TabsContent>

        <TabsContent value="remediation" className="mt-4">
          <RemediationPanel threatLevel={threatLevel} suspicious={suspicious} />
        </TabsContent>
      </Tabs>
    </div>
  );
}