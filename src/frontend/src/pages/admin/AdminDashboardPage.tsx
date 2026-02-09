import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminProductsPanel from './AdminProductsPanel';
import AdminEnquiriesPanel from './AdminEnquiriesPanel';
import AdminSettingsPanel from './AdminSettingsPanel';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    document.title = 'Admin Dashboard - Onkar Raj Infra';
  }, []);

  return (
    <div className="py-12">
      <div className="container">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage products, view enquiries, and update site settings
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="enquiries">Enquiries</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            <AdminProductsPanel />
          </TabsContent>

          <TabsContent value="enquiries" className="mt-6">
            <AdminEnquiriesPanel />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <AdminSettingsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
