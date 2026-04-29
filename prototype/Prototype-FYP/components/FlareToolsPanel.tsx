import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { StringsAnalysis } from './StringsAnalysis';
import { CapabilitiesAnalysis } from './CapabilitiesAnalysis';
import { PEAnalysis } from './PEAnalysis';
import { RemediationPanel } from './RemediationPanel';
import { OSINTPanel } from './OSINTpanel';
import { SenderInfoPanel } from './SenderInfoPanel';

import {
  Code2,
  Layers,
  FileCode,
  ShieldAlert,
  Globe,
  Mail
} from 'lucide-react';

import type {
  FileHash,
  ThreatLevel,
  PEHeader,
  PESection,
  Capability,
  ExtractedString,
  OfficeMailboxItem
} from '../types/analysis';

interface FlareToolsPanelProps {
  attachmentName: string;
  fileHash: FileHash;
  threatLevel: ThreatLevel;
  suspicious: boolean;

  // real structured data (not just string[])
  extractedStrings: ExtractedString[];
  capabilities?: Capability[];

  peHeaders?: PEHeader | null;
  peSections?: PESection[];

  mailboxItem?: OfficeMailboxItem | null;
}

export function FlareToolsPanel({
  attachmentName,
  fileHash,
  threatLevel,
  suspicious,
  extractedStrings,
  capabilities = [],
  peHeaders = null,
  peSections = [],
  mailboxItem = null
}: FlareToolsPanelProps) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-foreground">FLARE Tools Analysis</h2>
        <p className="text-sm text-muted-foreground">
          Static analysis results from FLARE toolset
        </p>
      </div>

      <Tabs defaultValue="strings" className="w-full">

        {/* UPDATED TAB GRID (added sender tab = 7 tabs total) */}
        <TabsList className="grid grid-cols-7 w-full">

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

          {/* NEW */}
          <TabsTrigger value="sender" className="gap-1 text-xs">
            <Mail className="w-3 h-3" />
            Sender
          </TabsTrigger>

          <TabsTrigger value="osint" className="gap-1 text-xs">
            <Globe className="w-3 h-3" />
            OSINT
          </TabsTrigger>

          <TabsTrigger value="remediation" className="gap-1 text-xs">
            <ShieldAlert className="w-3 h-3" />
            Remidiation
          </TabsTrigger>

        </TabsList>

        {/* Strings */}
        <TabsContent value="strings" className="mt-4">
          <StringsAnalysis strings={extractedStrings} />
        </TabsContent>

        {/* CAPA */}
        <TabsContent value="capabilities" className="mt-4">
          <CapabilitiesAnalysis capabilities={capabilities} />
        </TabsContent>

        {/* PE */}
        <TabsContent value="pe" className="mt-4">
          <PEAnalysis headers={peHeaders} sections={peSections} />
        </TabsContent>

        {/* NEW: Sender Info */}
        <TabsContent value="sender" className="mt-4">
          <SenderInfoPanel mailboxItem={mailboxItem} />
        </TabsContent>

        {/* OSINT */}
        <TabsContent value="osint" className="mt-4">
          <OSINTPanel
            fileHash={fileHash}
            extractedStrings={extractedStrings.map(s => s.value)}
          />
        </TabsContent>

        {/* Remediation */}
        <TabsContent value="remediation" className="mt-4">
          <RemediationPanel
            threatLevel={threatLevel}
            suspicious={suspicious}
          />
        </TabsContent>

      </Tabs>
    </div>
  );
}