import type { AnalysisData } from "../types/analysis";

interface PDFAnalysisProps {
  metadata?: any;
  objects?: any;
  suspicious: AnalysisData["suspicious"];
}

export function PDFAnalysis({
  metadata,
  objects,
  suspicious
}: PDFAnalysisProps) {
  return (
    <div>
      <h3>PDF Analysis</h3>

      <pre>
        {JSON.stringify(metadata, null, 2)}
      </pre>

      <pre>
        {JSON.stringify(objects, null, 2)}
      </pre>

      <pre>
        {JSON.stringify(suspicious.pdf_features, null, 2)}
      </pre>

      <pre>
        {JSON.stringify(suspicious.pdfid_flags, null, 2)}
      </pre>
    </div>
  );
}