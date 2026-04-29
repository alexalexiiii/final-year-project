import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Mail, User, Globe, ShieldCheck, Hash } from 'lucide-react';
import type { OfficeMailboxItem, EmailContext } from '../types/analysis';

interface Props {
  mailboxItem?: OfficeMailboxItem | null;
  email?: EmailContext;
}

export function SenderInfoPanel({ mailboxItem, email }: Props) {

  const from = mailboxItem?.from;

  const senderEmail =
    from?.emailAddress ||
    email?.fromEmail ||
    '';

  const senderDomain =
    email?.senderDomain ||
    (senderEmail.includes('@') ? senderEmail.split('@')[1] : undefined);

  const isExternal = email?.isExternal ?? true;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          Email Security Analysis
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-xs">

        {/* Sender */}
        <div>
          <span>Sender Information</span>
          <p className="font-medium text-sm">
            {from?.displayName || email?.from || 'Unknown Sender'}
          </p>
          <p className="text-muted-foreground">
            {senderEmail || 'No sender email detected'}
          </p>
        </div>

        {/* Domain + External/Internal */}
      
        <div className="flex items-center gap-2">
          <span>Sender Domain</span>
          <Globe className="w-4 h-4 text-muted-foreground" />
          <span className="font-mono">
            {senderDomain || 'unknown-domain'}
          </span>

          <Badge variant={isExternal ? 'destructive' : 'default'}>
            {isExternal ? 'External' : 'Internal'}
          </Badge>
        </div>

        {/* Auth results */}
        <div className="space-y-1 border-t pt-2">

          <div className="flex justify-between">
            <span>SPF</span>
            <Badge variant={email?.spf === 'pass' ? 'default' : 'destructive'}>
              {email?.spf?.toUpperCase() || 'UNKNOWN'}
            </Badge>
          </div>

          <div className="flex justify-between">
            <span>DKIM</span>
            <Badge variant={email?.dkim === 'pass' ? 'default' : 'destructive'}>
              {email?.dkim?.toUpperCase() || 'UNKNOWN'}
            </Badge>
          </div>

          <div className="flex justify-between">
            <span>DMARC</span>
            <Badge variant={email?.dmarc === 'pass' ? 'default' : 'destructive'}>
              {email?.dmarc?.toUpperCase() || 'UNKNOWN'}
            </Badge>
          </div>

        </div>

        {/* Routing */}
        <div className="border-t pt-2 space-y-1">

          {email?.to && (
            <div>
              <span className="text-muted-foreground">To:</span> {email.to.join(', ')}
            </div>
          )}

          {email?.cc && (
            <div>
              <span className="text-muted-foreground">CC:</span> {email.cc.join(', ')}
            </div>
          )}

          {email?.bcc && (
            <div>
              <span className="text-muted-foreground">BCC:</span> {email.bcc.join(', ')}
            </div>
          )}

        </div>

        {/* Message ID */}
        <div className="border-t pt-2 font-mono break-all text-muted-foreground">
          {email?.messageId || mailboxItem?.internetMessageId || 'No Message-ID'}
        </div>

      </CardContent>
    </Card>
  );
}