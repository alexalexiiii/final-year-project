import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { ScrollArea } from "./ui/scroll-area"

import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Globe,
  Server,
  Link,
  Hash,
  RefreshCw,
  AlertCircle
} from "lucide-react"

import type { OSINTData, FileHash } from "../types/analysis"
import { performOSINTAnalysis } from "../services/osintService"

interface OSINTPanelProps {
  fileHash: FileHash
  extractedStrings: string[]
}

export function OSINTPanel({ fileHash, extractedStrings }: OSINTPanelProps) {

  const [osintData, setOsintData] = useState<OSINTData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadOSINTData = async () => {

    setLoading(true)
    setError(null)

    try {

      const data = await performOSINTAnalysis(
        fileHash,
        extractedStrings
      )

      setOsintData(data)

    } catch (err) {

      console.error("OSINT error:", err)
      setError("Failed to retrieve threat intelligence data.")

    } finally {

      setLoading(false)

    }
  }

  useEffect(() => {
    loadOSINTData()
  }, [fileHash, extractedStrings])


  if (loading) {

    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin text-primary mb-3"/>
            <p className="text-sm text-muted-foreground">
              Querying threat intelligence feeds...
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }


  if (error) {

    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4"/>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>

        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={loadOSINTData}
        >
          <RefreshCw className="w-3 h-3 mr-1"/>
          Retry
        </Button>

      </Alert>
    )
  }


  if (!osintData) return null


  const getThreatScore = () => {

    let score = 0

    if (osintData.virustotal) {

      const rate =
        osintData.virustotal.positives /
        osintData.virustotal.total

      score += rate * 40
    }

    const highRiskIPs =
      osintData.abuseipdb.filter(
        ip => ip.abuseConfidenceScore > 50
      )

    score += highRiskIPs.length * 15

    const maliciousURLs =
      osintData.urlscan.filter(
        url => url.verdict.malicious
      )

    score += maliciousURLs.length * 20

    return Math.min(100, Math.round(score))
  }


  const threatScore = getThreatScore()


  const getThreatLevel = (score: number) => {

    if (score >= 75)
      return { label: "Critical", variant: "destructive", icon: AlertTriangle }

    if (score >= 50)
      return { label: "High", variant: "destructive", icon: AlertTriangle }

    if (score >= 25)
      return { label: "Medium", variant: "secondary", icon: AlertCircle }

    return { label: "Low", variant: "default", icon: CheckCircle2 }
  }

  const threat = getThreatLevel(threatScore)
  const ThreatIcon = threat.icon


  return (
    <div className="space-y-4">


      {/* Threat Score */}

      <Card>

        <CardHeader>

          <div className="flex items-center justify-between">

            <div>

              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5"/>
                Threat Intelligence
              </CardTitle>

              <CardDescription>
                External OSINT threat feeds
              </CardDescription>

            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={loadOSINTData}
            >
              <RefreshCw className="w-3 h-3 mr-1"/>
              Refresh
            </Button>

          </div>

        </CardHeader>


        <CardContent>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">

            <div className="flex items-center gap-3">

              <ThreatIcon className="w-6 h-6 text-destructive"/>

              <div>

                <p className="font-medium">
                  Threat Score
                </p>

                <p className="text-xs text-muted-foreground">
                  Last updated:
                  {" "}
                  {new Date(osintData.lastUpdated).toLocaleString()}
                </p>

              </div>

            </div>

            <div className="text-right">

              <div className="text-2xl font-bold">
                {threatScore}/100
              </div>

              <Badge variant={threat.variant as any}>
                {threat.label} Risk
              </Badge>

            </div>

          </div>

        </CardContent>

      </Card>



      {/* Tabs */}

      <Tabs defaultValue="virustotal">

        <TabsList className="grid grid-cols-4 w-full">

          <TabsTrigger value="virustotal">
            <Shield className="w-3 h-3 mr-1"/>
            VirusTotal
          </TabsTrigger>

          <TabsTrigger value="ips">
            <Server className="w-3 h-3 mr-1"/>
            IPs
          </TabsTrigger>

          <TabsTrigger value="urls">
            <Link className="w-3 h-3 mr-1"/>
            URLs
          </TabsTrigger>

          <TabsTrigger value="iocs">
            <Hash className="w-3 h-3 mr-1"/>
            IOCs
          </TabsTrigger>

        </TabsList>


        {/* VirusTotal */}

        <TabsContent value="virustotal">

          <Card>

            <CardHeader>

              <CardTitle>
                VirusTotal Results
              </CardTitle>

              <CardDescription>
                Antivirus detections
              </CardDescription>

            </CardHeader>


            <CardContent>

              {osintData.virustotal ? (

                <ScrollArea className="h-[300px] border rounded-lg p-3">

                  {osintData.virustotal.detections.map((d, i) => (

                    <div
                      key={i}
                      className="flex justify-between border-b py-2"
                    >

                      <div className="flex items-center gap-2">

                        {d.detected ? (
                          <AlertTriangle className="w-4 h-4 text-destructive"/>
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-green-500"/>
                        )}

                        <span className="text-sm">
                          {d.vendor}
                        </span>

                      </div>

                      <span className="text-xs text-muted-foreground">
                        {d.result || "Clean"}
                      </span>

                    </div>

                  ))}

                </ScrollArea>

              ) : (

                <p className="text-sm text-muted-foreground text-center py-4">
                  No VirusTotal data
                </p>

              )}

            </CardContent>

          </Card>

        </TabsContent>


        {/* IPs */}

        <TabsContent value="ips">

          <Card>

            <CardHeader>
              <CardTitle>IP Intelligence</CardTitle>
            </CardHeader>

            <CardContent>

              {osintData.abuseipdb.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No IPs detected
                </p>
              ) : (

                osintData.abuseipdb.map((ip, i) => (

                  <div
                    key={i}
                    className="border rounded-lg p-3 mb-2"
                  >

                    <div className="flex justify-between">

                      <span className="font-mono">
                        {ip.ipAddress}
                      </span>

                      <Badge
                        variant={
                          ip.abuseConfidenceScore > 50
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {ip.abuseConfidenceScore}%
                      </Badge>

                    </div>

                    <p className="text-xs text-muted-foreground">
                      {ip.isp} • {ip.countryCode}
                    </p>

                  </div>

                ))

              )}

            </CardContent>

          </Card>

        </TabsContent>


        {/* URLs */}

        <TabsContent value="urls">

          <Card>

            <CardHeader>
              <CardTitle>URL Intelligence</CardTitle>
            </CardHeader>

            <CardContent>

              {osintData.urlscan.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No URLs detected
                </p>
              ) : (

                osintData.urlscan.map((u, i) => (

                  <div
                    key={i}
                    className="border rounded-lg p-3 mb-2"
                  >

                    <div className="flex justify-between">

                      <span className="text-sm break-all">
                        {u.url}
                      </span>

                      {u.verdict.malicious && (
                        <Badge variant="destructive">
                          Malicious
                        </Badge>
                      )}

                    </div>

                  </div>

                ))

              )}

            </CardContent>

          </Card>

        </TabsContent>


        {/* IOCs */}

        <TabsContent value="iocs">

          <Card>

            <CardHeader>
              <CardTitle>
                Indicators of Compromise
              </CardTitle>
              <CardDescription>
                Extracted from file strings
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">

              <div>

                <p className="font-medium">
                  IP Addresses ({osintData.extractedIOCs.ips.length})
                </p>

                {osintData.extractedIOCs.ips.length === 0
                  ? "None found"
                  : osintData.extractedIOCs.ips.join(", ")}

              </div>


              <div>

                <p className="font-medium">
                  URLs ({osintData.extractedIOCs.urls.length})
                </p>

                {osintData.extractedIOCs.urls.length === 0
                  ? "None found"
                  : osintData.extractedIOCs.urls.join(", ")}

              </div>


              <div>

                <p className="font-medium">
                  Domains ({osintData.extractedIOCs.domains.length})
                </p>

                {osintData.extractedIOCs.domains.length === 0
                  ? "None found"
                  : osintData.extractedIOCs.domains.join(", ")}

              </div>


              <div>

                <p className="font-medium">
                  Emails ({osintData.extractedIOCs.emails.length})
                </p>

                {osintData.extractedIOCs.emails.length === 0
                  ? "None found"
                  : osintData.extractedIOCs.emails.join(", ")}

              </div>

            </CardContent>

          </Card>

        </TabsContent>


      </Tabs>

    </div>
  )
}