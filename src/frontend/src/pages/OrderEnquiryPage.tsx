import { useEffect, useState } from 'react';
import { useSubmitEnquiry, useGetPriceForDiameter } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

  const submitEnquiry = useSubmitEnquiry();
  const { data: estimatedPrice } = useGetPriceForDiameter(pipeDiameter);

  useEffect(() => {
    document.title = 'Order / Enquiry - Onkar Raj Infra';
  }, []);

  const diameters = [
    '20mm', '25mm', '32mm', '40mm', '50mm', '63mm', '75mm', '90mm',
    '110mm', '125mm', '140mm', '160mm', '180mm'
  ];

  const quantityNum = parseInt(quantity);
  const isBelowMinimum = quantity !== '' && !isNaN(quantityNum) && quantityNum < MINIMUM_ORDER_QUANTITY;

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
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      toast.error('Failed to submit request. Please try again.');
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pipeDiameter">Pipe Diameter *</Label>
              <Select value={pipeDiameter} onValueChange={setPipeDiameter}>
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
                min={MINIMUM_ORDER_QUANTITY}
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              {isBelowMinimum && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>Minimum Order Quantity- {MINIMUM_ORDER_QUANTITY} meters</span>
                </div>
              )}
            </div>

            {estimatedPrice && quantity && (
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">Estimated Price</p>
                <p className="text-2xl font-bold">
                  ₹{(estimatedPrice * parseInt(quantity || '0')).toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  (₹{estimatedPrice.toFixed(2)} per meter)
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="file">Requirements File (Optional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file"
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="flex-1"
                />
                {file && <Upload className="h-4 w-4 text-primary" />}
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="text-sm text-muted-foreground">
                  Uploading: {uploadProgress}%
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => handleSubmit(OrderType.placeOrder)}
                disabled={submitEnquiry.isPending || isBelowMinimum}
                className="flex-1"
              >
                {submitEnquiry.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Place Order'
                )}
              </Button>
              <Button
                onClick={() => handleSubmit(OrderType.requestQuote)}
                disabled={submitEnquiry.isPending || isBelowMinimum}
                variant="outline"
                className="flex-1"
              >
                {submitEnquiry.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
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
