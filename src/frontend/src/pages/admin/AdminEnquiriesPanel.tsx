import { useGetAllEnquiries } from '../../hooks/useQueries';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AdminEnquiriesPanel() {
  const { data: enquiries, isLoading, error } = useGetAllEnquiries();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error.message || 'Failed to load enquiries. Please try again.'}
        </AlertDescription>
      </Alert>
    );
  }

  if (!enquiries || enquiries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Enquiries</CardTitle>
          <CardDescription>No enquiries received yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Enquiries</CardTitle>
        <CardDescription>View and manage customer enquiries</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Diameter</TableHead>
                <TableHead>Quantity (m)</TableHead>
                <TableHead>File</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enquiries.map((enquiry) => (
                <TableRow key={enquiry.id}>
                  <TableCell className="whitespace-nowrap">
                    {new Date(Number(enquiry.timestamp)).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{enquiry.customerName}</TableCell>
                  <TableCell>{enquiry.phoneNumber}</TableCell>
                  <TableCell>{enquiry.email}</TableCell>
                  <TableCell>
                    {enquiry.orderType === 'placeOrder' ? 'Place Order' : 'Request Quote'}
                  </TableCell>
                  <TableCell>{enquiry.pipeDiameter}</TableCell>
                  <TableCell>{Number(enquiry.quantity).toLocaleString()}</TableCell>
                  <TableCell>
                    {enquiry.requirementsFile ? (
                      <FileText className="h-4 w-4 text-primary" />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
