import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  Shield, 
  AlertTriangle, 
  Trash2, 
  Ban, 
  Network,
  Lock,
  Eye,
  Server,
  CheckCircle2
} from 'lucide-react';
import type { ThreatLevel, RemediationRecommendation } from '../types/analysis';

interface RemediationPanelProps {
  threatLevel: ThreatLevel;
  suspicious: boolean;
}

export function RemediationPanel({ threatLevel, suspicious }: RemediationPanelProps) {
  const getRecommendations = (): RemediationRecommendation[] => {
    const recommendations: RemediationRecommendation[] = [];

    // Immediate actions based on threat level
    if (threatLevel === 'critical' || threatLevel === 'high') {
      recommendations.push({
        priority: 'critical',
        icon: Ban,
        category: 'Immediate Action Required',
        actions: [
          'Delete the email and attachment immediately',
          'Do NOT open, download, or execute this file',
          'Report this email to your IT security team or SOC',
          'Check if other users received similar emails',
          'Scan your system with updated antivirus software'
        ]
      });
    }

    // Email handling recommendations
    recommendations.push({
      priority: threatLevel === 'critical' || threatLevel === 'high' ? 'high' : 'medium',
      icon: Trash2,
      category: 'Email Handling',
      actions: [
        'Move email to quarantine or junk folder',
        'Block sender email address',
        'Create email filter rule to block similar messages',
        'Report as phishing to email provider',
        suspicious ? 'Do not reply or forward this email' : 'Exercise caution with this email'
      ]
    });

    // Detected threats and countermeasures
    if (suspicious) {
      recommendations.push({
        priority: 'high',
        icon: Shield,
        category: 'Detected Threats & Countermeasures',
        actions: [
          'Process Injection detected: Ensure EDR/endpoint protection is active',
          'Persistence mechanisms found: Review startup items and scheduled tasks',
          'Defense evasion techniques: Update antivirus signatures and enable real-time protection',
          'C2 communication capabilities: Monitor network traffic for suspicious connections',
          'Privilege escalation attempts: Ensure users operate with least privilege'
        ]
      });
    }

    // Network security
    if (threatLevel === 'critical' || threatLevel === 'high') {
      recommendations.push({
        priority: 'high',
        icon: Network,
        category: 'Network Security',
        actions: [
          'Block identified malicious domains at firewall/proxy level',
          'Review network logs for communication with suspicious IPs',
          'Enable DNS filtering to block known malicious domains',
          'Monitor for unusual outbound connections',
          'Consider network segmentation to limit lateral movement'
        ]
      });
    }

    // System hardening
    recommendations.push({
      priority: 'medium',
      icon: Lock,
      category: 'System Hardening',
      actions: [
        'Ensure Windows Defender or endpoint protection is up to date',
        'Enable tamper protection on security software',
        'Disable macros in Office applications by default',
        'Keep operating system and all software patched',
        'Enable User Account Control (UAC) at highest level'
      ]
    });

    // Monitoring and detection
    recommendations.push({
      priority: 'medium',
      icon: Eye,
      category: 'Monitoring & Detection',
      actions: [
        'Check system logs for signs of compromise',
        'Monitor for new scheduled tasks or services',
        'Review registry changes in persistence locations',
        'Look for unusual process behavior or network connections',
        'Enable audit logging for security events'
      ]
    });

    // User awareness
    recommendations.push({
      priority: 'low',
      icon: CheckCircle2,
      category: 'User Awareness & Prevention',
      actions: [
        'Verify sender authenticity before opening attachments',
        'Be suspicious of unexpected attachments, even from known senders',
        'Hover over links to verify actual destination before clicking',
        'Use sandboxed environments for analyzing suspicious files',
        'Attend security awareness training on phishing and malware'
      ]
    });

    // Incident response
    if (threatLevel === 'critical' || threatLevel === 'high') {
      recommendations.push({
        priority: 'high',
        icon: Server,
        category: 'Incident Response',
        actions: [
          'Document all details of the suspicious email',
          'Preserve email headers and metadata for analysis',
          'Save hash values for threat intelligence sharing',
          'Check VirusTotal or other threat intelligence platforms',
          'Consider forensic analysis if system compromise suspected'
        ]
      });
    }

    return recommendations;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-600 bg-red-50';
      case 'high': return 'border-orange-600 bg-orange-50';
      case 'medium': return 'border-yellow-600 bg-yellow-50';
      default: return 'border-blue-600 bg-blue-50';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical': return <Badge variant="destructive">CRITICAL</Badge>;
      case 'high': return <Badge variant="destructive" className="bg-orange-600">HIGH</Badge>;
      case 'medium': return <Badge variant="default">MEDIUM</Badge>;
      default: return <Badge variant="secondary">LOW</Badge>;
    }
  };

  const recommendations = getRecommendations();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          Remediation Recommendations
        </CardTitle>
        <CardDescription>
          Security actions and best practices based on analysis results
        </CardDescription>
      </CardHeader>
      <CardContent>
        {(threatLevel === 'critical' || threatLevel === 'high') && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>High-Risk Malware Detected</AlertTitle>
            <AlertDescription>
              This file poses a significant security threat. Follow the remediation steps immediately.
            </AlertDescription>
          </Alert>
        )}

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {recommendations.map((rec, index) => {
              const Icon = rec.icon;
              return (
                <div 
                  key={index}
                  className={`border-l-4 rounded-lg p-4 ${getPriorityColor(rec.priority)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <h3 className="text-sm">{rec.category}</h3>
                    </div>
                    {getPriorityBadge(rec.priority)}
                  </div>
                  
                  <ul className="space-y-2 ml-6">
                    {rec.actions.map((action, actionIndex) => (
                      <li key={actionIndex} className="text-xs list-disc">
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> These recommendations are based on static analysis. 
            Dynamic analysis in a controlled sandbox environment may reveal additional threats. 
            Always follow your organization's security policies and incident response procedures.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}