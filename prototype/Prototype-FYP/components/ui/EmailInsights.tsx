import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, Clock, Mail, Users } from 'lucide-react';

export function EmailInsights() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-foreground mb-1">Email Insights</h2>
        <p className="text-sm text-muted-foreground">Your email activity this week</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Response Rate</CardTitle>
          <CardDescription>Emails responded to within 24 hours</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl">87%</span>
            <Badge variant="default" className="gap-1">
              <TrendingUp className="w-3 h-3" />
              +5%
            </Badge>
          </div>
          <Progress value={87} />
        </CardContent>
      </Card>
