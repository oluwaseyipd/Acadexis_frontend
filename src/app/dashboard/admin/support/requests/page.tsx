"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  Search,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
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
import { useAdminRequests, useApproveAdminRequest, useRejectAdminRequest } from "@/hooks/useAdmin";
import type { AdminRequest } from "@/types/admin";
import { UI_TEXT } from "@/lib/constants";

// Mock data for demonstration
const mockRequests: AdminRequest[] = [
  {
    id: "ar1",
    user: "u1",
    userName: "John Abiola",
    userEmail: "john.student@university.edu",
    reason: "I would like to help manage the Computer Science department courses and assist other students with technical issues. I have experience with peer tutoring and would like to contribute more to the community.",
    document_proof: null,
    status: "pending",
    created_at: "2026-03-11T10:00:00Z",
  },
  {
    id: "ar2",
    user: "u2",
    userName: "Mary Jane",
    userEmail: "mary.jane@university.edu",
    reason: "As a teaching assistant for the Mathematics department, I believe admin access would help me better coordinate course materials and manage student enrollments.",
    document_proof: "/documents/ta_approval.pdf",
    status: "pending",
    created_at: "2026-03-10T14:30:00Z",
  },
  {
    id: "ar3",
    user: "u3",
    userName: "James Smith",
    userEmail: "james.smith@university.edu",
    reason: "Interested in helping moderate the Study Lab discussions and ensure quality responses from the AI assistant.",
    document_proof: null,
    status: "approved",
    created_at: "2026-03-05T09:00:00Z",
  },
  {
    id: "ar4",
    user: "u4",
    userName: "Robert Brown",
    userEmail: "robert.brown@university.edu",
    reason: "Would like to help manage course uploads and organize the knowledge hub for the Physics department.",
    document_proof: null,
    status: "rejected",
    created_at: "2026-03-01T11:00:00Z",
  },
  {
    id: "ar5",
    user: "u5",
    userName: "David Wilson",
    userEmail: "david.wilson@university.edu",
    reason: "As a final year student with excellent academic standing, I want to give back to the community by helping manage course content and assist newer students.",
    document_proof: null,
    status: "pending",
    created_at: "2026-03-11T08:45:00Z",
  },
];

export default function AdminRequestsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(false);

  const status = statusFilter !== "all" ? (statusFilter as "pending" | "approved" | "rejected") : undefined;
  const { requests: fetchedRequests, loading: apiLoading, error, refetch } = useAdminRequests(status);
  const { approve, loading: approving } = useApproveAdminRequest();
  const { reject, loading: rejecting } = useRejectAdminRequest();

  useEffect(() => {
    if (error || (!apiLoading && !fetchedRequests)) {
      setUseMockData(true);
    }
  }, [error, apiLoading, fetchedRequests]);

  useEffect(() => {
    if (useMockData) {
      setLoading(false);
      setRequests(mockRequests);
    } else if (fetchedRequests) {
      setLoading(false);
      setRequests(fetchedRequests);
    }
  }, [useMockData, fetchedRequests]);

  const filteredRequests = requests.filter(
    (r) =>
      r.userName?.toLowerCase().includes(search.toLowerCase()) ||
      r.reason.toLowerCase().includes(search.toLowerCase())
  );

  const handleApprove = async (requestId: string) => {
    const success = await approve(requestId);
    if (success) {
      setRequests(requests.map((r) => (r.id === requestId ? { ...r, status: "approved" } : r)));
    }
  };

  const handleReject = async (requestId: string) => {
    const success = await reject(requestId);
    if (success) {
      setRequests(requests.map((r) => (r.id === requestId ? { ...r, status: "rejected" } : r)));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="max-w-[1500px] mx-auto px-8 py-8 flex flex-col gap-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Requests</h1>
          <p className="text-muted-foreground mt-1">
            Review and process user requests for admin privileges.
          </p>
        </div>
        {pendingCount > 0 && (
          <Badge variant="outline" className="self-start bg-warning/10 text-warning border-warning/20">
            {pendingCount} pending requests
          </Badge>
        )}
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Requests ({filteredRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading || apiLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50 text-success" />
              <p>No requests found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRequests.map((request, i) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border border-border rounded-xl p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center text-info shrink-0">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-medium text-foreground">{request.userName}</span>
                        <span className="text-sm text-muted-foreground">
                          ({request.userEmail})
                        </span>
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        <p className="line-clamp-3">{request.reason}</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(request.created_at).toLocaleDateString()}
                        </span>
                        {request.document_proof && (
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            Document attached
                          </span>
                        )}
                      </div>
                    </div>
                    {request.status === "pending" && (
                      <div className="flex gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(request.id)}
                          disabled={rejecting}
                          className="text-destructive border-destructive/20 hover:bg-destructive/10"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleApprove(request.id)}
                          disabled={approving}
                          className="bg-success hover:bg-success/90"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
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