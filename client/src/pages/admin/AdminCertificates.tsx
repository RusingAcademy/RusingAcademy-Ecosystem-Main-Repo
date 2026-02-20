import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Award, Download, ExternalLink, Calendar, Users,
  FileText, RefreshCw,
} from "lucide-react";
import { useState } from "react";

import { useLanguage } from "@/contexts/LanguageContext";

const labels = {
  en: { title: "Admin Certificates", description: "Manage and configure admin certificates" },
  fr: { title: "Admin Certificates", description: "Gérer et configurer admin certificates" },
};

export default function AdminCertificates() {
  const { language } = useLanguage();
  const l = labels[language as keyof typeof labels] || labels.en;

  const [page, setPage] = useState(0);
  const limit = 20;

  const { data, isLoading, refetch } = trpc.certificates.adminGetAll.useQuery({
    limit,
    offset: page * limit,
  });

  const certs = data?.certificates || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const formatDate = (d: string | Date | null) => {
    if (!d) return "—";
    return new Date(d as string).toLocaleDateString("en-CA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Award className="h-8 w-8 text-teal-600" />
          <div>
            <h1 className="text-2xl font-bold">Certificates</h1>
            <p className="text-muted-foreground">
              {total} certificate{total !== 1 ? "s" : ""} issued
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Award className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Issued</p>
                <p className="text-2xl font-bold">{total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unique Recipients</p>
                <p className="text-2xl font-bold">
                  {new Set(certs.map(c => c.recipientName)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <FileText className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">With PDF</p>
                <p className="text-2xl font-bold">
                  {certs.filter(c => c.pdfUrl).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certificates Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Issued Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-12 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : certs.length === 0 ? (
            <div className="text-center py-6 md:py-8 lg:py-12 text-muted-foreground">
              <Award className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No certificates have been issued yet.</p>
              <p className="text-sm mt-1">Certificates are auto-generated when learners complete courses.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 font-medium">Certificate #</th>
                      <th className="pb-3 font-medium">Recipient</th>
                      <th className="pb-3 font-medium">Course</th>
                      <th className="pb-3 font-medium">Issued</th>
                      <th className="pb-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certs.map(cert => (
                      <tr key={cert.id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-3">
                          <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                            {cert.certificateNumber}
                          </code>
                        </td>
                        <td className="py-3 font-medium">{cert.recipientName}</td>
                        <td className="py-3 text-muted-foreground">{cert.courseName}</td>
                        <td className="py-3 text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(cert.completionDate)}
                          </div>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {cert.pdfUrl && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(cert.pdfUrl!, "_blank")}
                                title="Download PDF"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`/verify/${cert.certificateNumber}`, "_blank")}
                              title="Verify"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Showing {page * limit + 1}–{Math.min((page + 1) * limit, total)} of {total}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 0}
                      onClick={() => setPage(p => p - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages - 1}
                      onClick={() => setPage(p => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
