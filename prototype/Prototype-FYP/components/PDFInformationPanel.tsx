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
  const pdfFeatures = suspicious?.pdf_features ?? {};
  const pdfFlags = suspicious?.pdfid_flags ?? {};

  return (
    <div>
      <h3>PDF Analysis</h3>

      {/*   
         METADATA
      */}
      <div>
        <h4>Metadata</h4>

        {metadata && Object.keys(metadata).length > 0 ? (
          <ul>
            {Object.entries(metadata).map(([key, value]) => (
              <li key={key}>
                {key}: {String(value)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No metadata available</p>
        )}
      </div>

      {/*   
         OBJECTS
      */}
      <div>
        <h4>Objects</h4>

        {objects && Object.keys(objects).length > 0 ? (
          <ul>
            {Object.entries(objects).map(([key, value]) => (
              <li key={key}>
                {key}: {String(value)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No object data available</p>
        )}
      </div>

      {/*   
         PDF FEATURES (PDFiD)
      */}
      <div>
        <h4>PDF Features (PDFiD)</h4>

        <ul>
          <li>JavaScript: {pdfFeatures.javascript ?? 0}</li>
          <li>OpenAction: {pdfFeatures.open_action ?? 0}</li>
          <li>Launch: {pdfFeatures.launch ?? 0}</li>
          <li>Embedded File: {pdfFeatures.embedded_file ?? 0}</li>
          <li>AcroForm: {pdfFeatures.acroform ?? 0}</li>
          <li>RichMedia: {pdfFeatures.rich_media ?? 0}</li>
        </ul>
      </div>

      {/*   
         PDFiD FLAGS
      */}
      <div>
        <h4>PDFiD Flags</h4>

        {pdfFlags && Object.keys(pdfFlags).length > 0 ? (
          <ul>
            {Object.entries(pdfFlags).map(([key, value]) => (
              <li key={key}>
                {key}: {String(value)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No PDFiD flags detected</p>
        )}
      </div>
    </div>
  );
}