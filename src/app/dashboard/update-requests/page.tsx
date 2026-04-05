"use client";

import { useEffect, useState } from "react";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getStationUpdateRequests, approveStationUpdateRequest, rejectStationUpdateRequest } from "@/service/stations.service";
import useAsyncAction from "@/hooks/useAsyncAction";
import { toast } from "sonner";
import { axiosMessage } from "@/lib/axios-error";

type UpdateRequest = {
  id: number;
  stationId: number;
  stationName?: string;
  changes: Record<string, any>;
  status: "pending" | "approved" | "rejected";
  requestedBy: { id: number; name: string };
  createdAt: string;
};

export default function UpdateRequestsPage() {
  const fnGetRequests = useAsyncAction(getStationUpdateRequests);
  const fnApprove = useAsyncAction(approveStationUpdateRequest);
  const fnReject = useAsyncAction(rejectStationUpdateRequest);

  const [requests, setRequests] = useState<UpdateRequest[]>([]);

  const loadRequests = async () => {
    try {
      const data = await fnGetRequests.action({ status: "pending" });
      setRequests(data?.data || []);
    } catch (error) {
      toast.error(axiosMessage(error) ?? "Failed to load requests");
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (requestId: number) => {
    try {
      await fnApprove.action(requestId, "");
      toast.success("Request approved");
      loadRequests();
    } catch (error) {
      toast.error(axiosMessage(error) ?? "Failed to approve");
    }
  };

  const handleReject = async (requestId: number) => {
    try {
      await fnReject.action(requestId, "");
      toast.success("Request rejected");
      loadRequests();
    } catch (error) {
      toast.error(axiosMessage(error) ?? "Failed to reject");
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-6">
          <h1 className="font-salsa text-2xl font-semibold tracking-tight sm:text-3xl">
            Update Requests
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review and approve station update requests from users.
          </p>

          <div className="mt-8">
            {fnGetRequests.onLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : requests.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending requests.</p>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => (
                  <Card key={req.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            Station #{req.stationId} {req.stationName && `- ${req.stationName}`}
                          </CardTitle>
                          <CardDescription>
                            Requested by {req.requestedBy.name} • {new Date(req.createdAt).toLocaleString()}
                          </CardDescription>
                        </div>
                        <Badge variant={req.status === "pending" ? "outline" : req.status === "approved" ? "default" : "destructive"}>
                          {req.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Proposed changes:</p>
                        <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-40">
                          {JSON.stringify(req.changes, null, 2)}
                        </pre>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(req.id)}
                          disabled={fnApprove.onLoading || fnReject.onLoading}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(req.id)}
                          disabled={fnApprove.onLoading || fnReject.onLoading}
                        >
                          Reject
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <a href={`/stations/${req.stationId}`} target="_blank" rel="noopener noreferrer">
                            View Station
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}