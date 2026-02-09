import { useState } from 'react';
import { useGetAllEnquiries, useConfirmEnquiry, useRejectEnquiry } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2, FileText, CheckCircle, XCircle } from 'lucide-react';
import { OrderType } from '../../backend';
import { toast } from 'sonner';

export default function AdminEnquiriesPanel() {
  const { data: enquiries, isLoading } = useGetAllEnquiries();
  const confirmMutation = useConfirmEnquiry();
  const rejectMutation = useRejectEnquiry();

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<string | null>(null);

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp)).toLocaleString();
  };

  const handleConfirmClick = (enquiryId: string) => {
    setSelectedEnquiryId(enquiryId);
    setConfirmDialogOpen(true);
  };

  const handleRejectClick = (enquiryId: string) => {
    setSelectedEnquiryId(enquiryId);
    setRejectDialogOpen(true);
  };

  const handleConfirmEnquiry = async () => {
    if (!selectedEnquiryId) return;

    try {
      await confirmMutation.mutateAsync(selectedEnquiryId);
      toast.success('Enquiry confirmed successfully');
      setConfirmDialogOpen(false);
      setSelectedEnquiryId(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to confirm enquiry');
    }
  };

  const handleRejectEnquiry = async () => {
    if (!selectedEnquiryId) return;

    try {
      await rejectMutation.mutateAsync(selectedEnquiryId);
      toast.success('Enquiry rejected and removed');
      setRejectDialogOpen(false);
      setSelectedEnquiryId(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject enquiry');
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Enquiries</CardTitle>
          <CardDescription>View all order and quote requests</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            </div>
          ) : enquiries && enquiries.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Diameter</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>File</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enquiries.map((enquiry) => (
                    <TableRow key={enquiry.id}>
                      <TableCell className="font-medium">{enquiry.customerName}</TableCell>
                      <TableCell>{enquiry.phoneNumber || '-'}</TableCell>
                      <TableCell>{enquiry.email || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={enquiry.orderType === OrderType.placeOrder ? 'default' : 'secondary'}>
                          {enquiry.orderType === OrderType.placeOrder ? 'Order' : 'Quote'}
                        </Badge>
                      </TableCell>
                      <TableCell>{enquiry.pipeDiameter}</TableCell>
                      <TableCell>{enquiry.quantity.toString()}m</TableCell>
                      <TableCell>
                        {enquiry.requirementsFile ? (
                          <FileText className="h-4 w-4 text-primary" />
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(enquiry.timestamp)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleConfirmClick(enquiry.id)}
                            disabled={confirmMutation.isPending || rejectMutation.isPending}
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectClick(enquiry.id)}
                            disabled={confirmMutation.isPending || rejectMutation.isPending}
                          >
                            <XCircle className="mr-1 h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              No enquiries yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Confirm Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Enquiry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to confirm this enquiry? The enquiry will remain in the list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={confirmMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmEnquiry} disabled={confirmMutation.isPending}>
              {confirmMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirming...
                </>
              ) : (
                'Confirm'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Enquiry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this enquiry? This action cannot be undone and the enquiry will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={rejectMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectEnquiry}
              disabled={rejectMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {rejectMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                'Reject'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
