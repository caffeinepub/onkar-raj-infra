import { useEffect, useState } from 'react';
import { useSubmitEnquiry, useGetPriceForDiameter } from '../hooks/useQueries';
import { useActor } from '../hooks/useActor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { ExternalBlob, OrderType } from '../backend';
import { Loader2, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

const MINIMUM_ORDER_QUANTITY = 2000;

export default function OrderEnquiryPage() {
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [pipeDiameter, setPipeDiameter] = useState('');
  const [quantity, setQuantity] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [connectionChecked, setConnectionChecked] = useState(false);

  const actorState = useActor();
  const actor = actorState.actor;
  const isFetching = actorState.isFetching;
  const submitEnquiry = useSubmitEnquiry();
  const { data: estimatedPrice } = useGetPriceForDiameter(pipeDiameter);

  useEffect(() => {
    document.title = 'Order / Enquiry - Onkar Raj Infra';
  }, []);

  // Check connection status after initial load
  useEffect(() => {
    if (!isFetching && !connectionChecked) {
      setConnectionChecked(true);
    }
  }, [isFetching, connectionChecked]);

  const diameters = [
    '20mm', '25mm', '32mm', '40mm', '50mm', '63mm', '75mm', '90mm',
    '110mm', '125mm', '140mm', '160mm', '180mm', '200mm'
  ];

  const quantityNum = parseInt(quantity);
  const isBelowMinimum = quantity !== '' && !isNaN(quantityNum) && quantityNum < MINIMUM_ORDER_QUANTITY;

  const isConnecting = isFetching && !actor;
  const isConnectionError = connectionChecked && !actor && !isFetching;
  const isFormDisabled = isConnecting || isConnectionError || submitEnquiry.isPending;

  const handleSubmit = async (orderType: OrderType) => {
    if (!customerName.trim() || !phoneNumber.trim() || !email.trim() || !pipeDiameter || !quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    if (quantityNum < MINIMUM_ORDER_QUANTITY) {
      toast.error(`Minimum order quantity is ${MINIMUM_ORDER_QUANTITY} meters`);
      return;
    }

    try {
      let requirementsFile: ExternalBlob | undefined;
      if (file) {
        const bytes = new Uint8Array(await file.arrayBuffer());
        requirementsFile = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      }

      await submitEnquiry.mutateAsync({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
        pipeDiameter,
        quantity: BigInt(quantityNum),
        requirementsFile,
        orderType,
        timestamp: BigInt(Date.now()),
      });

      setSubmitted(true);
      toast.success(
        orderType === OrderType.placeOrder
          ? 'Order request submitted successfully!'
          : 'Quote request submitted successfully!'
      );

      // Reset form
      setTimeout(() => {
        setCustomerName('');
        setPhoneNumber('');
        setEmail('');
        setPipeDiameter('');
        setQuantity('');
        setFile(null);
        setUploadProgress(0);
        setSubmitted(false);
      }, 3000);
    } catch (error: any) {
      console.error('Error submitting enquiry:', error);
      toast.error(error.message || 'Failed to submit request. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="py-12 md:py-16">
        <div className="container">
          <Card className="mx-auto max-w-md text-center">
            <CardContent className="pt-12 pb-12">
              <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-600" />
              <h2 className="mb-2 text-2xl font-bold">Request Submitted!</h2>
              <p className="text-muted-foreground">
                Thank you for your enquiry. We will get back to you shortly.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-16">
      <div className="container">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Order / Enquiry</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Submit your order or request a quote for HDPE pipes. We'll respond promptly with pricing and availability.
          </p>
        </div>

        {isConnectionError && (
          <Alert variant="destructive" className="mx-auto max-w-2xl mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Unable to connect to the service. Please refresh the page and try again.
            </AlertDescription>
          </Alert>
        )}

        {isConnecting && (
          <Alert className="mx-auto max-w-2xl mb-6">
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Connecting to the service...
            </AlertDescription>
          </Alert>
        )}

        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Submit Your Request</CardTitle>
            <CardDescription>
              Fill in the details below to place an order or request a quote
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="customerName">Your Name *</Label>
              <Input
                id="customerName"
                placeholder="Enter your name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                disabled={isFormDisabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isFormDisabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isFormDisabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pipeDiameter">Pipe Diameter *</Label>
              <Select value={pipeDiameter} onValueChange={setPipeDiameter} disabled={isFormDisabled}>
                <SelectTrigger id="pipeDiameter">
                  <SelectValue placeholder="Select diameter" />
                </SelectTrigger>
                <SelectContent>
                  {diameters.map((diameter) => (
                    <SelectItem key={diameter} value={diameter}>
                      {diameter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (meters) *</Label>
              <Input
                id="quantity"
                type="number"
                placeholder={`Minimum ${MINIMUM_ORDER_QUANTITY} meters`}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min={MINIMUM_ORDER_QUANTITY}
                disabled={isFormDisabled}
              />
              {isBelowMinimum && (
                <p className="text-sm text-destructive">
                  Minimum order quantity is {MINIMUM_ORDER_QUANTITY} meters
                </p>
              )}
              {estimatedPrice && quantity && !isBelowMinimum && (
                <p className="text-sm text-muted-foreground">
                  Estimated price: ₹{(estimatedPrice * quantityNum).toLocaleString('en-IN')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Requirements File (Optional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file"
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  disabled={isFormDisabled}
                  className="flex-1"
                />
                {file && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFile(null)}
                    disabled={isFormDisabled}
                  >
                    Clear
                  </Button>
                )}
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-1">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Uploading: {uploadProgress}%</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => handleSubmit(OrderType.placeOrder)}
                disabled={isFormDisabled || isBelowMinimum}
                className="flex-1"
              >
                {submitEnquiry.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Place Order'
                )}
              </Button>
              <Button
                onClick={() => handleSubmit(OrderType.requestQuote)}
                disabled={isFormDisabled || isBelowMinimum}
                variant="outline"
                className="flex-1"
              >
                {submitEnquiry.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Request Quote'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
