# Final Year Project

Official website - https://analysit.neocities.org

## Email Attachment Analyzer - Outlook Add-in

## Overview
This is an Outlook add-in built with React + TypeScript that integrates FLARE tools for static malware analysis of email attachments.

## Technology Stack
- **Frontend**: React + TypeScript (TSX)
- **Office Integration**: Office.js API
- **UI**: Tailwind CSS + shadcn/ui components
- **Backend** (to be implemented): Node.js/Python API running FLARE tools

## How It Works

### Current Implementation (Frontend)
1. Uses Office.js to access Outlook context and email attachments
2. Lists available attachments from the current email
3. Allows user to select an attachment for analysis
4. Displays mock analysis results in user-friendly format


#### Backend Flow:
1. **Receive Attachment Data**: Get attachment content from Office.js
2. **Upload to Sandbox**: Send file to isolated analysis environment
3. **Run FLARE Tools**:
   - `file` command for file type identification
   - `pefile` for PE structure analysis
   - `FLOSS` (FireEye Labs Obfuscated String Solver) for string extraction
   - `CAPA` for capability detection
   - Custom scripts for hash calculation, entropy analysis
4. **Parse Results**: Convert CLI output to JSON
5. **Return to Frontend**: Display in user-friendly interface

## Office.js Integration

### Key APIs Used:
```javascript
// Initialize Office
Office.onReady(() => {
  // Access current email
  const item = Office.context.mailbox.item;
  
  // Get attachments
  const attachments = item.attachments;
  
  // Get attachment content
  item.getAttachmentContentAsync(attachmentId, (result) => {
    // Send to backend for analysis
  });
});
```

## File Structure
```
/App.tsx                          # Main component with Office.js integration
/hooks/useOfficeContext.ts        # Custom hook for Office.js initialization
/components/
  - AttachmentSelector.tsx        # Lists and selects attachments
  - AnalysisOverview.tsx          # Shows file hashes, type, threat level
  - FlareToolsPanel.tsx           # Tabs for different FLARE tools
  - StringsAnalysis.tsx           # FLOSS output display
  - CapabilitiesAnalysis.tsx      # CAPA results (MITRE ATT&CK)
  - PEAnalysis.tsx                # PE structure information
  - ImportsAnalysis.tsx           # IAT analysis
/manifest.xml                     # Outlook add-in manifest
```

## Development vs Production

### Development Mode (Current):
- Runs in browser without Office.js
- Uses mock attachment data
- Shows UI and workflow

### Production Mode (Real Outlook):
1. Serve app over HTTPS (required by Office.js)
2. Load manifest.xml into Outlook
3. Office.js provides real email context
4. Connect to backend API for actual analysis

## In progress

### 1. Backend API Development
 Python (recommended for FLARE tools):
```python
# Example Flask API
from flask import Flask, request, jsonify
import pefile
import subprocess

@app.route('/analyze', methods=['POST'])
def analyze_file():
    file_data = request.files['file']
    
    # Run FLARE tools
    floss_output = run_floss(file_data)
    capa_output = run_capa(file_data)
    pe_info = analyze_pe(file_data)
    
    return jsonify({
        'strings': floss_output,
        'capabilities': capa_output,
        'pe_structure': pe_info
    })
```

### 2. Security Considerations
- Run analysis in Docker container or VM
- Never execute attachments directly
- Implement rate limiting
- Add authentication for API
- Sanitize all inputs

### 3. Testing Strategy
- Use both Outlook Desktop and Outlook Web
- Test with various file types (.exe, .dll, .docm, .pdf)
- Validate against known malware samples 

### 4. Deployment
- Host frontend on HTTPS server (required)
- Deploy backend to cloud (AWS, Azure, GCP)
- Configure CORS for Office.js

### Outlook (Current Choice)
Full Office.js API for attachments  
Better for enterprise environments  
Rich add-in framework  
Desktop + Web support  

## Resources
- [Office.js Documentation](https://learn.microsoft.com/en-us/office/dev/add-ins/)
- [FLARE Tools](https://github.com/mandiant/flare-vm)
- [CAPA Documentation](https://github.com/mandiant/capa)
- [FLOSS](https://github.com/mandiant/flare-floss)

