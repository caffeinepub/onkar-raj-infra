import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShieldCheck, Key, LogIn, CheckCircle2 } from 'lucide-react';

interface AdminTwoStepAccessPromptProps {
  onLogin: () => Promise<void>;
  onVerify: (passkey: string) => Promise<void>;
  isLoggingIn: boolean;
  isVerifying: boolean;
  isAuthenticated: boolean;
}

export default function AdminTwoStepAccessPrompt({
  onLogin,
  onVerify,
  isLoggingIn,
  isVerifying,
  isAuthenticated,
}: AdminTwoStepAccessPromptProps) {
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLoginClick = async () => {
    setLoginError('');
    try {
      await onLogin();
    } catch (err: any) {
      setLoginError(err.message || 'Failed to login. Please try again.');
    }
  };

  const handlePasskeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedPasskey = passkey.trim();
    if (!trimmedPasskey) {
      setError('Please enter the admin passkey.');
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
            Two-step verification required
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Login with Internet Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${isAuthenticated ? 'bg-green-600 text-white' : 'bg-muted text-muted-foreground'}`}>
                {isAuthenticated ? <CheckCircle2 className="h-4 w-4" /> : '1'}
              </div>
              <Label className="text-base font-semibold">Login with Internet Identity</Label>
            </div>
            
            {!isAuthenticated ? (
              <>
                <p className="text-sm text-muted-foreground pl-8">
                  First, authenticate using your Internet Identity to verify your admin role.
                </p>
                {loginError && (
                  <Alert variant="destructive" className="ml-8">
                    <AlertDescription>{loginError}</AlertDescription>
                  </Alert>
                )}
                <div className="pl-8">
                  <Button
                    onClick={handleLoginClick}
                    disabled={isLoggingIn}
                    className="w-full"
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Login with Internet Identity
                      </>
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <div className="pl-8">
                <Alert className="border-green-600 bg-green-50 dark:bg-green-950">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    Successfully authenticated
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>

          {/* Step 2: Enter Passkey */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${isAuthenticated ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                2
              </div>
              <Label className="text-base font-semibold">Enter Admin Passkey</Label>
            </div>

            {isAuthenticated ? (
              <>
                <p className="text-sm text-muted-foreground pl-8">
                  Now enter the admin passkey to unlock the dashboard.
                </p>
                <form onSubmit={handlePasskeySubmit} className="space-y-4 pl-8">
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

                  <Button type="submit" disabled={isVerifying || !passkey.trim()} className="w-full">
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
              </>
            ) : (
              <p className="text-sm text-muted-foreground pl-8">
                Complete step 1 to proceed
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
