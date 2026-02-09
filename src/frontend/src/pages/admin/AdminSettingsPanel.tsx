import { useState, useEffect } from 'react';
import { useGetSiteSettings, useUpdateSiteSettings } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

export default function AdminSettingsPanel() {
  const { data: settings, isLoading } = useGetSiteSettings();
  const updateSettings = useUpdateSiteSettings();

  const [certifications, setCertifications] = useState('');
  const [contactDetails, setContactDetails] = useState('');
  const [googleMapEmbed, setGoogleMapEmbed] = useState('');
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [pricingTableText, setPricingTableText] = useState('');

  useEffect(() => {
    if (settings) {
      setCertifications(settings.certifications || '');
      setContactDetails(settings.contactDetails || '');
      setGoogleMapEmbed(settings.googleMapEmbed || '');
      setWhatsappEnabled(!!settings.whatsappConfig);
      setWhatsappPhone(settings.whatsappConfig?.phoneNumber || '');
      setWhatsappMessage(settings.whatsappConfig?.prefilledMessage || '');
      
      const pricingText = settings.pricingTable
        .map(([diameter, price]) => `${diameter}:${price}`)
        .join('\n');
      setPricingTableText(pricingText);
    }
  }, [settings]);

  const handleSave = async () => {
    if (!settings) return;

    try {
      const pricingTable: Array<[string, number]> = pricingTableText
        .split('\n')
        .filter((line) => line.trim())
        .map((line) => {
          const parts = line.split(':');
          if (parts.length !== 2) return null;
          const diameter = parts[0].trim();
          const price = parseFloat(parts[1].trim());
          if (!diameter || isNaN(price)) return null;
          return [diameter, price] as [string, number];
        })
        .filter((entry): entry is [string, number] => entry !== null);

      await updateSettings.mutateAsync({
        companyName: settings.companyName,
        certifications: certifications.trim(),
        contactDetails: contactDetails.trim(),
        googleMapEmbed: googleMapEmbed.trim(),
        whatsappConfig: whatsappEnabled && whatsappPhone.trim()
          ? {
              phoneNumber: whatsappPhone.trim(),
              prefilledMessage: whatsappMessage.trim() || undefined,
            }
          : undefined,
        pricingTable,
      });

      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    }
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Site Settings</CardTitle>
          <CardDescription>
            Manage certifications, contact details, and other site-wide settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="certifications">Certifications / Standards</Label>
            <Input
              id="certifications"
              placeholder="e.g., ISO 4427, BIS Certified"
              value={certifications}
              onChange={(e) => setCertifications(e.target.value)}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="contactDetails">Contact Details</Label>
            <Textarea
              id="contactDetails"
              placeholder="Address, phone, email..."
              value={contactDetails}
              onChange={(e) => setContactDetails(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="googleMapEmbed">Google Maps Embed Code</Label>
            <Textarea
              id="googleMapEmbed"
              placeholder='<iframe src="..." ...></iframe>'
              value={googleMapEmbed}
              onChange={(e) => setGoogleMapEmbed(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Paste the full iframe embed code from Google Maps
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">WhatsApp Configuration</h3>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="whatsappEnabled"
                checked={whatsappEnabled}
                onChange={(e) => setWhatsappEnabled(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="whatsappEnabled">Enable WhatsApp Button</Label>
            </div>
            {whatsappEnabled && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="whatsappPhone">Phone Number</Label>
                  <Input
                    id="whatsappPhone"
                    placeholder="e.g., +919876543210"
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsappMessage">Prefilled Message (Optional)</Label>
                  <Textarea
                    id="whatsappMessage"
                    placeholder="Hello, I would like to inquire..."
                    value={whatsappMessage}
                    onChange={(e) => setWhatsappMessage(e.target.value)}
                    rows={2}
                  />
                </div>
              </>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="pricingTable">Pricing Table</Label>
            <Textarea
              id="pricingTable"
              placeholder="20mm:50&#10;25mm:65&#10;32mm:80"
              value={pricingTableText}
              onChange={(e) => setPricingTableText(e.target.value)}
              rows={6}
            />
            <p className="text-xs text-muted-foreground">
              Format: diameter:price (one per line, e.g., "50mm:120")
            </p>
          </div>

          <Button
            onClick={handleSave}
            disabled={updateSettings.isPending}
            className="w-full"
          >
            {updateSettings.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
