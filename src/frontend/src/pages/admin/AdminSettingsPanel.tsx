import { useState, useEffect } from 'react';
import { useGetSiteSettings, useUpdateSiteSettings } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { SiteSettings } from '../../backend';

export default function AdminSettingsPanel() {
  const { data: settings, isLoading } = useGetSiteSettings();
  const updateSettingsMutation = useUpdateSiteSettings();

  const [formData, setFormData] = useState<SiteSettings>({
    companyName: '',
    contactLocation: '',
    contactEmail: '',
    contactPhone: '',
    googleMapEmbed: '',
    whatsappConfig: undefined,
    pricingTable: [],
    certifications: '',
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateSettingsMutation.mutateAsync(formData);
    } catch (error: any) {
      console.error('Failed to update settings:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Settings</CardTitle>
        <CardDescription>Manage company information and site configuration</CardDescription>
      </CardHeader>
      <CardContent>
        {updateSettingsMutation.error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {updateSettingsMutation.error.message || 'Failed to update settings'}
            </AlertDescription>
          </Alert>
        )}

        {updateSettingsMutation.isSuccess && (
          <Alert className="mb-4">
            <AlertDescription>Settings updated successfully!</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                disabled={updateSettingsMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactLocation">Contact Location</Label>
              <Input
                id="contactLocation"
                value={formData.contactLocation}
                onChange={(e) => setFormData({ ...formData, contactLocation: e.target.value })}
                disabled={updateSettingsMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                disabled={updateSettingsMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                disabled={updateSettingsMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="certifications">Certifications</Label>
              <Textarea
                id="certifications"
                value={formData.certifications}
                onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                disabled={updateSettingsMutation.isPending}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="googleMapEmbed">Google Maps Embed Code</Label>
              <Textarea
                id="googleMapEmbed"
                placeholder="Paste Google Maps embed iframe code here"
                value={formData.googleMapEmbed}
                onChange={(e) => setFormData({ ...formData, googleMapEmbed: e.target.value })}
                disabled={updateSettingsMutation.isPending}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsappPhone">WhatsApp Phone Number</Label>
              <Input
                id="whatsappPhone"
                placeholder="+919876543210"
                value={formData.whatsappConfig?.phoneNumber || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    whatsappConfig: {
                      phoneNumber: e.target.value,
                      prefilledMessage: formData.whatsappConfig?.prefilledMessage,
                    },
                  })
                }
                disabled={updateSettingsMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsappMessage">WhatsApp Prefilled Message</Label>
              <Input
                id="whatsappMessage"
                placeholder="Hello, I would like to inquire about..."
                value={formData.whatsappConfig?.prefilledMessage || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    whatsappConfig: {
                      phoneNumber: formData.whatsappConfig?.phoneNumber || '',
                      prefilledMessage: e.target.value,
                    },
                  })
                }
                disabled={updateSettingsMutation.isPending}
              />
            </div>
          </div>

          <Button type="submit" disabled={updateSettingsMutation.isPending} className="w-full">
            {updateSettingsMutation.isPending ? (
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
        </form>
      </CardContent>
    </Card>
  );
}
