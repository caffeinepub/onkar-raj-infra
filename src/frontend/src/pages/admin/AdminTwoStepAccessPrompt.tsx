import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShieldCheck, Key } from 'lucide-react';

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
      setError(err.message || 'Verification failed. Please check your passkey.');
    }
  };

  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-2 flex justify-center">
            <ShieldCheck className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-center text-2xl">Admin Access Verification</CardTitle>
          <CardDescription className="text-center">
            Enter your passkey to unlock admin access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasskeySubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="passkey" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Passkey
              </Label>
              <Input
                id="passkey"
                type="password"
                placeholder="Enter your passkey"
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
                'Verify'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
