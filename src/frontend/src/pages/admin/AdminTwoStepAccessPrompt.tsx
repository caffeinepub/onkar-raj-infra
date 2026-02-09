import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShieldCheck, Key, Info } from 'lucide-react';

interface AdminTwoStepAccessPromptProps {
  onVerify: (passkey: string) => Promise<void>;
  isVerifying: boolean;
}

export default function AdminTwoStepAccessPrompt({
  onVerify,
  isVerifying,
}: AdminTwoStepAccessPromptProps) {
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');

  const handlePasskeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedPasskey = passkey.trim();
    if (!trimmedPasskey) {
      setError('Please enter the passkey.');
      return;
    }

    try {
      await onVerify(trimmedPasskey);
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
            Enter the admin passkey to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 rounded-lg bg-muted p-3">
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <p>
                Internet Identity login is not required for admin access. Only the passkey is needed.
              </p>
            </div>
          </div>

          <form onSubmit={handlePasskeySubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="passkey" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Passkey
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
                disabled={isVerifying}
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

            <Button type="submit" disabled={isVerifying} className="w-full">
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
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
