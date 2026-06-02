"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Search,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useIssueReports, useResolveReport } from "@/hooks/useAdmin";
import type { IssueReport } from "@/types/admin";
import { UI_TEXT } from "@/lib/constants";

// Mock data for demonstration
const mockReports: IssueReport[] = [
  {
    id: "ir1",
    user: "u1",
    userName: "John Abiola",
    title: "PDF not loading correctly",
    description: "When I try to open the lecture 8 PDF, it shows a blank page. I've tried clearing my cache and using different browsers but the issue persists.",
    severity: "high",
    resolved: false,
    created_at: "2026-03-11T08:00:00Z",
  },
  {
    id: "ir2",
    user: "u2",
    userName: "Mary Jane",
    title: "Quiz submission failed",
    description: "I submitted my quiz but got an error message. However, when I checked, it showed as submitted. Not sure if my answers were saved.",
    severity: "medium",
    resolved: false,
    created_at: "2026-03-10T15:30:00Z",
  },
  {
    id: "ir3",
    user: "u4",
    userName: "Robert Brown",
    title: "Can't find logout button",
    description: "The logout option seems to be missing from the sidebar on mobile. Had to clear my cookies to log out.",
    severity: "low",
    resolved: true,
    created_at: "2026-03-09T12:00:00Z",
  },
  {
    id: "ir4",
    user: null,
    userName: "Anonymous",
    title: "Feature suggestion: Offline mode",
    description: "Would be great to have an offline mode for studying without internet. Even just for the reading materials.",
    severity: "low",
    resolved: false,
    created_at: "2026-03-08T18:20:00Z",
  },
  {
    id: "ir5",
    user: "u5",
    userName: "David Wilson",
    title: "Critical: Data loss concern",
    description: "My study session history seems to have been deleted. I had extensive notes and now they're gone. This is very concerning for a learning platform.",
    severity: "critical",
    resolved: false,
    created_at: "2026-03-11T11:00:00Z",
  },
];

export default function AdminReportsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [reports, setReports] = useState<IssueReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(false);

  const resolved = statusFilter === "resolved" ? true : statusFilter === "unresolved" ? false : undefined;
  const { reports: fetchedReports, loading: apiLoading, error, refetch } = useIssueReports(resolved);
  const { resolve, loading: resolving } = useResolveReport();

  useEffect(() => {
    if (error || (!apiLoading && !fetchedReports)) {
      setUseMockData(true);
    }
  }, [error, apiLoading, fetchedReports]);

  useEffect(() => {
    if (useMockData) {
      setLoading(false);
      setReports(mockReports);
    } else if (fetchedReports) {
      setLoading(false);
      setReports(fetchedReports);
    }
  }, [useMockData, fetchedReports]);

  const filteredReports = reports.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleResolve = async (reportId: string) => {
    const success = await resolve(reportId);
    if (success) {
      setReports(reports.map((r) => (r.id === reportId ? { ...r, resolved: true } : r)));
    }
  };

  const getSeverityBadge = (severity: string) => {
    const colors: Record<string, string> = {
      critical: "bg-destructive/10 text-destructive border-destructive/20",
      high: "bg-warning/10 text-warning border-warning/20",
      medium: "bg-info/10 text-info border-info/20",
      low: "bg-muted text-muted-foreground",
    };
    return (
      <Badge className={colors[severity] || "bg-muted text-muted-foreground"}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    );
  };

  const unresolvedCount = reports.filter((r) => !r.resolved).length;
  const criticalCount = reports.filter((r) => r.severity === "critical" && !r.resolved).length;

  return (
    <div className="max-w-[1500px] mx-auto px-8 py-8 flex flex-col gap-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Issue Reports</h1>
          <p className="text-muted-foreground mt-1">
            Review and resolve user-reported issues.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
            {unresolvedCount} unresolved
          </Badge>
          {criticalCount > 0 && (
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
              {criticalCount} critical
            </Badge>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="unresolved">Unresolved</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Reports ({filteredReports.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading || apiLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50 text-success" />
              <p>No reports found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReports.map((report, i) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border border-border rounded-xl p-4"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        report.resolved
                          ? "bg-success/10 text-success"
                          : report.severity === "critical"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {report.resolved ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <AlertTriangle className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-medium text-foreground">{report.title}</span>
                        {getSeverityBadge(report.severity)}
                        {report.resolved && (
                          <Badge className="bg-success/10 text-success border-success/20">
                            Resolved
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {report.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {report.userName || "Anonymous"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(report.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {!report.resolved && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResolve(report.id)}
                        disabled={resolving}
                        className="shrink-0"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Resolve
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}