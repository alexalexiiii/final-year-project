import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { StringsAnalysis } from './StringsAnalysis';
import { CapabilitiesAnalysis } from './CapabilitiesAnalysis';
import { PEAnalysis } from './PEAnalysis';
import { RemediationPanel } from './RemediationPanel';
import { OSINTPanel } from './OSINTpanel';
import { SenderInfoPanel } from './SenderInfoPanel';
import { PDFAnalysis } from './PDFInformationPanel';

import {
  Code2,
  Layers,
  FileCode,
  ShieldAlert,
  Globe,
  Mail,
  FileText
} from 'lucide-react';

import type {
  FileHash,
  ThreatLevel,
  PEHeader,
  PESection,
  Capability,
  ExtractedString,
  OfficeMailboxItem,
  SuspiciousData
} from '../types/analysis';

interface FlareToolsPanelProps {
  attachmentName: string;
  fileHash: FileHash;
  threatLevel: ThreatLevel;
  suspicious: SuspiciousData;

  extractedStrings: ExtractedString[];
  capabilities?: Capability[];

  peHeaders?: PEHeader | null;
  peSections?: PESection[];

  mailboxItem?: OfficeMailboxItem | null;

  // OPTIONAL: add these for PDF support
  pdfMetadata?: any;
  pdfObjects?: any[];
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
  mailboxItem = null,
  pdfMetadata = null,
  pdfObjects = []
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

        {/* UPDATED GRID (now 8 tabs) */}
        <TabsList className="grid grid-cols-8 w-full">

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

          {/* NEW PDF TAB */}
          <TabsTrigger value="pdf" className="gap-1 text-xs">
            <FileText className="w-3 h-3" />
            PDF
          </TabsTrigger>

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
            Remediation Actions
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

        {/* NEW PDF PANEL */}
        <TabsContent value="pdf" className="mt-4">
          <PDFAnalysis
            metadata={pdfMetadata}
            objects={pdfObjects}
            suspicious={suspicious}
          />
        </TabsContent>

        {/* Sender */}
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