import { useEffect, useState } from 'react';
import type { OfficeMailboxItem, OutlookAttachment } from '../types/analysis';

declare global {
  interface Window {
    Office?: any;
  }
}

interface OfficeContextReturn {
  isOfficeInitialized: boolean;
  mailboxItem: OfficeMailboxItem | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook for Office.js context initialization
 * Handles both production (real Outlook) and development (preview) modes
 */
export function useOfficeContext(): OfficeContextReturn {
  const [isOfficeInitialized, setIsOfficeInitialized] = useState(false);
  const [mailboxItem, setMailboxItem] = useState<OfficeMailboxItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Office.js is available (real Outlook environment)
    if (typeof window !== 'undefined' && window.Office) {
      window.Office.onReady(() => {
        try {
          setIsOfficeInitialized(true);
          
          if (window.Office.context?.mailbox?.item) {
            const item = window.Office.context.mailbox.item;
            
            // Convert Office.js attachments to our typed format
            const attachments: OutlookAttachment[] = item.attachments?.map((att: any) => ({
              id: att.id,
              name: att.name,
              size: att.size,
              contentType: att.contentType,
              isInline: att.isInline
            })) || [];
            
            setMailboxItem({
              attachments,
              subject: item.subject,
              from: item.from ? {
                displayName: item.from.displayName,
                emailAddress: item.from.emailAddress
              } : undefined,
              internetMessageId: item.internetMessageId
            });
          }
          
          setIsLoading(false);
        } catch (err) {
          console.error('Error initializing Office context:', err);
          setError('Failed to initialize Office add-in');
          setIsLoading(false);
        }
      });
    } else {
      // Development/preview mode - simulate Office being ready
      console.log('Running in preview mode (Office.js not available)');
      setIsOfficeInitialized(true);
      
      // Mock mailbox item for development
      const mockAttachments: OutlookAttachment[] = [
        { 
          id: 'att1', 
          name: 'invoice_2024.exe', 
          size: 2359296, 
          contentType: 'application/x-msdownload'
        },
        { 
          id: 'att2', 
          name: 'document.docm', 
          size: 159744, 
          contentType: 'application/vnd.ms-word.document.macroEnabled.12'
        },
        { 
          id: 'att3', 
          name: 'report.pdf', 
          size: 913408, 
          contentType: 'application/pdf'
        },
      ];
      
      setMailboxItem({
        attachments: mockAttachments,
        subject: 'Important Document - Please Review',
        from: {
          displayName: 'John Doe',
          emailAddress: 'john.doe@example.com'
        }
      });
      
      setIsLoading(false);
    }
  }, []);

  return { isOfficeInitialized, mailboxItem, isLoading, error };
}