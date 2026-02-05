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

 <Card>
        <CardHeader>
          <CardTitle className="text-sm">Average Response Time</CardTitle>
          <CardDescription>Time to first response</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <span className="text-2xl">2.3 hrs</span>
            </div>
            <Badge variant="secondary" className="gap-1">
              <TrendingDown className="w-3 h-3" />
              -0.5 hrs
            </Badge>
          </div>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Email Volume</CardTitle>
          <CardDescription>This week vs last week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Received</span>
              </div>
              <span>342</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Sent</span>
              </div>
              <span>156</span>
            </div>
          </div>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Top Contacts</CardTitle>
          <CardDescription>Most frequent email exchanges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Sarah Johnson', count: 24 },
              { name: 'Michael Chen', count: 18 },
              { name: 'Emily Rodriguez', count: 15 },
              { name: 'David Kim', count: 12 },
            ].map((contact, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm">{contact.name}</span>
                </div>
                <Badge variant="outline">{contact.count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}