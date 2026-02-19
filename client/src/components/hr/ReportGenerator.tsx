// client/src/components/hr/ReportGenerator.tsx — Phase 4: HR PDF Report Generation UI
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocale } from "@/i18n/LocaleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Clock, Loader2, Trash2 } from "lucide-react";

const REPORT_TYPES = [
  { value: "candidates", labelEn: "Candidate Report", labelFr: "Rapport des candidats" },
  { value: "interviews", labelEn: "Interview Report", labelFr: "Rapport des entrevues" },
  { value: "onboarding", labelEn: "Onboarding Report", labelFr: "Rapport d'intégration" },
  { value: "compliance", labelEn: "Compliance Report", labelFr: "Rapport de conformité" },
  { value: "team", labelEn: "Team Report", labelFr: "Rapport d'équipe" },
] as const;

export default function ReportGenerator() {
  const { locale } = useLocale();
  const isFr = locale === "fr";
  const utils = trpc.useUtils();

  const [reportType, setReportType] = useState<string>("candidates");
  const [dateStart, setDateStart] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split("T")[0];
  });
  const [dateEnd, setDateEnd] = useState(() => new Date().toISOString().split("T")[0]);

  const { data: history, isLoading: historyLoading } = trpc.hrReports.history.useQuery({ limit: 20 });

  const generateMutation = trpc.hrReports.generate.useMutation({
    onSuccess: () => utils.hrReports.history.invalidate(),
  });

  const handleGenerate = () => {
    generateMutation.mutate({
      type: reportType as any,
      dateRange: { start: dateStart, end: dateEnd },
      locale: locale as "en" | "fr",
    });
  };

  return (
    <div className="space-y-6">
      {/* Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {isFr ? "Générer un rapport" : "Generate Report"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-sm font-medium mb-1 block">{isFr ? "Type de rapport" : "Report Type"}</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {REPORT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{isFr ? t.labelFr : t.labelEn}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">{isFr ? "Date début" : "Start Date"}</label>
              <Input type="date" value={dateStart} onChange={(e) => setDateStart(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">{isFr ? "Date fin" : "End Date"}</label>
              <Input type="date" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} />
            </div>
            <Button onClick={handleGenerate} disabled={generateMutation.isPending}>
              {generateMutation.isPending ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{isFr ? "Génération..." : "Generating..."}</>
              ) : (
                <><FileText className="h-4 w-4 mr-2" />{isFr ? "Générer" : "Generate"}</>
              )}
            </Button>
          </div>

          {generateMutation.isSuccess && generateMutation.data && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">
                  {isFr ? "Rapport généré avec succès !" : "Report generated successfully!"}
                </p>
                <p className="text-sm text-green-600 dark:text-green-300">ID: {generateMutation.data.id}</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href={generateMutation.data.downloadPath} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />{isFr ? "Télécharger" : "Download"}
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {isFr ? "Historique des rapports" : "Report History"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : !history || history.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {isFr ? "Aucun rapport généré" : "No reports generated yet"}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">{isFr ? "Type" : "Type"}</th>
                    <th className="text-left py-2">{isFr ? "Période" : "Period"}</th>
                    <th className="text-left py-2">{isFr ? "Langue" : "Language"}</th>
                    <th className="text-left py-2">{isFr ? "Créé le" : "Created"}</th>
                    <th className="text-right py-2">{isFr ? "Actions" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((report: any) => (
                    <tr key={report.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-2">
                        <Badge variant="outline">{report.type}</Badge>
                      </td>
                      <td className="py-2 text-xs">
                        {new Date(report.dateRangeStart).toLocaleDateString()} — {new Date(report.dateRangeEnd).toLocaleDateString()}
                      </td>
                      <td className="py-2">{report.locale?.toUpperCase()}</td>
                      <td className="py-2 text-xs">{new Date(report.createdAt).toLocaleString()}</td>
                      <td className="py-2 text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`/api/reports/download/${report.id}`} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
