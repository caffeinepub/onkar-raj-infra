import { useGetAllMessages } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, AlertCircle } from 'lucide-react';

export default function AdminMessagesPage() {
  const { data: messages, isLoading, error } = useGetAllMessages();

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp)).toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Messages</CardTitle>
        <CardDescription>View all contact form messages</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error.message || 'Failed to load messages. Please ensure you are logged in and have admin access.'}
            </AlertDescription>
          </Alert>
        ) : messages && messages.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell className="font-medium">{message.name}</TableCell>
                    <TableCell>{message.phone}</TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell>{message.subject}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="line-clamp-2" title={message.message}>
                        {message.message}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatDate(message.timestamp)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Mail className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium text-muted-foreground">No messages yet</p>
            <p className="text-sm text-muted-foreground">
              Contact form messages will appear here once submitted
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
