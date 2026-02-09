import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShieldCheck, Key } from 'lucide-react';

interface AdminTwoStepAccessPromptProps {
  onPasskeySubmit: (passkey: string) => Promise<void>;
  isProcessing: boolean;
}

export default function AdminTwoStepAccessPrompt({
  onPasskeySubmit,
  isProcessing,
}: AdminTwoStepAccessPromptProps) {
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');

  const handlePasskeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedPasskey = passkey.trim();
    if (!trimmedPasskey) {
      setError('Please enter the admin passkey.');
      return;
    }

    try {
      await onPasskeySubmit(trimmedPasskey);
      setError('');
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-2 flex justify-center">
            <ShieldCheck className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-center text-2xl">Admin Access</CardTitle>
          <CardDescription className="text-center">
            Enter your passkey to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handlePasskeySubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="passkey" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Admin Passkey
              </Label>
              <Input
                id="passkey"
                type="password"
                placeholder="Enter admin passkey"
                value={passkey}
                onChange={(e) => {
                  setPasskey(e.target.value);
                  setError('');
                }}
                disabled={isProcessing}
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                className="w-full"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={isProcessing || !passkey.trim()} className="w-full">
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Unlock Admin Access'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
