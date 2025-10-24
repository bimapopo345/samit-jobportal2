"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

interface VerificationActionsProps {
  organizationId: string;
  currentStatus: string;
}

export function VerificationActions({ 
  organizationId, 
  currentStatus 
}: VerificationActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [action, setAction] = useState<"verify" | "reject" | null>(null);

  const handleAction = async () => {
    if (!action) return;
    
    setLoading(true);
    const supabase = createClient();

    try {
      const newStatus = action === "verify" ? "verified" : "rejected";
      
      const { error } = await supabase
        .from("organizations")
        .update({
          verification_status: newStatus,
          verification_notes: notes,
          verified_at: action === "verify" ? new Date().toISOString() : null,
        })
        .eq("id", organizationId);

      if (error) throw error;

      // Log activity
      await supabase.from("activity_logs").insert({
        action: `organization_${action}`,
        target_type: "organization",
        target_id: organizationId,
        meta: { notes },
      });

      setDialogOpen(false);
      setNotes("");
      router.refresh();
    } catch (error) {
      console.error("Verification error:", error);
      alert("Terjadi kesalahan saat memperbarui status verifikasi");
    } finally {
      setLoading(false);
    }
  };

  if (currentStatus === "verified") {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle className="h-4 w-4" />
        <span className="text-sm font-medium">Organization Verified</span>
      </div>
    );
  }

  if (currentStatus === "rejected") {
    return (
      <div className="flex gap-2">
        <span className="text-sm text-red-600 font-medium">Organization Rejected</span>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setAction("verify")}
            >
              Re-verify
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Re-verify Organization</DialogTitle>
              <DialogDescription>
                This will mark the organization as verified and allow them to post jobs.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about this verification..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAction}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Verify
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {/* Verify Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            size="sm" 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setAction("verify")}
          >
            <CheckCircle className="mr-1 h-4 w-4" />
            Verify
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Organization</DialogTitle>
            <DialogDescription>
              This will mark the organization as verified and allow them to post jobs.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="verify-notes">Notes (Optional)</Label>
              <Textarea
                id="verify-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this verification..."
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setNotes("");
                  setAction(null);
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAction}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirm Verification
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            size="sm" 
            variant="destructive"
            onClick={() => setAction("reject")}
          >
            <XCircle className="mr-1 h-4 w-4" />
            Reject
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Organization</DialogTitle>
            <DialogDescription>
              This will reject the organization's verification. They will not be able to post jobs.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reject-notes">Reason for Rejection *</Label>
              <Textarea
                id="reject-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                rows={3}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setNotes("");
                  setAction(null);
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAction}
                disabled={loading || !notes.trim()}
                variant="destructive"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    Confirm Rejection
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
