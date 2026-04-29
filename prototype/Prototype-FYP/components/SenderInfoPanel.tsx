import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Mail, User, Hash } from 'lucide-react';
import type { OfficeMailboxItem } from '../types/analysis';

interface Props {
  mailboxItem?: OfficeMailboxItem | null;
}

export function SenderInfoPanel({ mailboxItem }: Props) {

  const from = mailboxItem?.from;

  const messageId = mailboxItem?.internetMessageId;

  if (!from && !messageId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Sender Info</CardTitle>
          <CardDescription>Email metadata extraction</CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            No email metadata available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Sender Info</CardTitle>
        <CardDescription>Email metadata extraction</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">

        {/* Sender */}
        <div className="flex items-start gap-2">
          <User className="w-4 h-4 mt-1 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">
              {from?.displayName || 'Unknown sender'}
            </p>
            <p className="text-xs text-muted-foreground">
              {from?.emailAddress || 'No email address'}
            </p>
          </div>
        </div>

        {/* Message ID */}
        <div className="flex items-start gap-2">
          <Hash className="w-4 h-4 mt-1 text-muted-foreground" />
          <div className="text-xs break-all">
            {messageId || 'No message ID'}
          </div>
        </div>

        {/* Quick risk hint */}
        <div className="pt-2">
          <Badge variant="secondary">
            Mailbox metadata {from ? 'available' : 'missing'}
          </Badge>
        </div>

      </CardContent>
    </Card>
  );
}