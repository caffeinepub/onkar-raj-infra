import { useGetAllEnquiries } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText } from 'lucide-react';
import { OrderType } from '../../backend';

export default function AdminEnquiriesPanel() {
  const { data: enquiries, isLoading } = useGetAllEnquiries();

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp)).toLocaleString();
  };

  return (
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
  );
}
